import React from 'react';
import {Container, Row, Col, Image} from 'react-bootstrap'
import '../styles/App.scss'
import login_people_books from '../images/background_images/login_people_books.jpg'
import study_management from '../images/background_images/study_management.png'
import FormLogin from './functionaloginForm'


function ImagesLogin() {
    return (
            <Container>
                <Row>
                    <Image src={study_management} fluid="true"  className="study-photo"></Image>
                </Row>
                <Row>
                    <Image src={login_people_books} fluid="true"  className="people-photo"></Image>
                </Row>
            </Container>
    )
}

function LoginBox() {
    return(
        <Container id="login-box">
            <Row style={{padding: '3%'}}>
                <Col id="images-login">
                    <ImagesLogin></ImagesLogin>
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