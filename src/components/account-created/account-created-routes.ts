import { PATH_NAMES } from "../../app.constants";

import * as express from "express";
import { accountCreatedGet } from "./account-created-controller";
import { validateSessionMiddleware } from "../../middleware/session-middleware";

const router = express.Router();

router.get(
  PATH_NAMES.CREATE_ACCOUNT_SUCCESSFUL,
  validateSessionMiddleware,
  accountCreatedGet
);

export { router as registerAccountCreatedRouter };
