import express from "express";

const router = express.Router();

router.get(
  "/user",
  // oauthServer.authenticate(),
  (req, res) => {
    // const { password, ...rest } = res.locals.oauth.token.user;
    // res.json(rest);
    res.status(404).json({ error: "Not Implemented" });
  }
);

export default router;
