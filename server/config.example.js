var config = {
  production: {},
  staging: {},
  development: {
    dbconfig: {
      name: 'db name',
      username: 'username'
    },
    secret: 'development'
  }
};


exports.get = function get(env) {
  return config[env] || config.development;
}
