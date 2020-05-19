const router = require('express').Router();
let Teacher = require('../models/teacher.model');
let Course = require('../models/course.model');
const mongodb = require('mongodb')
const fs = require('fs')
const binary = mongodb.Binary
var path = require('path');

/**
 * get list of all the teachers.
 */
router.route('/').get((req, res) => {
    Teacher.find()
    .then(teacher => res.send({success : true, message: teacher}))
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get teacher info by id.
 * request parameters:
 *      /byID/<teacher_id>
 */
router.route('/byID/:id').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (teacher && !Array.isArray(teacher)) {
            return res.send({success : true, message: teacher})
        } else {
            return res.send({success : false, message:"המורה אינו קיים במערכת" })
        }
    })
})



/**
 * get list of available dates by teacher id
 * request parameters:
 *      /<teacher_id>/hoursAvailable
 */
router.route('/:id/hoursAvailable').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length === 0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.hours_available})
        }
    })
})


/**
 * get teacher name by id
 * request parameters:
 *      /<teacher_id>/name
 */
router.route('/:id/name').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length === 0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            return res.send({success : true, message: teacher.name})
        }
    })
})



/**
 * get list of available dates by course id
 * request parameters:
 *      /<course_id>/hoursAvailable/allTeachers
 */
router.route('/:course_id/hoursAvailable/allTeachers').get((req,res) => {
    Teacher.find()
    .then(teachers => {
        var hours = []
        teachers.forEach(teacher =>{
            let course  = (teacher.teaching_courses.filter(course => course.course_id === req.params.course_id)) 
            if (course && course.length>0){
                hours.push({"teacher_id": teacher._id,"teacher_name" : teacher.name, "hours_available" : teacher.hours_available})
            }
        });
        res.send({success : true, message: hours})
    })
    .catch(err => res.status(400).json("Error: " + err));
})

/**
 * get list of all the courses by teacher id
 * request parameters:
 *      /<teacher_id>/courses
 */
router.route('/:id/courses').get((req,res) => {
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


/**
 * Get the number of teachers that teach a specific course
 * Request parameters:
 *      /<course_id>/numOfTeachers
 */
router.route('/:course_id/numOfTeachers').get((req,res) => {
    Teacher.find()
    .then(teachers => {
        let num_of_teachers = 0
        teachers.forEach(teacher =>{
            let course  = (teacher.teaching_courses.filter(course => course.course_id === req.params.course_id)) 
            if (course && course.length>0){
                num_of_teachers += 1
            }
        });
        res.send({success : true, message: num_of_teachers})
    })
    .catch(err => res.status(400).json("Error: " + err));
})


/**
 * get list of all the requests by teacher id
 * request parameters:
 *      /<teacher_id>/requests
 */
router.route('/:id/requests').get((req,res) => {
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



/**
 * get grades file by teacher id
 * request parameters:
 *      /<teacher_id>/grades
 */
router.route('/:id/grades').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else if (teacher.grades_file.name == null){
            return res.send({success : true, message:"!הקובץ אינו קיים במערכת"})
        }else{
            var url=process.cwd()
            let buffer = teacher.grades_file.data.buffer
            url = path.join(url, teacher.grades_file.name)
            fs.appendFile(teacher.grades_file.name, Buffer.from(buffer), (err) => {
                if (err) {
                  console.log(err);
                } else {
                    return res.sendFile(url)
                }
            });
        }
    })
})



/**
 * check if file is existed by teacher id
 * request parameters:
 *      /<teacher_id>/checkgrades
 */
router.route('/:id/checkgrades').get((req,res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            if (teacher.grades_file.name == null){
            return res.send({success : false, message:"!הקובץ אינו קיים במערכת"})
            } else{
                return res.send({success : true, message:"!הקובץ קיים במערכת"})
            }
        }
    })
})


/**
 * get list of all the requests with the same status.
 * request parameters:
 *      /status/<status>
 * request body:
 *      none
 */
