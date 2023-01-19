import express, { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/types";
import appModel from "../models/app";

const router = express.Router();

// @ts-ignore
router.get("/", (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  if (!user) {
    return res.render("home", { user: null });
  }
  // @ts-ignore
  appModel.findByUserId(user.id).then((userApps: any[]) => {
    return res.render("home", { user, userApps });
  });
});

export default router;
