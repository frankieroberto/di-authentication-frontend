import { expect } from "chai";
import { describe } from "mocha";

import { sinon } from "../../../../test/utils/test-utils";
import { Request, Response } from "express";

import { DocCheckingAppInterface } from "../types";
import {
  mockRequest,
  mockResponse,
  RequestOutput,
  ResponseOutput,
} from "mock-req-res";
import { PATH_NAMES } from "../../../app.constants";
import { docCheckingAppGet } from "../doc-checking-app-controller";

describe("doc checking app controller", () => {
  let req: RequestOutput;
  let res: ResponseOutput;

  beforeEach(() => {
    req = mockRequest({
      path: PATH_NAMES.DOC_CHECKING_APP,
      session: { client: {}, user: {} },
      log: { info: sinon.fake() },
    });
    res = mockResponse();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("docCheckingAppGet", () => {
    it("should redirect to doc checking authorisation api", async () => {
      const fakeService: DocCheckingAppInterface = {
        docCheckingAppAuthorize: sinon.fake.returns({
          success: true,
          data: {
            redirectUri: "https://test-doc-checking-authorisation-uri.com",
          },
        }),
      } as unknown as DocCheckingAppInterface;

      res.locals.sessionId = "s-123456-djjad";
      res.locals.clientSessionId = "c-123456-djjad";
      res.locals.persistentSessionId = "dips-123456-abc";

      await docCheckingAppGet(fakeService)(req as Request, res as Response);

      expect(req.session.user.journey.nextPath).to.equal(
        PATH_NAMES.DOC_CHECKING_APP_CALLBACK
      );
      expect(res.redirect).to.have.calledWith(
        "https://test-doc-checking-authorisation-uri.com"
      );
    });
    it("should throw error when bad API request", async () => {
      const fakeService: DocCheckingAppInterface = {
        docCheckingAppAuthorize: sinon.fake.returns({
          success: false,
          data: { code: "1222", message: "Error occurred" },
        }),
      } as unknown as DocCheckingAppInterface;

      res.locals.sessionId = "s-123456-djjad";
      res.locals.clientSessionId = "c-123456-djjad";
      res.locals.persistentSessionId = "dips-123456-abc";

      await expect(
        docCheckingAppGet(fakeService)(req as Request, res as Response)
      ).to.be.rejectedWith("1222:Error occurred");
    });
  });
});