router.route('/status/:status').get((req, res) => {
    Teacher.find()
    .then(teacher => {
        requests = []
        teacher.forEach(teacher => requests.push({"teacher_id" : teacher._id, "requests" : teacher.teaching_requests.filter(request => request.status === req.params.status)}));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get list of all the requests with the same course_id.
 * request parameters:
 *      /courseID/<courseID>
 * request body:
 *      none
 */
router.route('/courseID/:courseID').get((req, res) => {
    Teacher.find()
    .then(teachers => {
        requests = []
        teachers.forEach(teacher => requests.push({"teacher_id" : teacher._id, "request" : teacher.teaching_requests.filter(request => request.course_id === req.params.courseID)}));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


/**
 * get list of all the requests.
 * request parameters:
 *      /allRequests
 * request body:
 *      None
 */
router.route('/allRequests').get((req, res) => {
    Teacher.find()
    .then(theachers => {
        requests = []
        theachers.forEach(teacher => requests.push({"teacher_id" : teacher._id, "requests" : teacher.teaching_requests}));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});




/**
 * Add course to teaching-courses list.
 * request parameters:
 *      /add/teachingCourse/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "course_name" : <course_name>     
 */
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
                        return res.send({success:true, message:"!הקורס התווסף בהצלחה"})
                    })
                }
            })
        }
    })
})



/**
 * Add request to teacher requests list.
 * request parameters:
 *      /add/request/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "course_name" : <course_name>     
 */
router.route('/add/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        new_request = req.body
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            course = teacher.teaching_courses.find(({ course_id }) => course_id === new_request.course_id )
            if (course){
                return res.send({success : false, message:"הקורס כבר קיים ברשימת הקורסים שהמורה מלמד" })
            }
            course = teacher.teaching_requests.find(({ course_id }) => course_id === new_request.course_id )
            if (course){
                return res.send({success : false, message:"הקורס כבר קיים ברשימת הבקשות של המורה " })
            }
            new_request.status = 'waiting'
            new_request.updated_at = Date.now()
            teacher.teaching_requests.push(new_request)
            teacher.save((err, doc)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message: " הבקשה ללמד את הקורס "  + new_request.course_name + " נשלחה בהצלחה "})
            })
        }
    })
})


/**
 * get number of teacher teaching each course_id.
 * request parameters:
 *     /numOfSTeachersByCourse/
 */
router.route('/numOfSTeachersByCourse').get((req,res) => {
    var num_of_teachers = []
    function wait(num_of_teachers) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(num_of_teachers);
          }, 5000);
        });
    }
    Course.find().
    then(async function(courses){
        courses.forEach(course => {
          Teacher.find({ "teaching_courses.course_id" : course._id }, (err,teacher) => {
              num_of_teachers.push({name : course.name, sum: teacher.length})
              }) 
        })
          num_of_teachers = await wait(num_of_teachers)
          return res.send({success : true, message: num_of_teachers})
    })
})

/**
 * Add dates to teacher hours_available list.
 * request parameters:
 *      /add/hoursAvailable/<teacher_id>
 * request body:
 *      dates : <list_of_dates>
 */
router.route('/add/hoursAvailable/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            let dates_to_add = req.body.dates.map(date => new Date(date))
            teacher.hours_available.push.apply(teacher.hours_available, dates_to_add)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!השעות נרשמו במערכת"})
        }
    })
})
       

/**
 * Add grades file.
 * request parameters:
 *      /add/file/<teacher_id>
 * request body:
 *      file : <binary_file>
 *      name : <file_name>
 */
// app.post('/add/file/:id', async (req, res) => {
router.post('/add/file/:id', async (req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.grades_file.name = req.params.id.toString() + ".pdf"
            // console.log(req.files);
            console.log(req.files.file);

            teacher.grades_file.data = binary(req.files.uploadedFile.data)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הקובץ נשמר במערכת"})
        }
    })
})



/**
 * Add new teacher.
 * request parameters:
 *      /add
 * request body:
 *      "_id" : <teacher_id>
 */
