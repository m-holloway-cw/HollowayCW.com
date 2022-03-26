var mongo = require('./mongoUtil');


async function getCaveInfo(callback){
var dbo = mongo.getDb();
console.log('found request services file');
await dbo.collection("products").find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
  });

	callback("info");
}

module.exports.getCaveInfo = getCaveInfo;
