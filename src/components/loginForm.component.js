
import React from 'react'
import {Form , Button} from 'react-bootstrap'
import '../styles/login-form.scss'
function WelcomeHeader() {
    return (
        <h3 id="welcome">
            ברוכים הבאים
            <h4 id="welcome-to-where">
                מערכת לניהול שעות החונכות
            </h4>
        </h3>
    )
}
function FormLogin () {
    return (
        <div className="right-align">
            <WelcomeHeader/>
            <Form>
                <Form.Group controlId="login-username">
                    <Form.Label>שם משתמש</Form.Label>
                        <Form.Control type="text" placeholder="ת.ז" />
                    <Form.Text className="text-muted">
                        תעודת זהות
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="login-password">
                    <Form.Label>סיסמה</Form.Label>
                    <Form.Control type="password" placeholder="סיסמה" />
                </Form.Group>
                <Form.Group controlId="forgotPassword">
                    <div class="form-check" className="check">
                        <label title="" for="forgotPassword" class="form-check-label">
                        שכחתי סיסמה
                        </label>
                        <input type="checkbox" id="forgotPasswordCheckBox" class="form-check-input" ></input>
                        
                    </div>
                    {/* <Form.Check type="checkbox" label="שכחתי סיסמה" /> */}
                </Form.Group>
                <Button variant="primary" type="submit">
                    התחבר
                </Button>
            </Form>
            {/* <Form>
                <h5 id="comment-user-name">שם המשתמש והסיסמא של האינבר</h5>
                <Form.Field className="input-field">
                    <Input icon='user outline' placeholder='שם משתמש' />
                </Form.Field>

                <Form.Field className="input-field">
                    <Input icon='lock' placeholder='סיסמא' />
                </Form.Field>

                <Form.Field id="buttons-login-id" className="buttons-login">
                    <button id="login-btn" className="btn" ><div>כניסה</div></button>
                    <Modal trigger={Signup_Button()} centered={true}>
                        <Modal.Content>
                            <Modal.Description>
                                <Header>
                                    <h1>hey</h1>
                                </Header>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                    
                </Form.Field>
            </Form> */}
        </div>

    )
}

export default FormLogin;