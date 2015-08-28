var config = {
  production: {},
  staging: {},
  development: {
    dbconfig: {
      name: 'db name',
      username: 'username'
    }
  }
};

exports.get = function get(env) {
  return config[env] || config.development;
}
