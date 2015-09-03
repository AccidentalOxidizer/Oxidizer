var config = {
  production: {
    mysql: {
      host: process.env.OPENSHIFT_MYSQL_DB_HOST,
      url: process.env.OPENSHIFT_MYSQL_DB_URL,
      user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      port: process.env.OPENSHIFT_MYSQL_DB_PORT
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
    secret: 'some secret for production'
  },
  development: {
    mysql: {
      host: process.env.OPENSHIFT_MYSQL_DB_HOST,
      url: process.env.OPENSHIFT_MYSQL_DB_URL,
      user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      port: process.env.OPENSHIFT_MYSQL_DB_PORT
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
