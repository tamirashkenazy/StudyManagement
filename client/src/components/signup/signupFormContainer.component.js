import React , { useState } from 'react';
import { Container} from 'react-bootstrap'
import { Icon} from 'semantic-ui-react';
import {Link , useHistory} from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
// import {SignupForm} from './signupForm.component'
import {SignupFormRedux} from './signupFormRedux'
import {reduxForm, getFormValues } from 'redux-form'
import {connect } from 'react-redux'

import axios from 'axios'
import get_mongo_api from '../mongo/paths.component'
import { check_errors, validateForm, allFieldsExist } from './validationFields';

const SignupConatainer = ({handleSubmit, formValues}) => {
    // formValues = {"first_name" : "ash",}
    // console.log('signupcontainer: ', handleSubmit);
    const history = useHistory()
    function httpPostRequestToAddUser(formValues) {
        const user_to_add = {  
            _id : formValues._id,
            password : formValues.password,
            email: formValues.email,
            first_name : formValues.first_name, 
            last_name: formValues.last_name, 
            tel_number : formValues.tel_number,
            gender : formValues.gender,
            isTeacher : formValues.isTeacher,
            isStudent: formValues.isStudent,
            isAdmin : false,
            study_year: formValues.study_year,
        }
        console.log("the user is: " + user_to_add);
        axios.post(get_mongo_api('users/add'), user_to_add)
        .then((response)=> {
            if (response.data.success) {
                history.push('/')
            } else {
                alert(response.data.message)
            }
        })
    } 

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
                console.log(local_errors);
                // alert(JSON.stringify(errors))
            } else {
                httpPostRequestToAddUser(formValues)
                // httpPostRequestToAddTeacher(formValues)
                // httpPostRequestToAddStudent(formValues)
            }
        }
        
    }

    return (
        <div  id="land-page" className="bg" style={{direction:"rtl"}}>
            <Container id="signup-box"  className="right-align">
                <h3>כותרת טופס הרשמה שנראית טוב</h3>
                <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
                    <Icon size='big' name='arrow right' style={{margin:"2%"}}></Icon>
                </Link>
                <SignupFormRedux onSubmit={submitForm} handleSubmit={handleSubmit} errors={errors} formValues={formValues} formSubmitButtonName="הירשם"/> 
            </Container>
        </div>
    )
}


const emptyUser = {   _id : "", password : "", email: "", first_name : "",  last_name: "", tel_number : "", gender : "", isTeacher : false, isStudent: false, isAdmin : false,  
                    study_year: "", bank_account_name : "", bank_account_number : "", bank_branch : "", bank_name : ""}

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