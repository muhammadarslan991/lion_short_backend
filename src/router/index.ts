import express from "express";

import AuthRouter from "../modules/auth/router";

const router = express.Router();

router.use("/auth", AuthRouter);

export default router;
