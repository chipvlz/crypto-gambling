var db = require('./../../utils/database');

exports.insertNewDepositAddress = function (insertData , callback) {
    var timestamp = Math.floor(Date.now() / 1000);
    var insertQuery =
    "INSERT INTO api_btc_deposit_address " +
    "(`USER_ID`, `INPUT_ADDRESS`, `INPUT_ADDRESS_ID`, `DESTINATION`, `CREATE_TIME`, `UPDATE_TIME`, `EXPIRES_TIME`, `STATUS`, `TXHASH`) " +
    "VALUES ('" + insertData.who + "', '" + insertData.input_address + "', '" + insertData.input_address_id + "', '" + insertData.destination + "', '" + insertData.created_at + "', " + insertData.created_at + ", " + insertData.expires_at + ", " + "'NEW', ''" + ")";

    db.con.query(insertQuery, function(err, rows, fields) {
        if (err) {
            return callback(err, null);
        }
        var return_data = {
            res: true,
            content: rows
        }
        return callback(null, return_data);
    });
}

exports.updateDepositAddress = function (updateData , callback) {
    var timestamp = Math.floor(Date.now() / 1000);
    var updateQuery =
    "UPDATE api_btc_deposit_address " +
    "SET `STATUS` = '" + updateData.status + "', `CONFIRMATION_REQUIRED` =" + updateData.confirmation_required + ", `CONFIRMATION_NUM`=" + updateData.confirmation_num + ", `UPDATE_TIME`=" + timestamp + ", `TXHASH`='" + updateData.txhash +"' " +
    "WHERE `USER_ID` = '" + updateData.who + "' AND `INPUT_ADDRESS` = '" + updateData.input_address + "' AND `INPUT_ADDRESS_ID` = '" + updateData.input_address_id + "';";

    db.con.query(updateQuery, function(err, rows, fields) {
        if (err) {
            return callback(err, null);
        }
        var return_data = {
            res: true,
            content: rows
        }
        return callback(null, return_data);
    });
}

exports.getDepositAddressData = function (keyData, callback) {
    var query = "SELECT * FROM api_btc_deposit_address WHERE USER_ID=" + keyData.who + " AND `STATUS`='NEW'";
    db.con.query(query, function (err, rows, fields) {
        if (err) {
            return callback(err, null);
        }else{
            var return_data = {
                res: true,
                content: rows[0],
                length: rows.length
            }
            return callback(null, return_data);
        }
    });
}

exports.getUserIdByChargeUrl = function (keyData, callback) {
    var query = "SELECT * FROM api_btc_deposit_address " +
    "WHERE INPUT_ADDRESS='" + keyData.input_address + "' AND DESTINATION='" + keyData.destination + "' AND INPUT_ADDRESS_ID='" + keyData.input_address_id  + "'";
    db.con.query(query, function (err, rows, fields) {
        if (err) {
            return callback(err, null);
        }else{
            var return_data = {
                res: true,
                content: rows[0],
                length: rows.length
            }
            return callback(null, return_data);
        }
    });
}

exports.updateDepositStatus = function (insertData, callback) {
    var query = "UPDATE api_btc_deposit_address SET `STATUS`='EXPIRED' WHERE USER_ID=" + insertData.who + " AND `INPUT_ADDRESS`='" + insertData.input_address + "' AND `STATUS`='NEW';";
    db.con.query(query, async (err, rows, fields) => {
        if (err) {
            return callback(err, null);
        }else{
            var return_data = {
                res: true,
                content: rows
            }
            return callback(null, return_data);
        }
    });
}
