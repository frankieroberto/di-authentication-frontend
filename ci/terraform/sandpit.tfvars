redis_service_plan      = "tiny-5_x"
environment             = "sandpit"
common_state_bucket     = "digital-identity-dev-tfstate"
cf_org_name             = "gds-digital-identity-authentication"
aws_region              = "eu-west-2"
account_management_fqdn = "acc-mgmt-fg.sandpit.auth.ida.digital.cabinet-office.gov.uk"
oidc_api_fqdn           = "api.sandpit.auth.ida.digital.cabinet-office.gov.uk"
frontend_fqdn           = "signin-fg.sandpit.auth.ida.digital.cabinet-office.gov.uk"
frontend_api_fqdn       = "auth.sandpit.auth.ida.digital.cabinet-office.gov.uk"
service_domain          = "sandpit.auth.ida.digital.cabinet-office.gov.uk"
zone_id                 = "Z050645231Q0HZAX6FT5W"
image_uri               = "706615647326.dkr.ecr.eu-west-2.amazonaws.com/frontend-image-repository"
image_digest            = "sha256:dfbe4c6ccbbaf4c8ae7589a31d0bf73940cef19b8cfcb3eaf20c35cfed6a693d"
session_expiry          = 300000
gtm_id                  = ""
public_access           = true

