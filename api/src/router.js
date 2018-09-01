import path from 'path'
import {version} from '../package.json'
import _ from 'lodash'
import File from '../models/file'
import {ObjectID} from 'mongodb'


class AppRouter {

    constructor(app) {
        this.app = app;
        this.setupRouters();
    }

    setupRouters() {

        const app = this.app;
        const db = app.get('db');
        const uploadDir = app.get('storageDir');
        const upload = app.upload;

        // root routing.
        app.get('/', (req, res, next) => {

            return res.status(200).json({
                version: version
            });

        });

        // Upload routing

        app.post('/api/upload', upload.array('files'), (req, res, next) => {

            const files = req.files;
            let fileModel = [];

            _.each(files,(fileObj)=>{
                  const newFile = new File(app).initWithObject(fileObj).toJSON();
                  fileModel.push(newFile);
            });

            if (fileModel.length) {
                db.collection('files').insertMany(fileModel, (err, result) => {
                    if (err) {
                        res.status(503).json({
                            error: {message: 'unable to save file'}
                        })
                    } else {
                        console.log("save file with result", err, result);
                        return res.json({
                            files: fileModel
                        });
                    }
                })
            } else {
                res.status(503).json({
                    error: {message: `Files Upload is required`}
                })
            }

        });

        // Download routing

        app.get('/api/download/:id', (req, res, next) => {
            const fileId = req.params.id;
            db.collection('files').find({_id:ObjectID(fileId)})
                .toArray((err,result)=>{
                    const fileName = _.get(result,'[0].name');

                    if(err || !fileName){
                        return res.status(404).json({error:'not found'});
                    }
                    const filePath = path.join(uploadDir,fileName);
                    return res.download(filePath,fileName,(err)=>{
                        if(err){
                            return res.status(404).json({error:'not found'});
                        }else{
                            console.log('Downloaded');
                        }
                    })
                });

        });


        // routing for post detail /api/posts/:id


        // Routing download zip files.


        // Create new users post


        // Login user


        // get my profile detail


    }
}


export default AppRouter;
