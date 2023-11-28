environment         = "production"
common_state_bucket = "digital-identity-prod-tfstate"
redis_node_size     = "cache.m4.xlarge"

frontend_auto_scaling_enabled                                       = true
frontend_task_definition_cpu                                        = 512
frontend_task_definition_memory                                     = 1024
frontend_auto_scaling_min_count                                     = 4
frontend_auto_scaling_max_count                                     = 12
ecs_desired_count                                                   = 4
support_international_numbers                                       = "1"
support_account_recovery                                            = "1"
support_smart_agent                                                 = "1"
support_account_interventions                                       = "0"
client_name_that_directs_all_contact_form_submissions_to_smartagent = "di-auth-stub-relying-party-production"
support_welsh_language_in_support_forms                             = "1"
url_for_support_links                                               = "https://home.account.gov.uk/contact-gov-uk-one-login"

logging_endpoint_arns = [
  "arn:aws:logs:eu-west-2:885513274347:destination:csls_cw_logs_destination_prodpython"
]

dynatrace_secret_arn                     = "arn:aws:secretsmanager:eu-west-2:216552277552:secret:DynatraceProductionVariables"
frame_ancestors_form_actions_csp_headers = "1"
