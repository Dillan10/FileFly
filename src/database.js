import {MongoClient} from 'mongodb'
import {dbUrl} from './config'


// const url = 'mongodb://localhost:27017/fileapp';


export const connect = (callback) => {

    MongoClient.connect(dbUrl, (err, db) =>
    {
        return callback(err, db);

    });
};

