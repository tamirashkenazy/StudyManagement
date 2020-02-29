const router = require('express').Router();
let Constants = require('../models/constants.model');

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
    Constants.find({ uniqe : "constants" }, (err,constants) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (constants && constants.length > 0) {
            constants = constants[0]
            constant = req.params.constant
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
 *      "name" : <variable_name>
 *      "value" : <variable_value>
 */
router.route('/update').post((req,res) => {
    Constants.find({ uniqe : "constants" }, (err,constants) => {
        if (!constants || constants.length === 0) {
            return res.send({success : false, message:"!האובייקט אינו קיים"})
        }
        constants = constants[0]
        name = req.body.name;
        new_value = req.body.value
        console.log(name)
        constants[name] = new_value
        console.log(constants)
        constants.save((err, doc)=> {
            if(err) {
                console.log('Error: ' + err);
                return res.send({success : false, message : err.errmsg});
            }
            return res.send({success : true, message : "!המשתנה עודכן בהצלחה"});
        })
    })
}); 

router.route('/add').post((req, res) => {
    Constants.find({ uniqe : "constants" }, (err,constants) => {
        if(err) {
            return res.send({success : false, message:"Error: " + err})
        } else if (constants && constants.length > 0) {
            return res.send({success : false, message:"לא ניתן להוסיף אובייקט נוסף מסוג זה"})
        }else{
            const newConstant = new Constants({
                lesson_price : req.body.lesson_price,
                annual_budget : req.body.annual_budget
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

module.exports = router;