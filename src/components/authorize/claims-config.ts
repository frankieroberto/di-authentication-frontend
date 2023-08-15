export const EXPECTED_CLIENT_ID = "orchestrationAuth";

export function getKnownClaims(): {
  [key: string]: string | boolean | number;
} {
  return {
    client_id: "UNKNOWN",
    aud: "UNKNOWN",
  };
}

// Single source of truth for claims type and claims object keys

export type Claims = typeof claimsInstance;
// construct object for type
const claimsInstance = getClaimsObject();
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getClaimsObject() {
  return {
    iss: "",
    aud: "",
    exp: NaN,
    iat: NaN,
    nbf: NaN,
    jti: "",
    client_name: "",
    cookie_consent_shared: false,
    consent_required: false,
    is_one_login_service: false,
    service_type: "",
    govuk_signin_journey_id: "",
    confidence: "",
    state: "",
    client_id: "",
    scope: "",
    redirect_uri: "",
  };
}
