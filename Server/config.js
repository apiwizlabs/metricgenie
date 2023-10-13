module.exports = {
    DB_URL: process.env.DB_URL, // take from env
    SPRINT_DB_URL: process.env.SPRINT_DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
    COOKIE_KEY: process.env.COOKIE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_USERNAME: process.env.AWS_BUCKET_NAME,
    AWS_ACCESSKEY: process.env.AWS_ACCESSKEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_REGION: process.env.AWS_REGION,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY
  };