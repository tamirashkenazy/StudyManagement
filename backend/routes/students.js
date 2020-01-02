const router = require('express').Router();
let Student = require('../models/student.model');

// all students info
router.route('/').get((req, res) => {
    Student.find()
    .then(student => res.json(student))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (student) {
            return res.send({success : true, message:"The student is: " + JSON.stringify(student), student: student})
        } else {
            return res.send({success : false, message:"student does not exist!" })
        }
    })
})


// list of student request by student id
router.route('/:id/request').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student) {
            return res.send({success : false, message:"Student does not exist!" })
        } else {
            return res.send({success : true, message:"The requests of this student are: "  + student.requests})
        }
    })
})

// add course to student requests list
router.route('/add/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student) {
            return res.send({success : false, message:"Student does not exist!" })
        } else {
              
            if (student.requests.find(request => request.course_id === req.body.course_id)){
                return res.send({success : false, message:"course already in student request!" })
            }
            student.requests.push(req.body)
            student.save((err, doc)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message:"Success: Student updated: " + JSON.stringify(student)})
            })
        }
    })
})


// add student
router.route('/add').post((req, res) => {
    const { body } = req;
    const { _id, requests } = body
    const newStudent = new Student({
        _id,
        requests
    })
    newStudent.save((err, student)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message:"Success: Student added, " + JSON.stringify(student)})
    })
})


// delete student by id
router.route('/:id').delete((req,res) => {
    Student.deleteOne({_id: req.params.id})
    .then(student => res.json(student))
    .catch(err => res.status(400).json('Error: ' + err))
})


// update student by id
router.route('/update/:id').post((req,res) => {
    Student.findById((req.params.id)).then((student) => {
        if (!student) {
            return res.send({
                success : false,
                message : "Error: no such student"
            })
        }
        student._id = req.body._id.trim();
        student.requests = req.body.requests;
        student.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({
                    success : false, message : err.errmsg
                });
            }
            return res.send({
                success : true, message : 'Updated successfuly',
            });
        })
    }); 
});


router.route('/delete/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student) {
            return res.send({success : false, message:"Student does not exist!" })
        } else {
            student.requests = student.requests.filter(request => request != req.body.request_id)
            student.save((err, student)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Student updated: " + JSON.stringify(student)})
        }
    })
})


module.exports = router;