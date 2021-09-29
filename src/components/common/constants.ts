import { PATH_NAMES, USER_STATE } from "../../app.constants";

const STATE_TO_PATH_MAPPING: { [p: string]: string } = {
  [USER_STATE.MFA_SMS_MAX_CODES_SENT]:
    PATH_NAMES["SECURITY_CODE_REQUEST_EXCEEDED"],
  [USER_STATE.MFA_CODE_REQUESTS_BLOCKED]: PATH_NAMES["SECURITY_CODE_WAIT"],
  [USER_STATE.EMAIL_MAX_CODES_SENT]:
    PATH_NAMES["SECURITY_CODE_REQUEST_EXCEEDED"],
  [USER_STATE.EMAIL_CODE_REQUESTS_BLOCKED]: PATH_NAMES["SECURITY_CODE_WAIT"],
  [USER_STATE.PHONE_NUMBER_MAX_CODES_SENT]:
    PATH_NAMES["SECURITY_CODE_REQUEST_EXCEEDED"],
  [USER_STATE.PHONE_NUMBER_CODE_REQUESTS_BLOCKED]:
    PATH_NAMES["SECURITY_CODE_WAIT"],
  [USER_STATE.EMAIL_CODE_MAX_RETRIES_REACHED]:
    PATH_NAMES["SECURITY_CODE_INVALID"],
  [USER_STATE.PHONE_NUMBER_CODE_MAX_RETRIES_REACHED]:
    PATH_NAMES["SECURITY_CODE_INVALID"],
  [USER_STATE.MFA_CODE_MAX_RETRIES_REACHED]:
    PATH_NAMES["SECURITY_CODE_INVALID"],
  [USER_STATE.AUTHENTICATED]: PATH_NAMES["AUTH_CODE"],
  [USER_STATE.LOGGED_IN]: PATH_NAMES["ENTER_MFA"],
  [USER_STATE.REQUIRES_TWO_FACTOR]:
    PATH_NAMES["CREATE_ACCOUNT_ENTER_PHONE_NUMBER"],
  [USER_STATE.ACCOUNT_LOCKED]: PATH_NAMES["ACCOUNT_LOCKED"],
  [USER_STATE.UPDATED_TERMS_AND_CONDITIONS]:
    PATH_NAMES["UPDATED_TERMS_AND_CONDITIONS"],
  [USER_STATE.UPDATED_TERMS_AND_CONDITIONS_ACCEPTED]: PATH_NAMES["AUTH_CODE"],
  [USER_STATE.UPLIFT_REQUIRED_CM]: PATH_NAMES["UPLIFT_JOURNEY"],
  [USER_STATE.CONSENT_ADDED]: PATH_NAMES["AUTH_CODE"],
  [USER_STATE.USER_NOT_FOUND]: PATH_NAMES["ACCOUNT_NOT_FOUND"],
  [USER_STATE.VERIFY_EMAIL_CODE_SENT]: PATH_NAMES["CHECK_YOUR_EMAIL"],
  [USER_STATE.EMAIL_CODE_VERIFIED]: PATH_NAMES["CREATE_ACCOUNT_SET_PASSWORD"],
  [USER_STATE.CONSENT_REQUIRED]: PATH_NAMES["SHARE_INFO"],
  [USER_STATE.MFA_CODE_VERIFIED]: PATH_NAMES["AUTH_CODE"],
  [USER_STATE.VERIFY_PHONE_NUMBER_CODE_SENT]: PATH_NAMES["CHECK_YOUR_PHONE"],
  [USER_STATE.LOGGED_IN]: PATH_NAMES["ENTER_MFA"],
  [USER_STATE.MFA_SMS_CODE_SENT]: PATH_NAMES["ENTER_MFA"],
  [USER_STATE.AUTHENTICATION_REQUIRED]: PATH_NAMES["ENTER_PASSWORD"],
  [USER_STATE.AUTHENTICATION_REQUIRED_ACCOUNT_EXISTS]:
    PATH_NAMES["ENTER_PASSWORD_ACCOUNT_EXISTS"],
  [USER_STATE.TWO_FACTOR_REQUIRED]:
    PATH_NAMES["CREATE_ACCOUNT_ENTER_PHONE_NUMBER"],
  [USER_STATE.PHONE_NUMBER_CODE_VERIFIED]:
    PATH_NAMES["CREATE_ACCOUNT_SUCCESSFUL"],
};

export function getNextPathByState(sessionState: string): string {
  let nextPath = STATE_TO_PATH_MAPPING[sessionState];

  if (!nextPath) {
    nextPath = PATH_NAMES.SIGN_IN_OR_CREATE;
  }

  return nextPath;
}
