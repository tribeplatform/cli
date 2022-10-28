export enum WebhookType {
  TEST = 'TEST',
  GET_SETTINGS = 'GET_SETTINGS', // TODO: Deprecate this when we have widgets
  UPDATE_SETTINGS = 'UPDATE_SETTINGS', // TODO: Deprecate this when we have widgets
  SUBSCRIPTION = 'SUBSCRIPTION',
  FEDERATED_SEARCH = 'FEDERATED_SEARCH',
  APP_INSTALLED = 'APP_INSTALLED',
  APP_UNINSTALLED = 'APP_UNINSTALLED',
  LoadBlock = 'LOAD_BLOCK', // TODO: Deprecate this when we have widgets
  Callback = 'Callback', // TODO: Deprecate this when we have widgets
  Interaction = 'INTERACTION',
}
