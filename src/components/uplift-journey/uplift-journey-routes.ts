import { PATH_NAMES } from "../../app.constants";

import * as express from "express";

import { validateSessionMiddleware } from "../../middleware/session-middleware";
import { asyncHandler } from "../../utils/async";
import { upliftJourneyGet } from "./uplift-journey-controller";
import { allowUserJourneyMiddleware } from "../../middleware/allow-user-journey-middleware";

const router = express.Router();

router.get(
  PATH_NAMES.UPLIFT_JOURNEY,
  validateSessionMiddleware,
  allowUserJourneyMiddleware,
  asyncHandler(upliftJourneyGet())
);

export { router as upliftJourneyRouter };
