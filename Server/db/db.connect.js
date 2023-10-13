const mongoose = require("mongoose");
const config = require("../config");

let db = null

const connectToDatabase = async (dbName) => {
return new Promise((resolve, reject) => {
  if(db)
  {
    resolve(db);
    return db;
  }
  else {
    try {
      mongoose.connect(config.DB_URL, function(err, _db) {
        if(err){
          reject(err)
          return err;
        }
  
        db = _db
        logger.info("APIwiz Database connected")
        resolve(_db);
        return _db
      })
    }
    catch(err)
    {
      logger.error(err)
      return err;
    }
  }
})
};

module.exports = connectToDatabase;
