var path = require('path');
var crash_port = 4202
var chat_port = 4204
var main_port = 3001
// var base_domain = "45.76.180.140"
var base_domain = "localhost"
// var base_domain = process.env.NODE_ENV === 'production' ? process.env.BASE_DOMAIN : "localhost"

var config = {
    debug: true,
    crash_port: crash_port,
    chat_port : chat_port,
    mysql : {
        host : 'localhost',
        user : 'root',
        password : '',
        database : ''
    },
    base_domain: base_domain,
    main_host_url : "http://" + base_domain + ":" + main_port + "/api/",
    //general_profile_url : "http://" + base_domain + ":7801/img/uploads/avatar/general_profile.png"c
    general_profile_url : "http://" + base_domain + ":8080/img/uploads/avatar/general_profile.png",

    BTC_SITE_WALLET_ADDRESS : "",
    BTC_SITE_PRIVATE_KEY : "",
    BTC_SITE_PUBLIC_KEY : "",
    BLOCKCYPHER_TOKEN : "",
    BLOCKCYPHER_CALLBACK_HOST_URL : "http://" + base_domain + ":" + main_port + "/",
    BTC_withdraw_fee: 0.00005,
    BTC_min_withdraw_amount: 0.0001,
    //MAIN_REFERRAL_PREFIX: "https://" + base_domain + "/#/home",
    MAIN_REFERRAL_PREFIX: "http://" + base_domain + "/#/home",
    //HOST: "https://" + base_domain,
    HOST: "http://" + base_domain,
    IMAGE_TEMP_DEST: "/var/www/html/bitcrash/temp",
    AVATAR_STORE_PATH: "/var/www/html/bitcrash/img/uploads/avatar/",

    //crash_host_url : "https://" + base_domain + ":" + crash_port + "/bot_apply".toString,
    crash_host_url : "http://" + base_domain + ":" + crash_port + "/bot_apply".toString,
    // crash_host_url : "https://" + base_domain + "/bot_apply".toString,


    EMAIL: 'no-reply@gmail.com',
    EMAIL_PWD: 'Rpy@2010!#_',
    EMAIL_REQUEST: 'https://cryptoonline.ml:3001/api/user/forgot_user_password',
    COINBASE_KEY: '',
    COIN_PER_BTC: Math.pow(10, 6)
}

module.exports = config