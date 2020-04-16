const mysql    = require('mysql');
const settings = require('./settings.json');
let db;

function connectDatabase() {
    console.log(`Initiating connection with database: ${settings.database}`);
    if (!db) {
        db = mysql.createConnection(settings);

        db.connect(function(err){
            if(err) {
              console.log('Connection failed: ' + err.stack);
              // throw err;
              return;
            } 
            // console.log('Database is connected! [ ID = ' + db.threadId + ' ]');
        });
    }
    return db;
}

module.exports = connectDatabase();