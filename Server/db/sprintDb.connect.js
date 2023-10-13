const mongoose = require("mongoose");
const config = require("../config");

let db = null

const connectToDatabase = async () => {
return new Promise((resolve, reject) => {
  if(db)
  {
    resolve(db);
    return db;
  }
  else {
    try {
      mongoose.createConnection(config.SPRINT_DB_URL, function(err, _db) {
        if(err){
          reject(err)
          return err;
        }
  
        db = _db
        logger.info("Sprint Database connected")
        resolve(_db);
        return _db
      })
    }
    catch(err)
    {
      logger.error("DB error: ", err)
      return err;
    }
  }
})
};

module.exports = connectToDatabase;
