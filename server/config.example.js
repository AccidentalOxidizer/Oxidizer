var config = {
  production: {},
  staging: {},
  development: {},
  default: {}
}

exports.get = function get(env) {
  return config[env] || config.default;
}
