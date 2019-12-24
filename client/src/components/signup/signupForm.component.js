import React, { useState } from 'react';
import { Container} from 'react-bootstrap'
import { Form,  Label, Dropdown, Button, Radio, Checkbox, Icon} from 'semantic-ui-react';
import axios from 'axios'
import {Link , useHistory } from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import {validateForm, check_and_assign_errors, error_default_messages}  from './validationFields'

function SignupForm(props) {
    let history = useHistory()
    // const a = props
    // console.log(props.user)

    const useSignUpForm = (callback) => {
        const [userState, setUserState] = useState(props.user)
        const [validForm, setValidForm] = useState(false)
        const [errors, setErrors] = useState({
            first_name_error: error_default_messages.first_name_error,
            last_name_error: error_default_messages.last_name_error,
            id_number_error : error_default_messages.id_number_error,
            tel_number_error:  error_default_messages.tel_number_error,
            password_error:  error_default_messages.password_error,
            year_error :error_default_messages.year_error,
            email_error :  error_default_messages.email_error,
            gender_error : error_default_messages.gender_error,
            role_error : error_default_messages.role_error,
        })
        const handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
                callback()
            }
            
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
        return { handleSubmit, handleInputChange, userState, validForm, errors };
    }
    // const [id_disable, setIdDisabled] = useState(false)


    // const set_disabled_id = user => {
    //     if (user._id !== '') {
    //         setIdDisabled(true)
    //     }
    // }
    // const set_errors = (user) => {
    //     //when the props coming from the user update details - it has to check first if there are error, which is not supposed to happen, so it makes all the errors null
    //     let temp_errors = errors;
    //     // let valid_form = false;
    //     Object.keys(userState).forEach(key => {
    //         temp_errors = check_and_assign_errors(key, user[key], temp_errors)
    //     })
    //     // let valid_form = validateForm(temp_errors)
    //     let temp_valid_form = false
    //     if(user.isStudent || user.isTeacher) {
    //         temp_errors.role_error = null
    //         temp_valid_form = true
    //     } 
    //     setErrors(temp_errors)
    //     setValidForm((validateForm(temp_errors) && (temp_valid_form)))
    // }
    // useEffect(()=>{
    //     set_errors(props.user)
    //     set_disabled_id(props.user)
    // })

    const httpPostRequestToAddUser = () => {
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
        axios.post('http://localhost:5000/users/add', user_to_add)
        .then((response)=> {
                    if (response.data.success) {
                        history.push('/')
                    } else {
                        alert(response.data.message)
                   }
        })
    }  
    const {handleSubmit,handleInputChange, userState, validForm, errors  } = useSignUpForm(httpPostRequestToAddUser);

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
                    name='year'
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
        const {bank_number, bank_branch, bank_account} = userState
        return (
            <Form.Field required width={2}>
                <label>פרטי בנק</label>
                <Form.Input
                    placeholder="מס' חשבון"
                    name='bank_account'
                    value={bank_account}
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="סניף"
                    name='bank_branch'
                    value={bank_branch}
                    onChange={handleInputChange}
                />
                <Form.Input
                    placeholder="מס' בנק"
                    name='bank_number'
                    value={bank_number}
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

export default function signupConatainer (props) {
    console.log(JSON.stringify(props))
    return (
        <div  id="land-page" className="bg" style={{direction:"rtl"}}>
            <Container id="signup-box"  className="right-align">
                <h3>כותרת טופס הרשמה שנראית טוב</h3>
                <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
                    <Icon size='big' name='arrow right' style={{margin:"2%"}}></Icon>
                </Link>
                <SignupForm user={props.location.state}/>
            </Container>
        </div>
       
        
    )
}
