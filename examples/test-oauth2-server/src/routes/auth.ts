import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/login', (req, res) => {
  const errors = {
    '1': 'Wrong email or password',
  };
  const { redirect, error: errorCode } = req.query;
  // @ts-ignore
  const errorMessage = errorCode ? errors[errorCode] : null;
  console.log('>> login err', errorCode, errorMessage);
  res.render('login', { redirect, errorMessage });
});

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/auth/login?error=1' }),
  (req, res) => {
    const { redirect: redirectTo } = req.body;
    res.redirect(redirectTo || '/');
  }
);

router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('connect.sid');
  res.redirect('/');
});

export default router;
