const router = require('express').Router();
let Teacher = require('../models/teacher.model');
let Course = require('../models/course.model');

// all teachers info
router.route('/').get((req, res) => {
    Teacher.find()
    .then(teacher => res.send({success : true, message: teacher}))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/:id').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : true, message: teacher})
        } else {
            return res.send({success : false, message:"המורה אינו קיים במערכת" })
        }
    })
})


// the list of hours available by teacher id
router.route('/:id/hoursAvailable').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : true, message: teacher.hours_available})
        } else {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        }
    })
})


// get list of courses (course number) by teacher id
router.route('/:id/teachingCourse').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.teaching_courses})
        }
    })
})

// list of teacher request (course number) by teacher id
router.route('/:id/request').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.teaching_requests})
        }
    })
})

// bank info of teacher
/*router.route('/:id/bankInfo').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!Array.isArray(teacher) || !teacher.length) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message:{bank_number : teacher.bank_number,
        branch_number :  teacher.bank_branch, bank_account_number : teacher.bank_account_number, bank_account_name : teacher.bank_account_name}})
        }
    })
})
*/

router.route('/:id/grades').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.grades_file})
        }
    })
})

// add course to teacher teaching-courses list 
router.route('/add/teachingCourse/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            Course.findById((req.body.course_id), (err,course) => {
                if(err) {
                    return res.send({success : false, message:"Error: " + err})
                } else if (!course || course.length===0) {
                    return res.send({success : false, message:"!הקורס המבוקש אינו קיים במערכת" })
                } else {
                    if (teacher.teaching_courses.includes(course._id)){
                        return res.send({success : false, message:"המורה כבר מלמד את הקורס המבוקש"})
                    }
                    teacher.teaching_courses.push(course._id)
                    teacher.save((err, doc)=> {
                        if (err) {
                            return res.send({success:false, message:"Error: Couldn't Save " + err})
                        }
                        return res.send({success:true, message:teacher})
                    })
                }
            })
        }
    })
})

// add request to teacher requests list
router.route('/add/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            Course.findById((req.body.course_id), (err,course) => {
                if(err) {
                    return res.send({success : false, message:"Error: " + err})
                } else if (!course || course.length===0) {
                    return res.send({success : false, message:"!הקורס אינו קיים במערכת"})
                } else {
                    if (teacher.teaching_requests.includes(course._id)){
                        return res.send({success : false, message:"הקורס כבר קיים ברשימת הבקשות של המורה" })
                    }
                    let new_teaching_req = {course_id : req.body.course_id, course_name:req.body.course_name, status: "waiting", updated_at:Date.now()}
                    teacher.teaching_requests.push(new_teaching_req)
                    teacher.save((err, doc)=> {
                        if (err) {
                            return res.send({success:false, message:"Error: Couldn't Save " + err})
                        }
                        return res.send({success:true, message:teacher})
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
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.hours_available.push.apply(teacher.hours_available, req.body)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: teacher})
        }
    })
})
       

// add teacher
router.route('/add').post((req, res) => {
    const { _id } = req.body
    teaching_requests = []
    hours_available = []
    teaching_courses = []
    grades_file = null
    const newTeacher = new Teacher({
        _id : _id,
        teaching_requests : teaching_requests,
        hours_available : hours_available,
        teaching_courses : teaching_courses,
        grades_file : grades_file
    })
    newTeacher.save((err, teacher)=> {
        if (err) {
            return res.send({success:false, message:"Error: Couldn't Save " + err})
        }
        return res.send({success:true, message: teacher})
    })
})


// delete teacher by id
router.route('/:id').delete((req,res) => {
    Teacher.deleteOne({_id: req.params.id})
    .then(teacher => {
        if (teacher.n === 1){
            res.send({success : true, message: "!המורה נמחק בהצלחה"})
        }else{
            res.send({success : false, message: "!המורה אינו קיים"})
        }
    }).catch(err => res.status(400).send({success : false, message: err}))
})

// update teacher by id
router.route('/update/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher || teacher.length===0) {
            return res.send({success : false,message : "!המורה אינו קיים במערכת"})
        }
        teacher._id = req.body._id.trim();
        //teacher.bank_number = req.body.bank_number
        //teacher.bank_branch = req.body.bank_branch.trim();
        //teacher.bank_account_number = req.body.bank_account_number.trim();
        //teacher.bank_account_name = req.body.bank_account_name.trim();
        teacher.teaching_courses = req.body.teaching_courses;
        teacher.hours_available = req.body.hours_available;
        teacher.teaching_requests = req.body.teaching_requests;
        teacher.grades_file = req.body.grades_file.trim();
        teacher.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({
                success : true, message : "!המורה עודכן בהצלחה"});
        })
    }); 
});


router.route('/delete/teachingCourse/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.teaching_courses = teacher.teaching_courses.filter(course => course != req.body.course_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: teacher})
        }
    })
})


router.route('/delete/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.teaching_requests = teacher.teaching_requests.filter(request => request != req.body.request_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: teacher})
        }
    })
})


router.route('/delete/hoursAvailable/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message: "!המורה אינו קיים במערכת"})
        } else {
            teacher.hours_available = teacher.hours_available.filter(date => req.body.includes(date))
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: teacher})
        }
    })
})


module.exports = router;