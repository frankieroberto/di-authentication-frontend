import { Request, Response } from "express";
import {
  SecurityCodeErrorType,
  pathWithQueryParam,
  SECURITY_CODE_ERROR,
} from "../common/constants";
import { PATH_NAMES } from "../../app.constants";

export function securityCodeInvalidGet(req: Request, res: Response): void {
  res.render("security-code-error/index.njk", {
    newCodeLink: pathWithQueryParam(
      getNewCodePath(req.query.actionType as SecurityCodeErrorType),
      SECURITY_CODE_ERROR,
      req.query.actionType as SecurityCodeErrorType
    ),
    isAuthApp: isAuthApp(req.query.actionType as SecurityCodeErrorType),
    isBlocked: req.query.actionType !== SecurityCodeErrorType.EmailMaxRetries,
  });
}

export function securityCodeTriesExceededGet(
  req: Request,
  res: Response
): void {
  res.cookie("re", "true", { maxAge: 15 * 60 * 1000, httpOnly: true });
  return res.render("security-code-error/index-too-many-requests.njk", {
    newCodeLink: getNewCodePath(req.query.actionType as SecurityCodeErrorType),
    isResendCodeRequest: req.query.isResendCodeRequest,
  });
}

export function securityCodeCannotRequestCodeGet(
  req: Request,
  res: Response
): void {
  res.render("security-code-error/index-too-many-requests.njk", {
    newCodeLink: getNewCodePath(req.query.actionType as SecurityCodeErrorType),
  });
}

export function securityCodeEnteredExceededGet(
  req: Request,
  res: Response
): void {
  res.render("security-code-error/index-security-code-entered-exceeded.njk", {
    newCodeLink: isAuthApp(req.query.actionType as SecurityCodeErrorType)
      ? PATH_NAMES.ENTER_AUTHENTICATOR_APP_CODE
      : PATH_NAMES.ENTER_MFA,
    isAuthApp: isAuthApp(req.query.actionType as SecurityCodeErrorType),
  });
}

function getNewCodePath(actionType: SecurityCodeErrorType) {
  switch (actionType) {
    case SecurityCodeErrorType.MfaMaxCodesSent:
    case SecurityCodeErrorType.MfaBlocked:
      return PATH_NAMES.RESEND_MFA_CODE;
    case SecurityCodeErrorType.MfaMaxRetries:
    case SecurityCodeErrorType.AuthAppMfaMaxRetries:
      return PATH_NAMES.SECURITY_CODE_ENTERED_EXCEEDED;
    case SecurityCodeErrorType.OtpMaxCodesSent:
    case SecurityCodeErrorType.OtpBlocked:
    case SecurityCodeErrorType.OtpMaxRetries:
      return PATH_NAMES.CREATE_ACCOUNT_ENTER_PHONE_NUMBER;
    case SecurityCodeErrorType.EmailMaxCodesSent:
    case SecurityCodeErrorType.EmailBlocked:
      return PATH_NAMES.SECURITY_CODE_CHECK_TIME_LIMIT;
    case SecurityCodeErrorType.EmailMaxRetries:
      return PATH_NAMES.RESEND_EMAIL_CODE + "?requestNewCode=true";
  }
}

function isAuthApp(actionType: SecurityCodeErrorType) {
  switch (actionType) {
    case SecurityCodeErrorType.AuthAppMfaMaxRetries:
      return true;
    default:
      return false;
  }
}
