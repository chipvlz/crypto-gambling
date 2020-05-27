var express = require('express');
var router = express.Router();
var config = require('./../src/config')
var btcDepositAddressModel = require('./model/btc_deposit_address')
var userModel = require('./model/user')
var txnModel = require('./model/txn')
var variableModel = require('./model/variable');
var request = require('request');
var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');
var diff_minutes = require('./../utils/functions');
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
var clientObj = Client.init(config.COINBASE_KEY);
var DEPOSIT_ADDRESS_LIFETIME = 60*60;
var COIN_PER_BTC = config.COIN_PER_BTC;

router.post('/get_deposit_address', function (req, res , next) {
    var who = req.body.who;
    var isNewCode = req.body.is_new ? true : false;

    if( parseInt(who) == 0) {
        var resp = {
            code: 401,
            status: 'failed',
            message: 'You should log in first.',
            res: null
        };
        return res.json(resp);
    }

    btcDepositAddressModel.getDepositAddressData({who: who}, function (err, modelResult) {
        var chargeData = {
            'name': 'The ' + who + ' Individual',
            'description': 'Created by ' + who,
            'pricing_type': 'no_price'
        }

        if(err) {
            var resp = {
                code: 401,
                status: 'failed',
                message: null,
                res: null
            };
            return res.json(resp);
        } else {
            if(modelResult.length > 0){
                // var end = new Date((modelResult.content.UPDATE_TIME + DEPOSIT_ADDRESS_LIFETIME) * 1000);
                // var diff = diff_minutes(now, end);

                if ( isNewCode ) {
                    var old_input_address = req.body.input_address;
                    Charge.create(chargeData, function (error, apiResult) {
                        console.log('err: ', err)
                        var now = new Date(apiResult.created_at);
                        var expires_at = new Date(apiResult.expires_at);

                        btcDepositAddressModel.updateDepositStatus({
                            who: who,
                            input_address: old_input_address
                        }, function(err, updateResult) {
                            
                            if (err) {
                                var resp = {
                                    code: 401,
                                    status: 'failed',
                                    message: 'Update deposit status error!',
                                    res: null
                                };
                                return res.json(resp);
                            } else {
                                btcDepositAddressModel.insertNewDepositAddress({
                                    who:who,
                                    input_address:apiResult.addresses.bitcoin,
                                    destination:apiResult.hosted_url,
                                    input_address_id:apiResult.id,
                                    created_at: Math.floor(now.getTime() / 1000),
                                    expires_at: Math.floor(expires_at.getTime() / 1000)
                                },
                                function(err , subModelResult) {
                                    if (error) {
                                        var resp = {
                                            code: 401,
                                            status: 'failed',
                                            message: 'Deposit address error!',
                                            res: null
                                        };
                                        return res.json(resp);
                                    } else {
                                        // var now = new Date();
                                        // var end = new Date(Math.floor(Date.now()) + DEPOSIT_ADDRESS_LIFETIME * 1000);
                                        var resp = {
                                            code: 20000,
                                            status: 'success',
                                            message: null,
                                            start: new Date(),
                                            end: expires_at,
                                            address: apiResult.addresses.bitcoin
                                        };
                                        return res.json(resp);
                                    }
                                })
                            }
                        });
                    });
                } else {
                    var expires_at = new Date((modelResult.content.EXPIRES_TIME) * 1000);
                    var resp = {
                        code: 20000,
                        status: 'success',
                        message: null,
                        res: modelResult.content.INPUT_ADDRESS,
                        address: modelResult.content.INPUT_ADDRESS,
                        start: new Date(),
                        end: expires_at
                    };
                    return res.json(resp);
                }

            } else {
                Charge.create(chargeData, function (error, apiResult) {
                    var now = new Date(apiResult.created_at);
                    var expires_at = new Date(apiResult.expires_at);

                    btcDepositAddressModel.insertNewDepositAddress({
                        who:who,
                        input_address:apiResult.addresses.bitcoin,
                        destination:apiResult.hosted_url,
                        input_address_id:apiResult.id,
                        created_at: Math.floor(now.getTime() / 1000),
                        expires_at: Math.floor(expires_at.getTime() / 1000)
                    },
                    function(err , subModelResult) {
                        if (error) {
                            var resp = {
                                code: 401,
                                status: 'failed',
                                message: null,
                                res: null
                            };
                            return res.json(resp);
                        } else {
                            // var now = new Date();
                            // var end = new Date(Math.floor(Date.now()) + DEPOSIT_ADDRESS_LIFETIME * 1000);
                            var resp = {
                                code: 20000,
                                status: 'success',
                                message: null,
                                start: new Date(),
                                end: expires_at,
                                address: apiResult.addresses.bitcoin
                            };
                            return res.json(resp);
                        }
                    })
                });
            }
        }
    })
})

