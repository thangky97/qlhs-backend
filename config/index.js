module.exports = {
    LANG_DEFAULT: 'En',
    URL_IMAGE: 'https://apiqtraffic.c2i.asia/uploads/media',
    COMMON: {
        secret_key: 'bada2022',
        token_exprire: '1d',
        url_verify_email: process.env.URL_VERIFY_EMAIL,
        url_forgot_password: process.env.URL_FORGOT_PASSWORD,
        saltRounds: 10
    },
    DATABASE: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DB: process.env.DB_NAME,
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    DATABASE_QTRAFFIC : {
        DB_HOST: process.env.DB_QTRAFFIC_HOST,
        DB_DATABASE_NAME: process.env.DB_QTRAFFIC_DATABASE_NAME,
        DB_USER: process.env.DB_QTRAFFIC_USER,
        DB_USER_PASSWORD: process.env.DB_QTRAFFIC_USER_PASSWORD,
        DB_SERVER_DIALECT: process.env.DB_QTRAFFIC_SERVER_DIALECT
    },

    
    EMAIL: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        email: process.env.EMAIL_ADDRESS,
        password: process.env.EMAIL_PASSWORD
    },
    CAPTCHA: {
        url_captcha: process.env.CAPTCHA_URL,
        secret_key: process.env.CAPTCHA_SECRET_KEY
    },
    REDIS: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    },
    EMAIL_NOREPLY: process.env.EMAIL_NOREPLY
};