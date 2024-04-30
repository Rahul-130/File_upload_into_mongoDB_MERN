// create express app
const exp = require("express")
const multer = require('multer');

const app = exp()

// assign port number
const port = 4000

// Middleware to allow CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
  });

// assign port number
app.listen(port, ()=>console.log(`web server listening on port ${port}..`))

const upload = multer({
    dest: 'upload/',
  });

// get mongo client
const mongoClient = require('mongodb').MongoClient;

// connect to DB server using mongo client
mongoClient.connect('mongodb://127.0.0.1:27017')
.then((dbRef) => {
    // connect to a database
    const dbObj = dbRef.db('testdb2');
    // connect to collection of this database
    const filesCollectionObj = dbObj.collection('filescollection')
    


    app.post('/upload', upload.single('file'), async(req, res) => {
        // res.json({file : req.file})
        const file = req.file;
        // Send a success response.
        // Save file details to MongoDB
        const result = await filesCollectionObj.insertOne({
            filename: file.originalname,
            path: file.path
          });
        res.send('File uploaded successfully!');
      });





    // share collections to APIs  'filessCollectionObj'-key   filessCollectionObj-object
    app.set('filesCollectionObj', filesCollectionObj)
    

    console.log("DB connection success");
})
.catch(err => console.log("database connect error :", err))



// error handling middleware
const errorHandlingMiddleware = (error, request, response, next)=>{
    response.send({message: error.message})
}

app.use(errorHandlingMiddleware)


// invalid path
// const invalidPathMiddleware = (request, response, next)=>{
//   response.send({message:`Invalid path`})
// }
// app.use(invalidPathMiddleware)