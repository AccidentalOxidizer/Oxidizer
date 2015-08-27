var config = {
  production: {},
  staging: {},
  development: {}
}

exports.get = function get(env) {
  return config[env] || config.development;
}
