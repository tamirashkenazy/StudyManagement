import React , { useState } from 'react';
import { Container} from 'react-bootstrap'
import { Icon} from 'semantic-ui-react';
import {Link , useHistory} from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import {SignupFormRedux} from './signupFormRedux'
import {reduxForm, getFormValues } from 'redux-form'
import {connect } from 'react-redux'
import {httpPostRequestToAddUser, httpPostRequestToAddStudent, httpPostRequestToAddTeacher} from './signupPostRequests'


import { check_errors, validateForm, allFieldsExist } from './validationFields';
import { Typography } from '@material-ui/core';

const SignupConatainer = ({handleSubmit, formValues}) => {
    const history = useHistory()
    const [errors, setErrors] = useState({})
    const submitForm = (formValues) => {
        console.log('submitting form: ', formValues);
        if(!allFieldsExist(formValues)) {
            alert("אנא מלא את כל השדות")
        } else {
            let local_errors = check_errors(formValues)
            setErrors(local_errors)
            let validForm = validateForm(local_errors)
            if(!validForm) {
                // console.log(local_errors);
                // alert(JSON.stringify(errors))
            } else {
                // TODO - need to check if all of the http request returned OK and if no - delete the new student/teacher/user that was uploaded and send error msg
                if(formValues.isStudent) {
                    httpPostRequestToAddStudent(formValues._id)
                } 
                if (formValues.isTeacher) {
                    httpPostRequestToAddTeacher(formValues._id)
                }
                httpPostRequestToAddUser(formValues, history)
            }
        }
        
    }

    return (
        <div  id="land-page" className="bg" style={{direction:"rtl"}}>
            <Container id="signup-box"  className="right-align">
                <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
                    <Icon size='big' name='arrow right' style={{margin:"2%"}}></Icon>
                </Link>
                <Typography style={{margin: "1rem 1.5rem 0rem 0rem"}} variant="h4" color="primary"  display="inline">טופס הרשמה</Typography>
                <SignupFormRedux onSubmit={submitForm} handleSubmit={handleSubmit} errors={errors} formValues={formValues} formSubmitButtonName="הירשם"/> 
            </Container>
        </div>
    )
}


const emptyUser = {   _id : "", password : "", email: "", first_name : "",  last_name: "", tel_number : "", gender : "", 
                    isTeacher : false, isStudent: false, isAdmin : false,  study_year: ""}
    //bank_account_name : "", bank_account_number : "", bank_branch : "", bank_name : ""

const mapStateToProps = state => ({
    formValues: getFormValues('sign-up-form')(state),
    initialValues : emptyUser
});

const formConfiguration = {
    form : "sign-up-form",
    enableReinitialize: true
}

const signUpForm = connect(mapStateToProps)(
    reduxForm(formConfiguration)(SignupConatainer)
);
export default signUpForm