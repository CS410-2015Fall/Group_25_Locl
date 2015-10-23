var RNDBModel = require('react-native-db-models')
 
var DB = {
    "storeID": new RNDBModel.create_db('storeID'),
    "status": new RNDBModel.create_db('status'),
}
 
module.exports = DB