const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = require('./helpers/port');
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');

const app = express()

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// to hide the password and user name of the data base
const MongoPassword = process.env.MongoPassword
const MongoDbName = process.env.MongoDbName
const uri = `mongodb+srv://Studymng:${MongoPassword}@studymng-izhv3.mongodb.net/${MongoDbName}?replicaSet=${MongoDbName}` 

// uri = 'mongodb+srv://Studymng:Stdmng123@studymng-izhv3.mongodb.net/StudyManagement?replicaSet=StudyManagement'
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true  } )
.then(()=> console.log("MongoDB is connected"))
.catch(err=>{
    console.log("MongoDB connection error: " + err.message)
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// the http requests for users located in ./routes/users
const usersRouter = require('./routes/users');
const signinRouter = require('./routes/sign_in');
const lessonsRouter = require('./routes/lessons');
const coursesRouter = require('./routes/courses');
const teachersRouter = require('./routes/teachers');
const studentsRouter = require('./routes/students');
const groupsRouter = require('./routes/groups');
const constantsRouter = require('./routes/constants');


app.use('/users', usersRouter);
app.use('/sign_in', signinRouter);
app.use('/lessons', lessonsRouter);
app.use('/courses', coursesRouter);
app.use('/teachers', teachersRouter);
app.use('/students', studentsRouter);
app.use('/groups', groupsRouter);
app.use('/constants', constantsRouter);

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});