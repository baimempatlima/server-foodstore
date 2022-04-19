const mongoose = require("mongoose");
const { dbHost, dbPass, dbName, dbPort, dbUser } = require("../app/config");

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`);
const db = mongoose.connection;

db.on('open', () => {
    if(connectionDatabase !== urlLocal) {
        console.log('connected to the mongodb atlas');
    } else {
        console.log('failed');
    }
})

module.exports = db;
