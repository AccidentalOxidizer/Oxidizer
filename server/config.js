var config = {
  production: {
    mysql: {
      host: process.env.OPENSHIFT_MYSQL_DB_HOST,
      url: process.env.OPENSHIFT_MYSQL_DB_URL,
      user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      database: process.env.OPENSHIFT_GEAR_NAME,
      port: process.env.OPENSHIFT_MYSQL_DB_PORT
    },
    dbconfig: {
      path: 'rust.c51qtfkqoyo7.us-east-1.rds.amazonaws.com',
      name: 'rust',
      username: 'adminYDlBuNu',
      password: 'V4xZ3WHXzvJE',
      port: '3306'
    },
    googleAuth: {
      clientId: '837204469183-nklfavnlll2v6jh0ku65tieuvc6qmhn1.apps.googleusercontent.com',
      clientSecret: 'mXAPIt-gVJqr4NeXIvVFTi_M',
      callbackUrl: 'http://localhost:3000/api/auth/google/callback'
    },
    facebookAuth: {
      clientId: '996722297026435',
      clientSecret: 'cf12933d9699db44e3577e54d2fda15e',
      callbackUrl: 'http://localhost:3000/api/auth/facebook/callback'
    },
    secret: 'development'
  },
  development: {
    mysql: {
      host: process.env.OPENSHIFT_MYSQL_DB_HOST,
      url: process.env.OPENSHIFT_MYSQL_DB_URL,
      user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      database: process.env.OPENSHIFT_GEAR_NAME,
      port: process.env.OPENSHIFT_MYSQL_DB_PORT
    },
    dbconfig: {
      name: 'rust',
      username: 'root',
      password: '',
      port: ''
    },
    googleAuth: {
      clientId: '837204469183-nklfavnlll2v6jh0ku65tieuvc6qmhn1.apps.googleusercontent.com',
      clientSecret: 'mXAPIt-gVJqr4NeXIvVFTi_M',
      callbackUrl: 'http://localhost:3000/api/auth/google/callback'
    },
    facebookAuth: {
      clientId: '996722297026435',
      clientSecret: 'cf12933d9699db44e3577e54d2fda15e',
      callbackUrl: 'http://localhost:3000/api/auth/facebook/callback'
    },
    secret: 'development'
  }
}

exports.get = function get(env) {
  return config[env] || config.production;
}


/*

Client ID:  837204469183-nklfavnlll2v6jh0ku65tieuvc6qmhn1.apps.googleusercontent.com ; Secret:  mXAPIt-gVJqr4NeXIvVFTi_M

Root User: adminYDlBuNu
Root Password: V4xZ3WHXzvJE
Database Name: accidential

Connection URL: mysql://$OPENSHIFT_MYSQL_DB_HOST:$OPENSHIFT_MYSQL_DB_PORT/

*/
