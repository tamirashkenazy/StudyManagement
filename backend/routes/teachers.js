const router = require('express').Router();
let Teacher = require('../models/teacher.model');
let Course = require('../models/course.model');

// all teachers info
router.route('/').get((req, res) => {
    Teacher.find()
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacher) {
            return res.send({success : true, message:"The teacher is: " + JSON.stringify(teacher), teacher: teacher})
        } else {
            return res.send({success : false, message:"teacher does not exist!" })
        }
    })
})


// the list of hours available by teacher id
router.route('/:id/hoursAvailable').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacher) {
            return res.send({success : true, message:"The available hours are: " + JSON.stringify(teacher.hours_available)})
        } else {
            return res.send({success : false, message:"teacher does not exist!" })
        }
    })
})


// get list of courses (course number) by teacher id
router.route('/:id/teachingCourse').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"teacher does not exist!" })
        } else {
            return res.send({success : true, message:"The courses of requested teacher are: "  + teacher.teaching_courses})
        }
    })
})

// list of teacher request (course number) by teacher id
router.route('/:id/request').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"teacher does not exist!" })
        } else {
            return res.send({success : true, message:"The requests of this teacher are: "  + teacher.teaching_requests})
        }
    })
})

// bank info of teacher
router.route('/:id/bankInfo').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"teacher does not exist!" })
        } else {
            return res.send({success : true, message:"Teacher bank info: "  + JSON.stringify({bank_number : teacher.bank_number,
        branch_number :  teacher.bank_branch, bank_account_number : teacher.bank_account_number, bank_account_name : teacher.bank_account_name})})
        }
    })
})


router.route('/:id/grades').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"teacher does not exist!" })
        } else {
            return res.send({success : true, message:"Teacher grades file: "  + teacher.grades_file})
        }
    })
})

// add course to teacher teaching-courses list 
router.route('/add/teachingCourse/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            Course.findById((req.body.course_id), (err,course) => {
                if(err) {
                    return res.send({success : false, message:"Error: " + err})
                } else if (!course) {
                    return res.send({success : false, message:"course does not exist!" })
                } else {
                    if (teacher.teaching_courses.includes(course._id)){
                        return res.send({success : false, message:"course already in teacher courses!" })
                    }
                    teacher.teaching_courses.push(course._id)
                    teacher.save((err, doc)=> {
                        if (err) {
                            return res.send({success:false, message:"Error: Couldn't Save " + err})
                        }
                        return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
                    })
                }
            })
        }
    })
})

// add course to teacher requests list
router.route('/add/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            Course.findById((req.body.course_id), (err,course) => {
                if(err) {
                    return res.send({success : false, message:"Error: " + err})
                } else if (!course) {
                    return res.send({success : false, message:"course does not exist!" })
                } else {
                    if (teacher.teaching_requests.includes(course._id)){
                        return res.send({success : false, message:"course already in teacher request!" })
                    }
                    teacher.teaching_requests.push(course._id)
                    teacher.save((err, doc)=> {
                        if (err) {
                            return res.send({success:false, message:"Error: Couldn't Save " + err})
                        }
                        return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
                    })
                }
            })
        }
    })
})


// add dates to teacher hours_available list 
router.route('/add/hoursAvailable/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            teacher.hours_available.push.apply(teacher.hours_available, req.body)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
        }
    })
})

// add teacher
router.route('/add').post((req, res) => {
    const { body } = req;teachers
    const { _id, bank_number, bank_branch, bank_account_number, bank_account_name,
                 teaching_courses, hours_available, teaching_requests, grades_file } = body
    const newTeacher = new Teacher({
        _id,
        bank_number,
        bank_branch,
        bank_account_number,
        bank_account_name,
        teaching_courses,
        hours_available,
        teaching_requests,
        grades_file
    })
    console.log(newTeacher)
    newTeacher.save((err, teacher)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message:"Success: Teacher added, " + JSON.stringify(teacher)})
    })
})


// delete teacher by id
router.route('/:id').delete((req,res) => {
    Teacher.deleteOne({_id: req.params.id})
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json('Error: ' + err))
})

// update teacher by id
router.route('/update/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher) {
            return res.send({
                success : false,
                message : "Error: no such teacher"
            })
        }
        teacher._id = req.body._id.trim();
        teacher.bank_number = req.body.bank_number
        teacher.bank_branch = req.body.bank_branch.trim();
        teacher.bank_account_number = req.body.bank_account_number.trim();
        teacher.bank_account_name = req.body.bank_account_name.trim();
        teacher.teaching_courses = req.body.teaching_courses;
        teacher.hours_available = req.body.hours_available;
        teacher.teaching_requests = req.body.teaching_requests;
        teacher.grades_file = req.body.grades_file.trim();

        teacher.save((err, doc)=> {
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


router.route('/delete/teachingCourse/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            teacher.teaching_courses = teacher.teaching_courses.filter(course => course != req.body.course_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
        }
    })
})


router.route('/delete/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            teacher.teaching_requests = teacher.teaching_requests.filter(request => request != req.body.request_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
        }
    })
})


router.route('/delete/hoursAvailable/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher) {
            return res.send({success : false, message:"Teacher does not exist!" })
        } else {
            teacher.hours_available = teacher.hours_available.filter(date => req.body.includes(date))
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message:"Success: Teacher updated: " + JSON.stringify(teacher)})
        }
    })
})


module.exports = router;