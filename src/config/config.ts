import { configOverridesGenerated } from './config-overrides-generated';

//===============================
// Default configurations
//===============================

const Config = {
  AUTH_SERVER:             'http://192.168.0.7:8080',
  RESOURCE_SERVER:         'http://192.168.0.7:9080',
  DEVELOPER_MODE:          false,
  DEVELOPER_ACCESS_TOKEN:  '881fdeb8-0509-4fce-be6d-2fa76863ef99',
  CODE_VERSION:            '1.0.0',
  DEFAULT_USERNAMES:       ['Administrator', 'Pa55word']
};

function mergeConfigurations() {
  for (let attributeName of Object.keys(configOverridesGenerated)) {
    Config[attributeName] = configOverridesGenerated[attributeName];
  }
}

mergeConfigurations();

export { Config }
