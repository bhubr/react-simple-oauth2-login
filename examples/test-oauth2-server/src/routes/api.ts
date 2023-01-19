import express, { Request, Response } from 'express';
import { inMemoryUserRepository } from '../repository';

const router = express.Router();

type JwtAuthRequest = Request & { auth: any };

router.get(
  '/user',
  // @ts-ignore
  async (req: JwtAuthRequest, res: Response) => {
    // Get user id
    const { sub } = req.auth;

    // Additionally, we could (and should in production) check if
    // the scope required to access this resource is contained in the JWT

    // Find user by her/his id
    const user = await inMemoryUserRepository.getUserByCredentials(sub);
    // Shouldn't ever happen here
    if (!user) {
      return res
        .status(404)
        .json({ error: `User with id \`${sub}\` not found` });
    }
    // Send back user data
    return res.json(user);
  }
);

export default router;
