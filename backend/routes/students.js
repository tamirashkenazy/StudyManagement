const router = require('express').Router();
let Student = require('../models/student.model');

// all students info
router.route('/').get((req, res) => {
    Student.find()
    .then(student => res.send({success : true, message: student}))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (student) {
            return res.send({success : true, message: student})
        } else {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        }
    })
})


// list of student request by student id
router.route('/:id/request').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            return res.send({success : true, message: student.requests})
        }
    })
})

// add course to student requests list
router.route('/add/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {    
            if (student.requests.find(request => request.course_id === req.body.course_id)){
                return res.send({success : false, message:"course already in student request!" })
            }
            student.requests.push(req.body)
            student.save((err, doc)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message: student})
            })
        }
    })
})


// add student
router.route('/add').post((req, res) => {
    id = req.body._id
    group = req.body.group
    requests = []
    const newStudent = new Student({
        id,
        group,
        requests
    })
    newStudent.save((err, student)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message: student})
    })
})


// delete student by id
router.route('/:id').delete((req,res) => {
    Student.deleteOne({_id: req.params.id})
    .then(student => res.send({success : true, message: "הסדטודנט נמחק בהצלחה"}))
    .catch(err => res.status(400).json('Error: ' + err))
})


// update student by id
router.route('/update/:id').post((req,res) => {
    Student.findById((req.params.id)).then((student) => {
        if (!student) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        student._id = req.body._id.trim();
        student.group = req.body.group;
        student.requests = req.body.requests;
        student.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!הסטודנט עודכן בהצלחה"});
        })
    }); 
});


router.route('/delete/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            student.requests = student.requests.filter(request => request != req.body.request_id)
            student.save((err, student)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הבקשה הוסרה בהצלחה"})
        }
    })
})


module.exports = router;