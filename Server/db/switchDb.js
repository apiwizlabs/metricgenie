const connectToDb = require("./db.connect");
const mongoose = require("mongoose");
const config = require("../config")

const switchDB = async (dbName) => {
  const dbPool = await mongoose.createConnection(config.DB_URL).asPromise();
  const tenantDb = dbPool.useDb(dbName, { useCache: true });

  if (tenantDb) {

    return tenantDb;
  } else {
    throw new Error("Could not switch to tenant DB");
  }
};

module.exports = { switchDB };
