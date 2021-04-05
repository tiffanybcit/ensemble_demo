const {
    mongoURI
} = require("./mongoConnections");
const MongoClient = require("mongodb").MongoClient;
/**
 * MongoDB Read Function
 * 
 * @param {string} collectionName
 * @param {object} queryConditions 
 */
function mongoRead(collectionName, queryConditions) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(
            mongoURI, {
                // to allow users to fall back to the old parser if they find a bug in the new parser
                useNewUrlParser: true,
                // DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, 
                //and will be removed in a future version. To use the new Server Discover and Monitoring engine, 
                //pass option { useUnifiedTopology: true } to the MongoClient constructor.
                useUnifiedTopology: true
            },
            function (err, db) {
                if (err) throw err;
                var dbo = db.db("nemesis_project");
                dbo
                    .collection(collectionName)
                    .find(queryConditions)
                    .toArray(function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                        db.close();
                    });
            }
        );
    })
}

module.exports = {
    mongoRead,
}