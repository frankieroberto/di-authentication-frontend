import {
  getSmartAgentApiKey,
  getSmartAgentApiUrl,
  getSmartAgentWebformId,
} from "../config";

export interface SmartAgentConfig {
  webformID: string;
  apiKey: string;
  apiUrl: string;
}

const smartAgentConfig: SmartAgentConfig = {
  webformID: getSmartAgentWebformId(),
  apiKey: getSmartAgentApiKey(),
  apiUrl: getSmartAgentApiUrl(),
};

export default smartAgentConfig;
