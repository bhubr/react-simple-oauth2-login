import express from 'express';

import auth from './auth';
import home from './home';
import api from './api';
import jwtMiddleware from '../middlewares/jwt';

const router = express.Router();

// Protect only API endpoints with JWT middleware
router.use('/api', jwtMiddleware, api);
router.use('/auth', auth);
router.use('/', home);

export default router;