router.route('/add').post((req, res) => {
    const { _id, name } = req.body
    teaching_requests = []
    hours_available = []
    teaching_courses = []
    grades_file = null
    const newTeacher = new Teacher({
        _id : _id,
        name : name,
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


/**
 * Delete teacher by id.
 * request parameters:
 *      /<teacher_id>
 * request body:
 *     None
 */
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


/**
 * Update teacher.
 * request parameters:
 *     /update/<theacher-id>
 * request body:
 *      "_id" : <theacher>
 *      "teaching_courses" : [teaching_courses]
 *      "teaching_requests" : [teaching_requests]
 *      "hours_available" : [hours_available]
 *      "grades_file" : <grades_file>
 */
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


/**
 * update request status by id and course_id.
 * request parameters:
 *     /update/requestStatus/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "status" : <status>
 */
router.route('/update/requestStatus/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher || teacher.length === 0) {
            return res.send({success : false, message : "!המורה אינו קיים במערכת"})
        }
        new_request = req.body;
        current_request = teacher.teaching_requests.filter(request => request.course_id === new_request.course_id)
        if (!current_request || current_request.length === 0) {
            return res.send({success : false, message:"!הבקשה אינה קיימת במערכת" })
        } else{
            current_request = current_request[0]
            current_request.status = new_request.status
            if (new_request.status === 'approved'){
                new_course = {"course_id" : current_request.course_id,
                            "course_name" : current_request.course_name,
                            "hours_already_done" : '0'}
                teacher.teaching_courses.push(new_course)
            }
            teacher.save((err, doc)=> {
                if(err) {
                    console.log('Error: ' + err);
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!סטטוס הבקשה עודכן בהצלחה"});
            })
        }
    }); 
});


/**
 * update number of hours by id and course_id.
 * request parameters:
 *     /update/teachingHours/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 *      "teachingHours" : <numbr_of_hours>
 */
router.route('/update/teachingHours/:id').post((req,res) => {
    Teacher.findById((req.params.id)).then((teacher) => {
        if (!teacher || teacher.length === 0) {
            return res.send({success : false, message : "!המורה אינו קיים במערכת"})
        }
        new_hours = req.body;
        course = teacher.teaching_courses.filter(course => course.course_id === new_hours.course_id)
        if (!course || course.length === 0) {
            return res.send({success : false, message:"!הקורס אינו קיים במערכת" })
        } else{
            course = course[0]
            updated_hours = Number(new_hours.teachingHours) + Number(course.hours_already_done)
            course.hours_already_done = updated_hours.toString()
            teacher.save((err, doc)=> {
                if(err) {
                    console.log('Error: ' + err);
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!השעות עודכנו בהצלחה"});
            })
        }
    }); 
});



/**
 * delete teachingCourse by id and course_id.
 * request parameters:
 *     /delete/request/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 */
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
            return res.send({success:true, message: " הקורס " + course + "!נמחק מרשימת הקורסים של המורה בהצלחה"})
        }
    })
})


/**
 * delete request by id and course_id.
 * request parameters:
 *     /delete/request/<teacher_id>
 * request body:
 *      "course_id" : <course_id>
 */
router.route('/delete/request/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message:"!המורה אינו קיים במערכת"})
        } else {
            teacher.teaching_requests = teacher.teaching_requests.filter(request => request.course_id != req.body.course_id)
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הבקשה נמחקה בהצלחה"})
        }
    })
})


/**
 * delete dates by teacher id.
 * request parameters:
 *     /delete/hoursAvailable/<teacher_id>
 * request body:
 *      "hours_available" : [hours_available]
 */
router.route('/delete/hoursAvailable/:id').post((req, res) => {
    Teacher.findById((req.params.id), (err,teacher) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!teacher || teacher.length===0) {
            return res.send({success : false, message: "!המורה אינו קיים במערכת"})
        } else {
            let dates_to_remove = req.body.hours_available.map(date => new Date(date))
            teacher.hours_available = teacher.hours_available.filter(function(date){
                let match = dates_to_remove.find(d => d.getTime() === date.getTime())
                let hasMatch = !!match; // convert to boolean
                console.log(hasMatch)
                return !hasMatch
            })
            teacher.save((err, teacher)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!השעות המסומנות הוסרו בהצלחה"})
        }
    })
})


module.exports = router;