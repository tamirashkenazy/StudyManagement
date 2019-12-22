//useState - hooks in react
import React, { useState } from 'react'
//REST
import {Link , useHistory} from 'react-router-dom'
import {Form , Button, Checkbox} from 'semantic-ui-react'
//TALKS to the backend, sends https requests
import axios from 'axios'
import '../../styles/login-form.scss'
import '../../styles/general.scss'
// form creatiom = https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
function FormLogin ()  {
    let history = useHistory()
    const httpPostRequestToGetUser = () => {
        const login_user = {  
            _id : inputs.username,
            password : inputs.password,
        }
        console.log("the user is: " + inputs.username + " " + inputs.password);
        axios.post('http://localhost:5000/sign_in/', login_user).then((response)=> {
                    if (response.data.success) {
                        history.push({
                            pathname: '/main',
                            state: { _id : inputs.username }
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
                callback()
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
                        placeholder='ת.ז'
                        name='username'
                        value={inputs.username} // || ''
                        onChange={handleInputChange}
                    />
                </Form.Field>
                
                <Form.Field>
                    <label>סיסמה</label>
                    <Form.Input
                        type="password"
                        placeholder='סיסמה'
                        name='password'
                        value={inputs.password} // || ''
                        onChange={handleInputChange}
                    />
                </Form.Field>
                
                <Form.Field
                        control={Checkbox}
                        label='שכחתי סיסמה'
                    />

                <Form.Field>
                    <Button onClick={handleSubmit} primary >התחבר</Button>
                    <Link to="/signup" style={{marginRight : '9%'}}>
                        <Button color="teal">להרשמה</Button>
                    </Link>
                </Form.Field>
            </Form>
        </div>
    )
    
}

export default FormLogin;