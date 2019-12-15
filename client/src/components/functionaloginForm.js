
import React, { useState } from 'react'
import {Link , useHistory} from 'react-router-dom'
import {Form , Button, Checkbox} from 'semantic-ui-react'
import axios from 'axios'
import '../styles/login-form.scss'
import '../styles/general.scss'
// form creatiom = https://medium.com/@geeky_writer_/using-react-hooks-to-create-awesome-forms-6f846a4ce57
function FormLogin ()  {
    let history = useHistory()
    const postRequestToValidate = () => {
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
        const handleInputChange = (event) => {
            event.persist();
            setInputs(inputs => ({...inputs, [event.target.name] : event.target.value}));
        }
        return {
            handleSubmit,
            handleInputChange,
            inputs
        };
    }

    const consoleFunc = () => {
        console.log("the user is: " + inputs.username + " " + inputs.password);
    }
    const {inputs, handleInputChange, handleSubmit} = useSignInForm(postRequestToValidate);
    
/**
handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
 */
   /**
    *
    onSignIn(e) {
        e.preventDefault();
        const {username, password} = this.state
        const login_user = {  
            _id : username,
            password : password,
        }
        axios.post('http://localhost:5000/sign_in/', login_user).then((response)=> {
            console.log("success: " + (response.data.success));
            console.log("message: " + (response.data.message));
            if (response.data.success) {
                this.setState({
                    isLoading : false,
                    redirect : true,
                })
            } else {
                console.log(response.data.message);
                console.log("not succ " + response.data.message);
           }
        }).then(()=>{
            this.setState({
                isLoading : false,
            });
        })
    }
    */ 
    
    /**
     *     componentWillUnmount() {
        this._isMounted = false;
    }
     */


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
        <div className="right-align">
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
                    <Link to="/signup">
                        <Button color="teal">להרשמה</Button>
                    </Link>
                    <Button onClick={handleSubmit} primary>התחבר</Button>
                </Form.Field>
            </Form>
        </div>
    )
    /**
     render() {
        const { username, password, redirect } = this.state
        if (redirect) {
            return (
                <Redirect to={{pathname:'/main', state:{first_name:username} }}></Redirect>
            )
        }
    }

     */
    
        
}

export default FormLogin;