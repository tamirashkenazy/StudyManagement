const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
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

app.use('/users', usersRouter);
app.use('/sign_in', signinRouter);
app.use('/lessons', lessonsRouter);
app.use('/courses', coursesRouter);
app.use('/teachers', teachersRouter);

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});