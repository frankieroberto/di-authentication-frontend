import { JwtServiceInterface } from "./types";
import { getOrchToAuthSigningPublicKey } from "../../config";
import { JwtClaimsValueError, JwtValidationError } from "../../utils/error";
import { Claims, getClaimsObject, getKnownClaims } from "./claims-config";
import * as jose from "jose";

export class JwtService implements JwtServiceInterface {
  private readonly publicKey;

  constructor(publicKey = getOrchToAuthSigningPublicKey()) {
    this.publicKey = publicKey;
  }

  async getPayloadWithValidation(jwt: string): Promise<Claims> {
    let claims: any;
    try {
      const tempkey = await jose.importSPKI(this.publicKey, "ES256");
      claims = (
        await jose.jwtVerify(jwt, tempkey, {
          requiredClaims: Object.keys(getClaimsObject()),
          clockTolerance: 30,
        })
      ).payload;
    } catch (error) {
      throw new JwtValidationError(error.message);
    }

    const validatedClaims: Claims = this.validateCustomClaims(claims);
    return validatedClaims;
  }

  validateCustomClaims(claims: any): Claims {
    const requiredclaims = getKnownClaims();

    Object.keys(requiredclaims).forEach((claim) => {
      if (requiredclaims[claim] !== claims[claim]) {
        throw new JwtClaimsValueError(`${claim} has incorrect value`);
      }
    });
    return claims;
  }
}
