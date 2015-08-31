var config = {
  production: {},
  staging: {},
  development: {
    serverPath: 'http://pathtoserver',
    dbconfig: {
      name: 'db name',
      username: 'username',
      password: ''
    },
    googleAuth: {
      clientId: 'our-client-id-here',
      clientSecret: 'our-client-secret-here',
      callbackUrl: 'http://localhost:3000/api/auth/google/callback'
    },
    facebookAuth: {
      clientId: 'our-client-id-here',
      clientSecret: 'our-client-secret-here',
      callbackUrl: 'http://localhost:3000/api/auth/facebook/callback'
    },
    secret: 'development'
  }
};


exports.get = function get(env) {
  return config[env] || config.development;
}
