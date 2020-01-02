import React, { useState} from 'react';
// import { Container} from 'react-bootstrap'
import { Form,  Label, Dropdown, Button, Radio, Checkbox} from 'semantic-ui-react';
import {useHistory} from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import {validateForm, check_and_assign_errors, error_default_messages}  from './validationFields'
import axios from 'axios'
import get_mongo_api from '../mongo/paths.component'

function SignupForm(props) {
    const history = useHistory()
    // console.log(JSON.stringify(props));

    function httpPostAddStudent() {
        console.log("Added student")
    }
    function httpPostAddTeacher(){
        const {_id, bank_account_name, bank_account_number, bank_branch, bank_number  } = userState
        const teacher_to_add = {  
            _id : _id,
            bank_account_name : bank_account_name,
            bank_account_number : bank_account_number,
            bank_branch : bank_branch,
            bank_name : bank_number,
            teaching_courses : null,
            hours_available : null,
            teaching_requests : null,
            lessons : null,
            grades_file : null,
        }
        console.log("the teacher is: " + teacher_to_add);
        axios.post(get_mongo_api('teachers/add'), teacher_to_add)
        .then((response)=> {
                    if (response.data.success) {
                        // think about something to do
                    } else {
                        alert(response.data.message)
                   }
        })
    }
    
    function httpPostRequestToAddUser() {
        const {_id, password, email, first_name, last_name, tel_number, gender, isTeacher, isStudent, study_year } = userState
        const user_to_add = {  
            _id : _id,
            password : password,
            email: email,
            first_name : first_name, 
            last_name: last_name, 
            tel_number : tel_number,
            gender : gender,
            isTeacher : isTeacher,
            isStudent: isStudent,
            isAdmin : false,
            study_year: study_year,
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

    

    const useSignUpForm = (addUserOnSignUp, addTeacherOnSignUp, addStudentOnSignUp) => {
        const [userState, setUserState] = useState(props.user)
        const [validForm, setValidForm] = useState(false)
        const [errors, setErrors] = useState({
            first_name_error: error_default_messages.first_name_error,
            last_name_error: error_default_messages.last_name_error,
            id_number_error : error_default_messages.id_number_error,
            tel_number_error:  error_default_messages.tel_number_error,
            password_error:  error_default_messages.password_error,
            year_error : error_default_messages.year_error,
            email_error :  error_default_messages.email_error,
            gender_error : error_default_messages.gender_error,
            role_error : error_default_messages.role_error,
        })
        const handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
                if (userState.isTeacher) {
                    addTeacherOnSignUp()
                }
                if (userState.isStudent) {
                    addStudentOnSignUp()
                }
                addUserOnSignUp()
            }
            
        }
        const checkForErrors = () => {
            // console.log('errorrorororos');
            let temp_errors = {
                first_name_error: null,
                last_name_error: null,
                id_number_error : null,
                tel_number_error:  null,
                password_error:  error_default_messages.password_error,
                year_error : null,
                email_error :  null,
                gender_error : null,
                role_error : null,
            }
            setErrors(temp_errors)
            return errors
        }
        const handleInputChange = (event, {name, value, checked, type}) => {
            //If you want to access the event properties in an asynchronous way, 
            //you should call event.persist() on the event, which will remove the synthetic event from the pool  
            //and allow references to the event to be retained by user code.
            const local_value = (type === 'checkbox') ? checked : value
            event.persist();
            let valid_form = false
            if (type !== 'checkbox') {
                let temp_errors = check_and_assign_errors(name, local_value, errors)
                valid_form = validateForm(temp_errors)
                setValidForm(valid_form && (userState.isStudent || userState.isTeacher))
                setErrors(temp_errors)
            } else {
                if (checked || ((name==='isStudent' && userState.isTeacher) || (name==='isTeacher' && userState.isStudent))) {
                    valid_form = true
                }
                let role_error= null
                if (!valid_form) {
                     role_error = error_default_messages.role_error
                }
                setErrors(oldErrors => ({...oldErrors, role_error : role_error}))
                //the validForm is validate the fields without relation to checkbox
                setValidForm((validateForm(errors) && (valid_form)))

            }
            setUserState(inputs => ({...inputs, [name] : local_value}));
        }
        // console.log(userState);
        return { handleSubmit, handleInputChange, userState, validForm, errors, checkForErrors };
    }

    const {handleSubmit,handleInputChange, userState, validForm, errors, checkForErrors  } = useSignUpForm(httpPostRequestToAddUser, httpPostAddTeacher, httpPostAddStudent );
    // useEffect(()=>{
    //     checkForErrors()
    // })
    const email_field = () => {
        const { email } = userState
        const { email_error } = errors
        return (
            <Form.Field required>
                <label>אימייל</label>
                <Form.Input style={{direction:"ltr"}}
                    name='email'
                    value={email}
                    placeholder='@e-mail'
                    onChange={handleInputChange}
                    error={ email_error ? email_error : null }
                />
            </Form.Field>
        )
    }
    
    const password_field = () => {
        const { password } = userState
        const { password_error } = errors
        return (
            <Form.Field required>
                <label>סיסמה</label>
                <Form.Input
                    type="password"
                    placeholder='סיסמה'
                    name='password'
                    value={password}
                    onChange={handleInputChange}
                    error={password_error ? password_error : null}
                />
            </Form.Field>
        )
    }
    const id_number_field = () => {
        const { _id } = userState
        const { id_number_error } = errors

        return (
            <Form.Field required>
                <label>ת.ז</label>
                <Form.Input style={{direction:"ltr"}}
                    // disabled = {id_disable}
                    placeholder='ת.ז - שם משתמש'
                    name='_id'
                    value={_id}
                    onChange={handleInputChange}
                    error={id_number_error ? id_number_error : null}
                />
                <Label size="tiny" pointing>שם המשתמש</Label>
            </Form.Field>
        )
    }
    const tel_number_field = () => {
        const { tel_number } = userState
        const { tel_number_error } = errors
        return (
            <Form.Field required>
                <label>מס' טלפון</label>
                <Form.Input style={{direction:"ltr"}}
                    placeholder='05xxxxxxxx'
                    name='tel_number'
                    value={tel_number}
                    onChange={handleInputChange}
                    error={ tel_number_error ? tel_number_error : null}
                />
            </Form.Field>
        )
        
    }

    const last_name_field = () => {
        const { last_name } = userState
        const { last_name_error }= errors
        return (
            <Form.Field required>
                <label>שם משפחה</label>
                <Form.Input
                    placeholder='שם משפחה'
                    name='last_name'
                    value={last_name}
                    onChange={handleInputChange}
                    error={ last_name_error ? last_name_error : null }
                />
            </Form.Field>
        )
        
    }
    const first_name_field = () => {
        const { first_name } = userState
        const { first_name_error } = errors
        return (
            <Form.Field required>
                <label>שם פרטי</label>
                <Form.Input
                    placeholder='שם פרטי'
                    name='first_name'
                    value={first_name}
                    onChange={handleInputChange}
                    error={ first_name_error ? first_name_error  : null }
                />
            </Form.Field>
        )
    }
    const genders_field = () => {
        const { gender } = userState
        return (
            <>
                <Form.Field  width={1} 
                    name="gender"
                    control={Radio}
                    label='נקבה'
                    value='female'
                    checked={gender === 'female'}
                    onChange={handleInputChange}
                />
                <Form.Field    width={1}           
                    name="gender"
                    control={Radio}
                    label='זכר'
                    value='male'
                    checked={gender === 'male'}
                    onChange={handleInputChange}
                />
            </>
        )
    }
    const roles_field = () => {
        const {isStudent, isTeacher} = userState
        return (
            <>
            <Form.Field width={1}  
                name='isStudent'
                control={Checkbox}
                label='תלמיד'
                checked={isStudent}
                onChange={handleInputChange}
            />
            <Form.Field  width={1}    
                name='isTeacher'
                control={Checkbox}
                label='מורה'
                checked={isTeacher}
                onChange={handleInputChange}
            />
            </>
        )

    }

    const study_year_field = () => {
        const options = [
            { key: 'a', text: 'שנה א', value: 'year-a' },
            { key: 'b', text: 'שנה ב', value: 'year-b' },
            { key: 'c', text: 'שנה ג', value: 'year-c' },
            { key: 'd', text: 'שנה ד', value: 'year-d' },
            { key: 'e', text: 'שנה ה', value: 'year-e' },
        ]
        const {study_year} = userState
        return (
            <Form.Field required  width={4} >
                <label>שנת לימודים</label>
                <Dropdown 
                    name='study_year'
                    value={study_year}
                    clearable 
                    options={options} 
                    selection 
                    onChange={handleInputChange} 
                />
            </Form.Field>
        )
    }
    const bank_details_field = () => {
        const {bank_number, bank_branch, bank_account_number, bank_account_name} = userState
        return (
            <Form.Field required width={2}>
                <label>פרטי בנק</label>
                <Form.Input
                    placeholder="שם החשבון"
                    name='bank_account_name'
                    value={bank_account_name}
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="מס' בנק"
                    name='bank_number'
                    value={bank_number}
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="סניף"
                    name='bank_branch'
                    value={bank_branch}
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="מס' חשבון"
                    name='bank_account_number'
                    value={bank_account_number}
                    onChange={handleInputChange}
                />
            </Form.Field>
        )
    }
    return (
        <Form style={{margin:"2%"}}>
            <Form.Group widths='equal'>
                {id_number_field()}
                {password_field()}
                {email_field()}
            </Form.Group>
            <Form.Group widths='equal'>
                {first_name_field()}
                {last_name_field()}
                {tel_number_field()}
            </Form.Group>
            <Form.Group  widths='equal'>
                {study_year_field()}
                {roles_field()}
                {userState.isTeacher ? bank_details_field() : <></>}
                {genders_field()}
            </Form.Group>
            <Form.Group>
                <Form.Field>
                    <Button onClick={handleSubmit} primary disabled={!validForm}>הירשם</Button>
                </Form.Field>
            </Form.Group>
        </Form>
    )
}
