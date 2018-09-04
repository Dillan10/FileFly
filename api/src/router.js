import path from 'path'
import {version} from '../package.json'
import _ from 'lodash'
import File from '../models/file'
import {ObjectID} from 'mongodb'
// import File from './models/file'
import Post from '../models/post'
// import {ObjectID} from 'mongodb'
import FileArchiver from './archiver'
// import Email from './email'
// import S3 from './s3'
// import User from './models/user'
// import Auth from './models/auth'

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
            //iF THERE ARE FILES TO UPLOAD
            if (fileModel.length) {
                //save the files to the db
                db.collection('files').insertMany(fileModel, (err, result) => {
                    if (err) {
                        res.status(503).json({
                            error: {message: 'unable to save file'}
                        })
                    }
                    console.log("saved file to db", err, result);
                    let post = new Post(app).initWithObject({
                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),
                        files: result.insertedIds,
                    }).toJson();
                    //save the post in the posts collection
                    db.collection('posts').insertOne(post, (err, result) => {
                        if (err) {
                            return res.status(503).json({error: {message: "Your upload could not be saved."}});
                        }
                        //implement email sending to user with download link.
                        // send email
                        // const sendEmail = new Email(app).sendDownloadLink(post, (err, info) => {
                        //
                        //
                        // });
                        // callback to react app with post detail.
                        return res.json(post);
                    });
                });
            }
            //Nothing was selcted
            else {
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
                    return res.download(filePath,_.get(result,'[0].originalName'),(err)=>{
                        if(err){
                            return res.status(404).json({error:'not found'});
                        }else{
                            console.log('Downloaded');
                        }
                    })
                });

        });


        // routing for post detail /api/posts/:id
        app.get('/api/posts/:id',(req,res,next) =>{
            const postId = _.get(req,'params.id');

            let postIdObj = null;
            try{
                postIdObj = new ObjectID(postId);
            }catch(err){
                return res.status(404).json({error:'File Not Found'})
            }
            db.collection('posts').find({_id:postIdObj}).limit(1).toArray((err,results)=>{
                let result = _.get(results,'[0]');
                if(err || !result){
                    return res.status(404).json({error:'File Not Found'})
                }

                const fileIDs = _.get(result,'files',[]);
                db.collection('files').find({_id:{$in: fileIDs}}).toArray((err,fileRes) =>{
                    if(err || !fileRes || !fileRes.length){
                        return res.status(404).json({error:'File Not Found Err'})
                    }
                    result.files = fileRes;
                    return res.json(result);
                });

            })
        })

        // Routing download zip files.
        app.get('/api/posts/:id/download', (req, res, next) => {

            const id = _.get(req, 'params.id', null);


            this.getPostById(id, (err, result) => {

                if (err) {
                    return res.status(404).json({error: {message: 'File not found.'}});
                }

                const files = _.get(result, 'files', []);
                const archiver = new FileArchiver(app, files, res).download();
                return archiver;

            })
        });

        // Create new users post


        // Login user


        // get my profile detail


    }

    getPostById(id, callback = () => {
    }) {


        const app = this.app;

        const db = app.get('db');


        let postObjectId = null;
        try {
            postObjectId = new ObjectID(id);
        }
        catch (err) {

            return callback(err, null);

        }

        db.collection('posts').find({_id: postObjectId}).limit(1).toArray((err, results) => {
            let result = _.get(results, '[0]');

            if (err || !result) {
                return callback(err ? err : new Error("File not found."));
            }

            const fileIds = _.get(result, 'files', []);

            db.collection('files').find({_id: {$in: fileIds}}).toArray((err, files) => {

                if (err || !files || !files.length) {
                    return callback(err ? err : new Error("File not found."));
                }

                result.files = files;


                return callback(null, result);

            });


        })
    }
}


export default AppRouter;
