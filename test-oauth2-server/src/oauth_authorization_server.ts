import {
  AuthorizationServer,
  DateInterval,
  JwtService,
} from '@jmondi/oauth2-server';
import {
  inMemoryAccessTokenRepository,
  inMemoryAuthCodeRepository,
  inMemoryClientRepository,
  inMemoryScopeRepository,
  inMemoryUserRepository,
} from './repository';
import { jwtSecret } from './settings';

const clientRepository = inMemoryClientRepository;
const authCodeRepository = inMemoryAuthCodeRepository;
const tokenRepository = inMemoryAccessTokenRepository;
const scopeRepository = inMemoryScopeRepository;
const userRepository = inMemoryUserRepository;

const jwtService = new JwtService(jwtSecret);

const authorizationServer = new AuthorizationServer(
  authCodeRepository,
  clientRepository,
  tokenRepository,
  scopeRepository,
  userRepository,
  jwtService,
  { requiresPKCE: false }
);

authorizationServer.enableGrantType(
  'authorization_code',
  new DateInterval('1m')
);
// authorizationServer.enableGrantType(
//   "client_credentials",
//   new DateInterval("1m")
// );
authorizationServer.enableGrantType('implicit', new DateInterval('1m'));
// authorizationServer.enableGrantType("password", new DateInterval("1m"));
// authorizationServer.enableGrantType("refresh_token", new DateInterval("1m"));

export { authorizationServer as inMemoryAuthorizationServer };
