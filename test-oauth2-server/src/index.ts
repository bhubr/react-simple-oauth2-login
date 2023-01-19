import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import util from 'util';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import morgan from 'morgan';
import {
  requestFromExpress,
  handleExpressError,
  handleExpressResponse,
} from '@jmondi/oauth2-server/dist/adapters/express';
import { body, query, validationResult } from 'express-validator';

import { inMemoryAuthorizationServer } from './oauth_authorization_server';
import router from './routes';
import userModel, { MyUser } from './models/user';
import {
  AuthorizationRequest,
  generateRandomToken,
} from '@jmondi/oauth2-server';

// Extend express-session so that we can store
// auth request in session
type AuthorizationRequestWithUser = AuthorizationRequest & {
  user?: MyUser;
  isAuthorizationApproved?: boolean;
};
declare module 'express-session' {
  interface SessionData {
    authRequest?: AuthorizationRequestWithUser;
    user?: MyUser;
    verificationToken?: string;
  }
}

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  session({
    resave: true,
    secret: 'dummy-secret',
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

interface PassportCallbackMessage {
  message: string;
}

interface PassportCallback {
  (
    nullableErr: Error | null,
    result?: boolean | MyUser,
    message?: PassportCallbackMessage
  ): void;
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email: string, password: string, done: PassportCallback) => {
      userModel
        .findOneByEmail(email)
        .then((user: MyUser) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
          }
          if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

interface PassportSerializeCallback {
  (nullableErr: Error | null, userId?: number): void;
}

passport.serializeUser<any, any>(
  // @ts-ignore
  (user: MyUser, done: PassportSerializeCallback) => done(null, user.id)
);

passport.deserializeUser((id: string, done: PassportCallback) => {
  userModel
    .findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

const authorizationServer = inMemoryAuthorizationServer;

app.get(
  '/authorize',
  // username must be an email
  query('client_id').isString(),
  // password must be at least 5 chars long
  query('redirect_uri').isURL({ require_tld: false }),
  query('response_type').isIn(['token', 'code']),

  async (req: Request, res: Response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Redirect anonymous users to login page.
      const { user } = req;
      if (!req.session.authRequest) {
        const authRequest =
          await authorizationServer.validateAuthorizationRequest(
            requestFromExpress(req)
          );
        req.session.authRequest = authRequest as AuthorizationRequestWithUser;
      }

      if (!user) {
        const redirectTo = util.format(
          '/authorize?client_id=%s&redirect_uri=%s&response_type=%s&scope=%s',
          req.query.client_id,
          req.query.redirect_uri,
          req.query.response_type,
          req.query.scope
        );
        req.session.save();
        return res.redirect(
          `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
        );
        // return res.redirect("/auth/login");
      }
      // The auth request object can be serialized and saved into a user's session.
      // You will probably want to redirect the user at this point to a login endpoint.

      const { authRequest } = req.session;
      // @ts-ignore
      authRequest.user = req.user;

      const verificationToken = generateRandomToken(16);
      req.session.verificationToken = verificationToken;

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.
      if (!authRequest.isAuthorizationApproved) {
        return res.render('authorize', {
          // @ts-ignore
          fullname: req.user.name,
          app: {
            name: authRequest.client.name,
            scopes: authRequest.scopes,
            owner: authRequest.client.userId,
          },
          action: `/oauth/authorize?response_type=${req.query.response_type}`,
          client_id: req.query.client_id,
          redirect_uri: req.query.redirect_uri,
          response_type: req.query.response_type,
          verification_token: verificationToken,
          grant_type: 'authorization_code',
          // scope: req.query.scope,
          user,
        });
      } else {
        const oauthResponse =
          await authorizationServer.completeAuthorizationRequest(authRequest);
        return handleExpressResponse(res, oauthResponse);
      }
    } catch (e) {
      console.error('>> authorize failed', e);
      handleExpressError(e, res);
    }
  }
);

app.post(
  '/authorize',
  body('verificationToken'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { authRequest, verificationToken: storedVerificationToken } =
      req.session;

    const validationErrors = [];
    if (!authRequest) {
      validationErrors.push({
        msg: 'Invalid value',
        param: 'authRequest',
        location: 'session',
      });
    }
    if (!storedVerificationToken) {
      validationErrors.push({
        msg: 'Invalid value',
        param: 'verificationToken',
        location: 'session',
      });
    }

    // authRequest check is redundant but f*cking TS won't leave me alone otherwise
    if (validationErrors.length > 0 || !authRequest) {
      return res.status(400).json({ errors: validationErrors });
    }

    const { verification_token: verificationToken } = req.body;

    if (verificationToken !== storedVerificationToken) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid verification token',
          },
        ],
      });
    }

    // Once the user has approved or denied the client update the status
    // (true = approved, false = denied)
    authRequest.isAuthorizationApproved = true;

    // Return the HTTP redirect response
    try {
      const oauthResponse =
        await authorizationServer.completeAuthorizationRequest(authRequest);
      // We're done *only* in the case of Implicit Grant
      // For Auth Code flow, keep the authRequest in session
      // @ts-ignore
      if (req.session.authRequest.grantTypeId === 'implicit') {
        delete req.session.authRequest;
      }
      delete req.session.verificationToken;
      return handleExpressResponse(res, oauthResponse);
    } catch (err) {
      return res
        .status(500)
        .json({ errors: [{ msg: (err as Error).message }] });
    }
  }
);

app.post('/token', async (req: Request, res: Response) => {
  try {
    const oauthResponse = await authorizationServer.respondToAccessTokenRequest(
      req
    );

    delete req.session.authRequest;
    delete req.session.verificationToken;
    return handleExpressResponse(res, oauthResponse);
  } catch (e) {
    handleExpressError(e, res);
    return;
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.render('error', { err });
});

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION', error.stack);
  process.exit(1);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening on ${port}`));
