import React from 'react';
import './Settings.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { MdSettings } from 'react-icons/md';

function Settings({ user }) {

    return (
        <Container id="settings-container">
            <div className="d-flex justify-content-start">
                <MdSettings className="settings-section-icon" />
                <p>User settings</p>
            </div>
            <Form id="user-settings-form">
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Email address:</Form.Label>
                    <Form.Control type="email" placeholder={user.email} disabled/>
                    <Form.Text>{user.email_verified ? 'This is a verified email address' : 'This email has not been verified'}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" placeholder={user.name} disabled/>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Nickname:</Form.Label>
                    <Form.Control type="text" placeholder={user.nickname} disabled/>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default Settings;
