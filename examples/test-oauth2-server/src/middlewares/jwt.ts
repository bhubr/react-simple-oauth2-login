import { expressjwt as jwt } from 'express-jwt';
import { jwtSecret } from '../settings';

const jwtMiddleware = jwt({ secret: jwtSecret, algorithms: ['HS256'] });

export default jwtMiddleware;