async function deposit(params, req, res) {
    var who = params.body.who;
    var satoshi_amount = params.body.value;
    var amount = satoshi_amount;
    //The transaction hash representing the initial payment to the input_address.
    var tx_hash = params.body.txhash ? params.body.txhash : 0;
    //The transaction hash of the generated transaction that forwards the payment from the input_address to the destination.
    var destination_txhash = params.body.txhash ? params.body.txhash : 0;
    var expires_at = params.body.expires_at;

    userModel.updateBalance({who: who, amount: amount}, function(err, modelResult) {
        if (!err) {
            var txnData = {
                who : who,
                type : 1,
                amount : amount,
                fees : 0,
                detail : tx_hash,
                txhash : destination_txhash,
                expires_at: expires_at
            }
            txnModel.insertTxn(txnData , function(err , subModelResult) {
                if (err) {
                    var resp = {
                        code: 401,
                        status: 'failed',
                        message: `deposit`,
                        res: null
                    };
                    return res.json(resp);
                } else {
                    var deposit_new_id = subModelResult.content.insertId;

                    txnModel.checkFirstDeposit(who)
                    .then((check_result) => {
                        if(!check_result) {
                            var resp = { code: 20000, status: 'success', message: null, res: null };
                            return res.json(resp);
                        }
                        //get my parent referral code
                        userModel.getParentReferralCode(who)
                        .then((my_parent_referral) => {
                            if(my_parent_referral['REFERRAL_CODE_P'] == '' || my_parent_referral['REFERRAL_CODE_P'] == null)  {
                                var resp = {
                                    code: 20000,
                                    status: 'success',
                                    message: null,
                                    res: null
                                };
                                return res.json(resp);
                            }
                            //get my parent userid using parent referral code
                            userModel.getUseridByParentReferralCode(my_parent_referral['REFERRAL_CODE_P'])
                            .then((parent_user_id) => {
                                //get referral percentage from database
                                variableModel.getReferralPercentage()
                                .then((referral_value) => {
                                    var referral_amount = parseInt(amount) * referral_value / 100
                                    referral_amount = parseInt(referral_amount)
                                    if(referral_amount == 0) {
                                        var resp = { code: 20000, status: 'success', message: null, res: null };
                                        return res.json(resp);
                                    }
                                    //update parent-user balance
                                    userModel.updateUserBalance({who: parent_user_id, amount: referral_amount})
                                    .then((ret) => {
                                        //update admin balance
                                        userModel.updateAdminBalance({who: 1, amount: referral_amount})
                                        .then((ret1) => {
                                            var txnData1 = {
                                                who : parent_user_id,
                                                type : 3,
                                                amount : parseFloat(amount * referral_value / 100).toFixed(8),
                                                fees : referral_value,
                                                detail : deposit_new_id,
                                                expires_at: expires_at,
                                                txhash : tx_hash
                                            }
                                            txnModel.insertTxn(txnData1 , function(err , subModelResult) {
                                                if (err) {
                                                    var resp = { code: 401, status: 'failed', message: null, res: null };
                                                    return res.json(resp);
                                                } else {
                                                    if (req.io) {
                                                        var updateInfo = {
                                                            ...txnData1,
                                                            who: parseInt(who)
                                                        }
                                                        req.io.emit('onMessage', {
                                                            code: 'UpdateWallet',
                                                            ...updateInfo
                                                        });
                                                    }
                                                    var resp = {
                                                        code: 20000,
                                                        status: 'success',
                                                        message: null,
                                                        res: null
                                                    };
                                                    return res.json(resp);
                                                }
                                            });
                                        })
                                        .catch((err) => {
                                            var resp = { code: 401, status: 'failed', message: 'update admin balance error', res: null };
                                            return res.json(resp);
                                        })
                                    })
                                    .catch((err) => {
                                        var resp = { code: 401, status: 'failed', message: 'update user balance error', res: null };
                                        return res.json(resp);
                                    })
                                })
                                .catch((err) => {
                                    var resp = { code: 401, status: 'failed', message: 'Get Refferal percent error', res: null };
                                    return res.json(resp);
                                })
                            })
                            .catch((err) => {
                                var resp = { code: 401, status: 'failed', message: 'Get user id by refferal code', res: null };
                                return res.json(resp);
                            })
                        })
                        .catch((err) => {
                            var resp = { code: 401, status: 'failed', message: 'getParentReferralCode error', res: null };
                            return res.json(resp);
                        })
                    })
                    .catch((err) => {
                        var resp = {
                            code: 401,
                            status: 'failed',
                            message: 'Check isFirst desposit error',
                            res: null
                        };
                        return res.json(resp);
                    })
                }
            });
        }
        else {
            var resp = {
                code: 401,
                status: 'failed',
                message: null,
                res: null
            };
            return res.json(resp);
        }
    });
}
router.post('/withdraw_confirm', function(req, res, next) {
    var who = req.body.who;
    var withdraw_id = req.body.withdraw_id;
    txnModel.confirmWithdraw(who , withdraw_id)
    .then((result) => {
        res.json({
            code: 20000, status: 'success',
            msg : null,
            data: null
        });
    })
    .catch((err) => {
        res.json({
            code: 401, status: 'failed',
            msg : 'Api request failed.',
            data: null
        });
    })
})
router.post('/withdraw_request', function(req, res, next) {
    var who = req.body.who;
    var to_address = req.body.to_address;
    var amount = parseFloat(req.body.amount);
    var amount_coins = parseInt(amount * Math.pow(10, 6));
    userModel.getUserBalance({who: who} , function(err , modelResult) {
        var userBalance = 0;
        if(modelResult.content.hasOwnProperty('WALLET')) {
            userBalance = modelResult.content.WALLET;
        }
        if(userBalance < amount_coins) {
            res.json({
                code: 401, status: 'failed',
                msg : 'Your balance is insufficient. You can\'t withdraw now.',
                data: null
            });
            return;
        }
        variableModel.getWithdrawalFee()
        .then((withdraw_fee) => {
            var calc_fee = parseFloat(amount * withdraw_fee / 100).toFixed(8);
            txnModel.requestWithdraw(who , amount , amount_coins , to_address , calc_fee)
            .then((result) => {
                res.json({
                    code: 20000, status: 'success',
                    msg : null,
                    data: {
                        available_amount: userBalance - amount_coins
                    }
                });
            })
            .catch((err) => {
                res.json({
                    code: 401, status: 'failed',
                    msg : 'Api request failed.',
                    data: null
                });
            })
        })
        .catch((err) => {
            res.json({
                code: 401, status: 'failed',
                msg : 'Api request failed.',
                data: null
            });
        })
    })
})
router.post('/withdraw' , function(req, res, next) {
    var who = req.body.who;
    var to_address = req.body.to_address;
    var amount = parseFloat(req.body.amount);
    var amount_coins = parseInt(config.COIN_PER_BTC * amount);
    var rem_amount = -1 * amount;
    var return_data = true;

    if(amount >= config.BTC_min_withdraw_amount) {
        if(return_data == true) {
            var check_user_balance = new Promise(function(check_user_balance_resolve, check_user_balance_reject) {
                userModel.getUserBalance({who: who} , function (err, modelResult) {
                    var available_balance = 0;
                    if(modelResult.content.hasOwnProperty('WALLET')) {
                        available_balance = modelResult.content.WALLET;
                    }
                    if(available_balance < amount_coins){
                        check_user_balance_resolve(false);
                    }else{
                        check_user_balance_resolve(true);
                    }
                })
            });

            check_user_balance.then(function(result) {
                return_data = result;
                if(return_data == true) {
                    var check_to_address_exists = new Promise(function(check_to_address_exists_resolve, check_to_address_exists_reject) {
                        var options = {
                            method: 'GET',
                            url: 'https://api.blockcypher.com/v1/btc/main/addrs/' + to_address,
                            json: true
                        };
                        request(options, function (err, response, apiResult) {
                            if(err){
                                check_to_address_exists_resolve(false);
                            }else{
                                check_to_address_exists_resolve(true);
                            }
                        });
                    });
                    check_to_address_exists.then(function(result) {
                        return_data = result;
                        if(return_data == true) {
                            var check_with_deposit_address = new Promise(function(check_with_deposit_address_resolve, check_with_deposit_address_reject) {
                                btcDepositAddressModel.getDepositAddressData({who: who}, function (err, modelResult) {
                                    if(err){
                                        check_with_deposit_address_resolve(false);
                                    }else{
                                        if(modelResult.length == 0){
                                            check_with_deposit_address_resolve(true);
                                        }else{
                                            if(modelResult.content.input_address == to_address){
                                                check_with_deposit_address_resolve(false);
                                            }else{
                                                check_with_deposit_address_resolve(true);
                                            }
                                        }
                                    }
                                })
                            });

                            check_with_deposit_address.then(function(result) {
                                return_data = result;
                                if(return_data == true) {
                                    if(config.BTC_SITE_WALLET_ADDRESS == to_address) {
                                        res.json({
                                            code: 401,
                                            status: 'failed',
                                            msg : "blocked address"
                                        });
                                    }
                                    else {
                                        var update_wallet = new Promise(function(update_wallet_resolve, update_wallet_reject) {
                                            usersModel.updateBalance({who: who, amount: rem_amount}, function (err, modelResult) {
                                                if(err){
                                                    update_wallet_resolve(false);
                                                }else{
                                                    update_wallet_resolve(true);
                                                }
                                            })
                                        });
                                        update_wallet.then(function(result) {
                                            return_data = result;
                                            if(return_data == true) {

                                                var send_txn = new Promise(function(send_txn_resolve) {
                                                    var send_amount = amount - config.BTC_withdraw_fee;
                                                    var satoshi_amount = send_amount * Math.pow(10, 8);
                                                    var satoshi_fee = config.BTC_withdraw_fee * Math.pow(10, 8);
                                                    var newtx = {
                                                        inputs: [{addresses: [config.BTC_SITE_WALLET_ADDRESS]}],
                                                        outputs: [{addresses: [to_address], value: satoshi_amount}],
                                                        fees: satoshi_fee
                                                    };
                                                    var keys = new bitcoin.ECPair(bigi.fromHex(config.BTC_SITE_PRIVATE_KEY));
                                                    var options = {
                                                        method: 'POST',
                                                        url: 'https://api.blockcypher.com/v1/bcy/test/txs/new',
                                                        body: newtx,
                                                        json: true
                                                    };

                                                    request(options, function (err, response, tx) {
                                                        if(err) {
                                                            send_txn_resolve(false);
                                                        } else {
                                                            tx.pubkeys = [];
                                                            tx.signatures = tx.tosign.map(function (tosign, n) {
                                                                tx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                                                                return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                                                            });
                                                            var options = {
                                                                method: 'POST',
                                                                url: 'https://api.blockcypher.com/v1/bcy/test/txs/send',
                                                                body: tx,
                                                                json: true
                                                            };
                                                            request(options, function (err, response, finaltx) {
                                                                if (err){
                                                                    send_txn_resolve(false);
                                                                }else{
                                                                    if (finaltx.errors){
                                                                        send_txn_resolve(false);
                                                                    }else{
                                                                        send_txn_resolve(finaltx.tx.hash);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                });

                                                send_txn.then(function(result) {
                                                    if(result) {
                                                        var txHash = result;
                                                        var txnData = {
                                                            who : who,
                                                            type : 2,
                                                            amount : amount,
                                                            fees : config.BTC_withdraw_fee,
                                                            detail : to_address,
                                                            txhash : txHash
                                                        }
                                                        txnModel.insertTxn(txnData , function(err , subModelResult) {
                                                            if (err) {
                                                                var resp = {
                                                                    code: 401,
                                                                    status: 'failed',
                                                                    message: null,
                                                                    res: null
                                                                };
                                                                return res.json(resp);
                                                            } else {
                                                                var resp = {
                                                                    code: 20000,
                                                                    status: 'success',
                                                                    message: null,
                                                                    res: txHash
                                                                };
                                                                return res.json(resp);
                                                            }
                                                        });
                                                    } else {
                                                        res.json({
                                                            code: 401,
                                                            status: 'failed',
                                                            msg : "service limited"
                                                        });
                                                    }
                                                });
                                            }
                                            else {
                                                res.json({
                                                    code: 401,
                                                    status: 'failed',
                                                    msg : "service limited"
                                                });
                                            }
                                        });
                                    }
                                } else if(return_data == false) {
                                    res.json({
                                        code: 401,
                                        status: 'failed',
                                        msg : "disabled address"
                                    });
                                } else {
                                    res.json({
                                        code: 401,
                                        status: 'failed',
                                        msg : "service limited"
                                    });
                                }
                            });
                        } else {
                            res.json({
                                code: 401,
                                status: 'failed',
                                msg : "invalid address"
                            });
                        }
                    });
                }
            });
        }
    } else {
        res.json({
            code: 401,
            status: 'failed',
            msg : "amount should be larger than " + config.BTC_min_withdraw_amount
        });
    }
})

router.post('/withdraw_log', async function (req, res) {
    const { start_date, end_date, page, limit } = req.body
    var i_page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    var i_limit = isNaN(parseInt(limit)) ? 1 : parseInt(limit)
    var ret = await txnModel.getWithdrawLog(start_date, end_date, i_page, i_limit)
    return res.json({
        code: 20000,
        data: ret
    });
})

router.post('/deposit_log', async function (req, res) {
    const { start_date, end_date, page, limit } = req.body
    var i_page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    var i_limit = isNaN(parseInt(limit)) ? 1 : parseInt(limit)
    var ret = await txnModel.getDepositLog(start_date, end_date, i_page, i_limit)
    return res.json({
        code: 20000,
        data: ret
    });
})

router.post('/referral_log', async function (req, res) {
    const { user_id, page, start_date, end_date, limit, txhash } = req.body
    var i_page = isNaN(parseInt(page)) ? 1 : parseInt(page)
    var i_limit = isNaN(parseInt(limit)) ? 1 : parseInt(limit)
    var ret = await txnModel.getReferralLog(user_id, txhash, start_date, end_date, i_page, i_limit)
    return res.json({
        code: 20000,
        data: ret
    });
})

router.post('/is_withdraw', async function(req, res) {
    try {
        var ret = await txnModel.isWithdrawRequest();    
        return res.json({
            code: 20000,
            data: ret,
            msg : null,
            status: 'success'
        });      
    } catch(error) {
        res.json({
            code: 401,
            status: 'failed',
            msg : "Api Request Failed."
        });   
    }
})

/*
 * Coinbase webhook
 *
 */
router.post('/payment_hook', function(req, res) {
    const { event } = req.body;
    const { type, data } = event;
    
    btcDepositAddressModel.getUserIdByChargeUrl({
        input_address: data.addresses.bitcoin,
        destination: data.hosted_url,
        input_address_id: data.id
    }, function (err, modelResult) {
        var errResp = {
            code: 401,
            status: 'failed',
            message: null,
            res: null
        };
        if(err) {
            errResp.message = 'DB search error!'
            return res.json(errResp);
        } else {
            if (modelResult.content) {
                // Check the event is pending or completed
                if (type == 'charge:confirmed') {
                    var resp = {
                        code: 20000,
                        status: 'success',
                        message: null,
                        res: modelResult.content.USER_ID
                    };

                    var params = {
                        body: {
                            value: parseFloat(data.payments[0].value.crypto.amount) * config.COIN_PER_BTC,
                            who: modelResult.content.USER_ID,
                            expires_at: new Date(data.expires_at) / 1000,
                            txhash: modelResult.content.TXHASH
                        }
                    }


                    console.log("~~~~~~~~~~~~~~~~~~", modelResult.content)
                    var confirmation_num = modelResult.content.CONFIRMATION_NUM + 1;

                    if (confirmation_num < 2) {

                        btcDepositAddressModel.updateDepositAddress({
                            who: modelResult.content.USER_ID,
                            input_address: data.addresses.bitcoin,
                            destination: data.hosted_url,
                            input_address_id: data.id,
                            confirmation_required: data.payments[0].block.confirmations_required,
                            confirmation_num: confirmation_num,
                            status: type.replace('charge:', '').toUpperCase(),
                            txhash: data.payments[0].block.hash
                        }, function (error, updateResult) {
                            if (error) {
                                errResp.message = 'Deposit address update error!';
                                return res.json(errResp);
                            } else {
                                return deposit(params, req, res);
                            }
                        });
                    } else {
                        var resp = {
                            code: 20000,
                            status: 'success',
                            message: 'Deposit address updated!',
                            res: modelResult.content.USER_ID
                        };
                        return res.json(resp);
                    }
                } else {
                    if (type != 'charge:created') {
                        var confirmation_num = 0;
                        if (modelResult.content.CONFIRMATION_NUM && type != 'charge:pending') {
                            confirmation_num = modelResult.content.CONFIRMATION_NUM + 1;
                        }
                        btcDepositAddressModel.updateDepositAddress({
                            who: modelResult.content.USER_ID,
                            input_address: data.addresses.bitcoin,
                            destination: data.hosted_url,
                            input_address_id: data.id,
                            confirmation_required: data.payments[0].block.confirmations_required,
                            confirmation_num: confirmation_num,
                            status: type.replace('charge:', '').toUpperCase(),
                            txhash: data.payments[0].block.hash
                        }, function (error, updateResult) {
                            if (error) {
                                errResp.message = 'Deposit address update error!';
                                return res.json(errResp);
                            } else {
                                var resp = {
                                    code: 20000,
                                    status: 'success',
                                    message: 'Deposit address updated!',
                                    res: modelResult.content.USER_ID
                                };
                                return res.json(resp);
                            }
                        })
                    }
                }
            } else {
                errResp.message = 'No record exits!';
                errResp.res = {
                    coin_address: data.addresses.bitcoin,
                    host_url: data.hosted_url
                }
                return res.json(errResp);
            }
        }

    })
})

router.post('/get_charges', function (req, res , next) {
    // sendUpdate();
    // Charge.list({}, function (error, list, pagination) {
    //     return res.json({
    //         code: 20000,
    //         data: list,
    //         msg : 'not confirmed',
    //         status: 'success'
    //     });
    // });
})

module.exports = router;