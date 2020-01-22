const router = require('express').Router();
let Student = require('../models/student.model');

// all students info
router.route('/').get((req, res) => {
    Student.find()
    .then(students => res.send({success : true, message: students}))
    .catch(err => res.status(400).json("Error: " + err));
});

// the /:id is like a variable
router.route('/byID/:id').get((req,res) => {
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


// list of student's requests by student id
router.route('/:id/requests').get((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            return res.send({success : true, message: student.requests})
        }
    })
})

//  student request by student id and course_id
router.route('/:id/requests/byCourseID').post((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            student.requests = student.requests.filter(request => request.course_id === req.body.course_id)
            return res.send({success : true, message: student.requests})
        }
    })
})


//  student request by student id and status
router.route('/:id/requests/byStatus').post((req,res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length===0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            student.requests = student.requests.filter(request => request.status === req.body.status)
            return res.send({success : true, message: student.requests})
        }
    })
})


// all students with the same group
router.route('/group').post((req, res) => {
    Student.find()
    .then(students => {
        students = students.filter(student => student.group.name === req.body.group.name)
        res.send({success : true, message: students})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


// all requests with same status
router.route('/status/:status').get((req, res) => {
    Student.find()
    .then(students => {
        requests = []
        students.forEach(student => requests.push(student.requests.filter(request => request.status === req.params.status)));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


// all requests with same course_id
router.route('/courseID/:courseID').get((req, res) => {
    Student.find()
    .then(students => {
        requests = []
        students.forEach(student => requests.push(student.requests.filter(request => request.course_id === req.params.courseID)));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


// get all requests
router.route('/allRequests').get((req, res) => {
    Student.find()
    .then(students => {
        requests = []
        students.forEach(student => requests.push(student.requests));
        res.send({success : true, message: requests})
    })
    .catch(err => res.status(400).json("Error: " + err));
});


// add request to student requests list
router.route('/add/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        new_request = req.body
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length === 0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {   

            course = student.courses.find(({course_id}) => course_id === new_request.course_id )
            if (course){
                gap = Number(student.group.aproved_hours) - Number(course.approved_hours) - Number(course.wating_hours) + Number(course.hours_already_done) 
                console.log('gap: ' + gap)
                if (gap < Number(student.group.aproved_hours)){
                    hours_to_add = Math.min(Number(new_request.number_of_hours), gap)
                    console.log('hours_to_add: ' + hours_to_add)
                    final_hours = hours_to_add + Number(course.wating_hours)
                    console.log('final_hours: ' + final_hours)
                    new_request.number_of_hours = final_hours.toString()
                    student.requests = student.requests.filter(request => request.course_id != course.course_id)
                    changehours(final_hours,course.course_id, student.courses)
                }
                else{
                   return res.send({success : false, message:"!כמות השעות המבוקשת הינה מעל הכמות המותרת עבור הסטודנט" })
                }
            // add new course to list of the courses
            }else{
                new_course = {course_id: new_request.course_id,
                            course_name: new_request.course_name,
                            approved_hours: '0',
                            wating_hours: new_request.number_of_hours,
                            hours_already_done: '0'}
                student.courses.push(new_course)
            }
            new_request.status = 'waiting'
            new_request.updated_at = Date.now()
            student.requests.push(new_request)
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
    _id = req.body._id
    group = ''
    if (req.body.hasOwnProperty('group')){
        group = req.body.group
    }
    requests = []
    courses = []
    student_obj = { _id : _id, requests : requests, courses : courses, group : group}
    const newStudent = new Student(student_obj)
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
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        student._id = req.body._id.trim();
        student.group = req.body.group;
        student.requests = req.body.requests;
        student.courses = req.body.courses;
        student.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!הסטודנט עודכן בהצלחה"});
        })
    }); 
});


// update student's group by id
router.route('/update/group/:id').post((req,res) => {
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        student.group = req.body.group;
        student.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!הקבוצה של הסטודנט עודכנה בהצלחה"});
        })
    }); 
});


// update request status by id and course_id
router.route('/update/requestStatus/:id').post((req,res) => {
    Student.findById((req.params.id)).then((student) => {
        if (!student || student.length === 0) {
            return res.send({success : false, message : "!הסטודנט אינו קיים במערכת"})
        }
        new_request = req.body;
        current_request = student.requests.filter(request => request.course_id === new_request.course_id)
        if (!current_request || current_request.length===0) {
            return res.send({success : false, message:"!הבקשה אינה קיימת במערכת" })
        }
        else{

            current_request = current_request[0]
            if (new_request.status === 'approved'){
                course_to_update = student.courses.findIndex(course => course.course_id === new_request.course_id)
                current_approved_hours = student.courses[course_to_update].approved_hours
                updated_hours = Number(current_approved_hours) + Number(current_request.number_of_hours)
                student.courses[course_to_update].approved_hours = updated_hours.toString()
                student.courses[course_to_update].wating_hours = '0'
                student.requests = student.requests.filter(request => request.course_id != current_request.course_id)
            }else{
                status_to_update = student.requests.findIndex(requests => requests.course_id === new_request.course_id)
                student.requests[status_to_update].status = new_request.status
            }
            student.save((err, doc)=> {
                if(err) {
                    console.log('Error: ' + err);
                    return res.send({success : false, message : err.errmsg});
                }
                return res.send({success : true, message : "!סטטוס הבקשה עודכן בהצלחה"});
            })
        }
    }); 
});

// delete request by id and course_id
router.route('/delete/request/:id').post((req, res) => {
    Student.findById((req.params.id), (err,student) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (!student || student.length === 0) {
            return res.send({success : false, message:"!הסטודנט אינו קיים במערכת" })
        } else {
            student.requests = student.requests.filter(request => request.course_id != req.body.course_id)
            student.save((err, student)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
            })
            return res.send({success:true, message: "!הבקשה הוסרה בהצלחה"})
        }
    })
})


function changehours( new_hours, course_id, courses ) {
    for (var i in courses) {
      if (courses[i].course_id == course_id) {
          courses[i].wating_hours = new_hours;
         break; //Stop this loop, we found it!
      }
    }
 }

module.exports = router;