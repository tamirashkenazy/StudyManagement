import React from 'react';
import { Link } from 'react-router-dom'
import {Container, Row, Col, Image} from 'react-bootstrap'
import '../styles/App.scss'
import login_people_books from '../images/background_images/login_people_books.jpg'
import study_management from '../images/background_images/study_management.png'
import FormLogin from './loginForm.component'
function LoginBox() {
    return(
        <Container className="login-box">
            <Row > {/**noGutters={true} */}
                <Col className="images-login">
                    <Container>
                        <Row>
                            <Image src={study_management} fluid="true"  className="study-photo"></Image>
                        </Row>
                        <Row>
                            <Image src={login_people_books} fluid="true"  className="people-photo"></Image>
                        </Row>
                    </Container>
                </Col>
                <Col>
                    <FormLogin></FormLogin>
                </Col>
            </Row>
        </Container>
    );
}

function LandingPage () {
    return(
        <LoginBox></LoginBox>
    )
}

export default LandingPage