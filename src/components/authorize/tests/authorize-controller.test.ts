import { expect } from "chai";
import { describe } from "mocha";

import { sinon } from "../../../../test/utils/test-utils";
import { Request, Response } from "express";

import { authorizeGet } from "../authorize-controller";
import { CookieConsentServiceInterface } from "../../common/cookie-consent/types";
import {
  COOKIE_CONSENT,
  OIDC_PROMPT,
  PATH_NAMES,
} from "../../../app.constants";
import {
  mockRequest,
  mockResponse,
  RequestOutput,
  ResponseOutput,
} from "mock-req-res";
import {
  AuthorizeServiceInterface,
  JwtServiceInterface,
  KmsDecryptionServiceInterface,
} from "../types";
import { BadRequestError, QueryParamsError } from "../../../utils/error";

describe("authorize controller", () => {
  let req: RequestOutput;
  let res: ResponseOutput;
  let authServiceResponseData: any;
  let fakeAuthorizeService: AuthorizeServiceInterface;
  let fakeKmsDecryptionService: KmsDecryptionServiceInterface;
  let fakeJwtService: JwtServiceInterface;

  beforeEach(() => {
    req = mockRequest({
      path: PATH_NAMES.AUTHORIZE,
      session: { client: {}, user: {} },
      log: { info: sinon.fake() },
      t: sinon.fake(),
      i18n: { language: "en" },
      query: {
        client_id: "orchestrationAuth",
        response_type: "code",
      },
    });
    res = mockResponse();
    authServiceResponseData = createAuthServiceReponseData();

    fakeKmsDecryptionService = {
      decrypt: sinon.fake.returns(Promise.resolve("jwt")),
    };
    fakeJwtService = {
      getPayloadWithValidation: sinon.fake.returns(
        Promise.resolve({ client_id: req.query.client_id } as any)
      ),
      validateCustomClaims: sinon.stub().returnsArg(0),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("authorizeGet", () => {
    it("should redirect to /sign-in-or-create page when no existing session for user", async () => {
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(PATH_NAMES.SIGN_IN_OR_CREATE);
    });

    it("should redirect to /sign-in-or-create page with cookie preferences set", async () => {
      authServiceResponseData.data.user = {
        cookieConsent: COOKIE_CONSENT.ACCEPT,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake.returns({
          value: JSON.stringify("cookieValue"),
          expiry: "cookieExpires",
        }),
      } as unknown as CookieConsentServiceInterface;

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.cookie).to.have.been.called;
      expect(res.redirect).to.have.calledWith(PATH_NAMES.SIGN_IN_OR_CREATE);
    });

    it("should redirect to /uplift page when uplift query param set and MfaType is SMS", async () => {
      authServiceResponseData.data.user = {
        upliftRequired: true,
        authenticated: true,
        mfaMethodType: "SMS",
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(PATH_NAMES.UPLIFT_JOURNEY);
    });

    it("should redirect to /enter-authenticator-app-code page when uplift query param set and MfaMethodType is AUTH_APP", async () => {
      authServiceResponseData.data.user = {
        upliftRequired: true,
        authenticated: true,
        mfaMethodType: "AUTH_APP",
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(
        PATH_NAMES.ENTER_AUTHENTICATOR_APP_CODE
      );
    });

    it("should redirect to /auth-code when existing session", async () => {
      req.session.user.isAuthenticated = true;
      authServiceResponseData.data.user = {
        consentRequired: false,
        identityRequired: false,
        upliftRequired: false,
        authenticated: true,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(PATH_NAMES.AUTH_CODE);
    });

    it("should redirect to /share-info when consent required", async () => {
      authServiceResponseData.data.user = {
        consentRequired: true,
        identityRequired: false,
        upliftRequired: false,
        authenticated: true,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(PATH_NAMES.SHARE_INFO);
    });

    it("should redirect to /identity page when identity check required", async () => {
      authServiceResponseData.data.user = {
        consentRequired: false,
        identityRequired: true,
        upliftRequired: false,
        authenticated: true,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(
        PATH_NAMES.PROVE_IDENTITY_WELCOME
      );
    });

    it("should redirect to /enter-password page when prompt is login", async () => {
      req.query.prompt = OIDC_PROMPT.LOGIN;
      authServiceResponseData.data.user = {
        consentRequired: false,
        identityRequired: false,
        upliftRequired: false,
        authenticated: true,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(PATH_NAMES.ENTER_PASSWORD);
    });

    it("should redirect to /sign-in-or-create page with _ga query param when present", async () => {
      const gaTrackingId = "2.172053219.3232.1636392870-444224.1635165988";
      authServiceResponseData.data.client.consentEnabled = true;
      authServiceResponseData.data.user = {
        consentRequired: false,
        identityRequired: false,
        upliftRequired: false,
        cookieConsent: COOKIE_CONSENT.ACCEPT,
        gaCrossDomainTrackingId: gaTrackingId,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake.returns({
          value: JSON.stringify("cookieValue"),
          expiry: "cookieExpires",
        }),
      } as unknown as CookieConsentServiceInterface;

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.cookie).to.have.been.called;
      expect(res.redirect).to.have.calledWith(
        `${PATH_NAMES.SIGN_IN_OR_CREATE}?_ga=${gaTrackingId}`
      );
    });

    it("should redirect to /doc-checking-app when doc check app user", async () => {
      authServiceResponseData.data.client.cookieConsentShared = false;
      authServiceResponseData.data.client.consentEnabled = false;
      authServiceResponseData.data.user = {
        authenticated: false,
        consentRequired: false,
        docCheckingAppUser: true,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake.returns({
          value: JSON.stringify("cookieValue"),
          expiry: "cookieExpires",
        }),
      } as unknown as CookieConsentServiceInterface;

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);

      expect(res.redirect).to.have.calledWith(PATH_NAMES.DOC_CHECKING_APP);
    });

    it("should throw an error with level Info if the authorize service returns a code 1000 Session-Id is missing or invalid", async () => {
      const fakeAuthorizeService: AuthorizeServiceInterface = {
        start: sinon.fake.returns({
          data: {
            code: 1000,
            message: "Session-Id is missing or invalid",
          },
          success: false,
        }),
      } as unknown as AuthorizeServiceInterface;

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await expect(
        authorizeGet(
          fakeAuthorizeService,
          fakeCookieConsentService,
          fakeKmsDecryptionService,
          fakeJwtService
        )(req as Request, res as Response)
      )
        .to.eventually.be.rejectedWith("1000:Session-Id is missing or invalid")
        .and.be.an.instanceOf(BadRequestError)
        .and.have.property("level", "Info");
    });

    it("should throw an error without level property if the authorize service returns a code 1001 Request is missing parameters", async () => {
      const fakeAuthorizeService: AuthorizeServiceInterface = {
        start: sinon.fake.returns({
          data: {
            code: 1001,
            message: "Request is missing parameters",
          },
          success: false,
        }),
      } as unknown as AuthorizeServiceInterface;

      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await expect(
        authorizeGet(
          fakeAuthorizeService,
          fakeCookieConsentService,
          fakeKmsDecryptionService,
          fakeJwtService
        )(req as Request, res as Response)
      )
        .to.eventually.be.rejectedWith("1001:Request is missing parameters")
        .and.be.an.instanceOf(BadRequestError)
        .and.not.to.have.property("level");
    });

    it("should get claims when jwe passed in", async () => {
      req.query.request = "JWE";
      authServiceResponseData.data.user = {
        consentRequired: false,
        identityRequired: false,
        upliftRequired: false,
        authenticated: true,
      };
      fakeAuthorizeService = mockAuthService(authServiceResponseData);
      const fakeCookieConsentService: CookieConsentServiceInterface = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };

      await authorizeGet(
        fakeAuthorizeService,
        fakeCookieConsentService,
        fakeKmsDecryptionService,
        fakeJwtService
      )(req as Request, res as Response);
      expect(fakeJwtService.validateCustomClaims).to.have.returned({
        client_id: "orchestrationAuth",
      });
    });
  });

  describe("Query parameters validation", () => {
    let fakeCookieConsentService: CookieConsentServiceInterface;

    beforeEach(() => {
      fakeAuthorizeService = mockAuthService(authServiceResponseData);
      fakeCookieConsentService = {
        getCookieConsent: sinon.fake(),
        createConsentCookieValue: sinon.fake(),
      };
    });

    it("should throw an error if client_id does not exist in the query params", async () => {
      delete req.query.client_id;

      await expect(
        authorizeGet(
          fakeAuthorizeService,
          fakeCookieConsentService,
          fakeKmsDecryptionService,
          fakeJwtService
        )(req as Request, res as Response)
      )
        .to.eventually.be.rejectedWith("Client ID does not exist")
        .and.be.an.instanceOf(QueryParamsError);
    });

    it("should throw an error if response_type does not exist in the query params", async () => {
      delete req.query.response_type;

      await expect(
        authorizeGet(
          fakeAuthorizeService,
          fakeCookieConsentService,
          fakeKmsDecryptionService,
          fakeJwtService
        )(req as Request, res as Response)
      )
        .to.eventually.be.rejectedWith("Response type does not exist")
        .and.be.an.instanceOf(QueryParamsError);
    });

    it("should throw an error if client_id value is incorrect in the query params", async () => {
      req.query.client_id = "wrong_client id";

      await expect(
        authorizeGet(
          fakeAuthorizeService,
          fakeCookieConsentService,
          fakeKmsDecryptionService,
          fakeJwtService
        )(req as Request, res as Response)
      )
        .to.eventually.be.rejectedWith("Client ID value is incorrect")
        .and.be.an.instanceOf(QueryParamsError);
    });
  });

  function mockAuthService(authResponseData: any): AuthorizeServiceInterface {
    return {
      start: sinon.fake.returns({
        ...authResponseData,
      }),
    } as unknown as AuthorizeServiceInterface;
  }

  function createAuthServiceReponseData(): any {
    return {
      data: {
        client: {
          scopes: ["openid", "profile"],
          serviceType: "MANDATORY",
          clientName: "Test client",
          cookieConsentShared: true,
        },
        user: {},
      },
      success: true,
    };
  }
});
