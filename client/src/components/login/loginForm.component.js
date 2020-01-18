import React, { useState } from 'react'
import { useHistory} from 'react-router-dom'
import {Form , Button, Checkbox} from 'semantic-ui-react'
//TALKS to the backend, sends https requests
import get_mongo_api from '../mongo/paths.component'
import axios from 'axios'
import '../../styles/login-form.scss'
import '../../styles/general.scss'
// form creation = https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
function FormLogin ()  {
    let history = useHistory()
    const httpPostRequestToGetUser = () => {
        const login_user = {  
            _id : inputs.username,
            password : inputs.password,
        }
        axios.post(get_mongo_api('sign_in'), login_user).then((response)=> {
            if (response.data.success) {
                history.push({
                    pathname: '/main',
                    state: { _id : inputs.username },
                    next_role : null
                })
            } else {
                alert(response.data.message)
            }
        })
    }

    const useSignInForm = (callback) => {
        const [inputs, setInputs] = useState({username : '', password : ''})
        const handleSubmit = (event) => {
            if (event) {
                event.preventDefault();
                callback(inputs)
            }
            
        }
        const handleInputChange = (event, {name, value}) => {
            event.persist();
            setInputs(inputs => ({...inputs, [name] : value}));
        }
        return { handleSubmit, handleInputChange,  inputs};
    }

    const {inputs, handleInputChange, handleSubmit} = useSignInForm(httpPostRequestToGetUser);

    const WelcomeHeader = () => {
        return (
            <div>
                <h3 id="welcome">ברוכים הבאים</h3>    
                <h4 id="welcome-to-where">מערכת לניהול שעות החונכות</h4>
                <br></br>
            </div>
        )
    }

    return (
        <div className="right-align rtl-direction">
            <WelcomeHeader/>

            <Form className="login-form">
                <Form.Field>
                    <label>שם משתמש</label>
                    <Form.Input
                        style={{direction:"ltr"}}
                        placeholder='ת.ז'
                        name='username'
                        value={inputs.username} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                
                <Form.Field>
                    <label>סיסמה</label>
                    <Form.Input
                        style={{direction:"ltr"}}
                        type="password"
                        placeholder='סיסמה'
                        name='password'
                        value={inputs.password} 
                        onChange={handleInputChange}
                    />
                </Form.Field>
                
                <Form.Field
                        control={Checkbox}
                        label='שכחתי סיסמה'
                    />

                <Form.Field>
                    <Button onClick={handleSubmit} primary >התחבר</Button>
                </Form.Field>
            </Form>
        </div>
    )
}

export default FormLogin;