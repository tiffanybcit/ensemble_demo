const {
    mongoURI
} = require("./mongoConnections");

const {getTotal, getDept} = require("./dataSort");
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

/**
 * MongoDB Write Labor / Sales Report Function
 * 
 * @param {string} collectionName
 * @param {object} queryConditions 
 */
function mongoWriteGeneral(collectionName, queryConditions) {
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
                const options = {
                    ordered: true,
                };

                dbo
                    .collection(collectionName)
                    .insertOne(queryConditions,
                        options,
                        function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                            db.close();
                        }
                    )

            }
        );
    })
}

/**
 * MongoDB Write Labor Report Function
 * 
 * @param {string} collectionName
 * @param {object} dataBlock
 */
function mongoWriteLabor(collectionName, dataBlock) {
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
                const options = {
                    ordered: true,
                };

                for (let item of dataBlock.rowobj) {
                    let queryConditions = {
                        total: getTotal(item),
                        year: dataBlock.year,
                        month: dataBlock.month,
                        dept: item["Dept Name"]
                    };
                    dbo
                        .collection(collectionName)
                        .insertOne(queryConditions,
                            options,
                            function (err, result) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            }
                        )
                }

            }
        );
    })
}

/**
 * MongoDB Write Sales Report Function
 * 
 * @param {string} collectionName
 * @param {object} dataBlock
 */
function mongoWriteSales(collectionName, dataBlock) {
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
                const options = {
                    ordered: true,
                };

                for (let item of dataBlock.rowobj) {
                    let queryConditions = {
                        shop: dataBlock.store,
                        year: dataBlock.year,
                        month: dataBlock.month,
                        dept: getDept(item.Category),
                        category: item.Category,
                        net: item["Net Sales"],
                        gross: item["Gross Sales"]
                    };
                    dbo
                        .collection(collectionName)
                        .insertOne(queryConditions,
                            options,
                            function (err, result) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            }
                        )
                }

            }
        );
    })
}


/**
 * MongoDB Update Task Function
 * 
 * @param {string} collectionName
 * @param {object} query
 * @param {object} newValues 
 */
function mongoUpdateTask(collectionName, query, newValues) {
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
                const options = {
                    ordered: true,
                };

                dbo
                    .collection(collectionName)
                    .updateOne(query, newValues, options,
                        function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                            db.close();
                        })
            }
        );
    })
}

/**
 * MongoDB Update Task Function
 * 
 * @param {string} collectionName
 * @param {object} query
 * @param {object} newValues 
 */
function mongoDeleteTask(collectionName, taskQuery) {
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
                const options = {
                    ordered: true,
                };

                dbo
                    .collection(collectionName)
                    .deleteOne(taskQuery, options,
                        function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                            db.close();
                        })
            }
        );
    })
}



module.exports = {
    mongoRead,
    mongoWriteGeneral,
    mongoWriteLabor,
    mongoWriteSales,
    mongoUpdateTask,
    mongoDeleteTask
}