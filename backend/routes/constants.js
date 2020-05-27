const router = require('express').Router();
let Constants = require('../models/constants.model');
const fileDownload = require('js-file-download');

// when initializing - checks if there is constants - if no - init them
Constants.find({}, (err,constants) => {
    if (constants && Array.isArray(constants) && constants.length === 0) {
        const newConstant = new Constants()
        newConstant.save()
    }
})

const Excel = require('exceljs');
const fs = require('fs')
var path = require('path');
const mongodb = require('mongodb')
const binary = mongodb.Binary


/**
 * get list of all the constants values.
 */
router.route('/').get((req, res) => {
    Constants.find()
    .then(constant => res.send({success : true, message: constant[0]}))
    .catch(err => res.status(400).send({success:false, message: "Error: " + err}));
});

/**
 * get value of a specific constants.
 * request parameters:
 *      /<constant_name>
 */
router.route('/:constant').get((req,res) => {
    Constants.find({ unique : "constants" }, (err,constants) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (constants && constants.length > 0) {
            constants = constants[0]
            let constant = req.params.constant
            return res.send({success : true, message: constants[constant]})
        }else{
            return res.send({success : false, message:"!המשתנה אינו קיים"})
        }
    })
})


/**
 * update constant.
 * request parameters:
 *     /update
 * request body: 
 *      "constants_to_update" : { [constant_name] : constant_value}
 *      where:
 *          "constant_name" : <variable_name>
 *          "constant_value" : <variable_value>
 */
router.route('/update').post((req,res) => {
    Constants.find({ unique : "constants" }, (err,constants) => {
        if (!constants || constants.length === 0) {
            return res.send({success : false, message:"!האובייקט אינו קיים"})
        }
        let constant = constants[0]
        let {constants_to_update} = req.body
        Object.entries(constants_to_update).forEach(([constant_name, constant_value])=>{
            constant[constant_name] = constant_value
        })
        constant.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!המשתנה עודכן בהצלחה"});
        })
    })
}); 


router.route('/add').post((req, res) => {
    Constants.find({ unique : "constants" }, (err,constants) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (constants && constants.length > 0) {
            return res.send({success : false, message:"לא ניתן להוסיף אובייקט נוסף מסוג זה"})
        }else{
            const newConstant = new Constants({
                lesson_price : req.body.lesson_price,
                admin_mail : req.body.admin_mail,
                annual_budget : req.body.annual_budget,
                student_fee : req.body.student_fee
            })
            newConstant.save((err, constants)=> {
                if (err) {
                    return res.send({success:false, message:"Error: Couldn't Save " + err})
                }
                return res.send({success:true, message: constants})
            })
        }
    })
    
})



/**
 * export data to excel.
 * request parameters:
 *     /exportToExcel
 * request body:
 *      "studentsReport" : <studentsReport>
 *      "teachersReport" : <teachersReport>
 */
router.route('/exportToExcel/:year/:month').post((req, res) => {
    let year = req.params.year
    let month = req.params.month
    let teachers = req.body.teachersReport
    let students = req.body.studentsReport
    let teacher_data
    let student_data
    let file_name = `${year}-${month}-reports.xlsx`
    let options = {
        filename: file_name,
        useStyles: true,
        useSharedStrings: true
      };


    let workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    let students_sheet = workbook.addWorksheet('students', {properties: {defaultColWidth : 18}});
    let teachers_sheet = workbook.addWorksheet('teachers', {properties: {defaultColWidth : 18}});

    students_sheet.columns = [
        { header: 'תעודת זהות', key: 'id', },
        { header: 'שם הסטודנט', key: 'name'},
        { header: 'מספר שיעורים', key: 'num' },
        { header: 'סכום לחיוב', key: 'sum' }
    ]

    teachers_sheet.columns = [
        { header: 'תעודת זהות', key: 'id' },
        { header: 'שם המורה', key: 'name' },
        { header: 'מספר שיעורים', key: 'num' },
        { header: 'סכום לתשלום', key: 'sum' }
    ]

    students.forEach (student => {
        student_data = {
            id: student.id,
            name: student.name,
            num: student.number_of_lessons,
            sum: student.amount
        };
        students_sheet.addRow(student_data).commit();
    })

    teachers.forEach(teacher => {
        teacher_data = {
            id: teacher.id,
            name: teacher.name,
            num: teacher.number_of_lessons,
            sum: teacher.amount
        };
        teachers_sheet.addRow(teacher_data).commit();
    });

    workbook.commit().then(function() {
        var full_path = process.cwd()
        url = path.join(full_path, file_name)
        return res.send({success : true, message : "הקובץ מוכן"});
    });
})

/**
 * get list of all the constants values.
 */
router.route('/getExcel/:year/:month').get((req, res) => {
    let year = req.params.year
    let month = req.params.month
    let file_name = `${year}-${month}-reports.xlsx`
    let full_path = process.cwd()
    url = path.join(full_path, file_name)
    res.download(url);
});



module.exports = router;