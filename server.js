const app = require('./app');
const config = require('./app/config');
const MongoDb = require('./app/utils/mongodb.util');


async function startServer(){
    try {
        await MongoDb.connect(config.db.uri);
        app.listen(config.app.port, () => {
            console.log(`Server is running on port ${config.app.port}`);
        });
    } catch (error){
        console.log("Cannot connect to the database!", error);
        process.exit(); 
    }
}

startServer();

