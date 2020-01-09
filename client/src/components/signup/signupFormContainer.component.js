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

const SignupConatainer = ({handleSubmit, formValues}) => {
    // formValues = {"first_name" : "ash",}
    // console.log('signupcontainer: ', handleSubmit);
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
                console.log(local_errors);
                // alert(JSON.stringify(errors))
            } else {
                httpPostRequestToAddUser(formValues, history)
                if(formValues.isStudent) {
                    httpPostRequestToAddStudent(formValues._id)
                } else if (formValues.isTeacher) {
                    httpPostRequestToAddTeacher(formValues._id)

                }
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