import React from 'react';
import './Settings.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MdSettings } from 'react-icons/md';
import { useAuth0 } from '@auth0/auth0-react';
import Requests from './Requests';

function Settings({ user }) {

    const { getAccessTokenSilently } = useAuth0();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [name, nickname] = [e.target[1].value, e.target[2].value];
        await getAccessTokenSilently({ ignoreCache: true }).then(token => {
            Requests.editUserProfile(token, user.sub, name, nickname).then(res => console.log(res.data));
        })
    }

    return (
        <Container id="settings-container">
            <div className="d-flex justify-content-start">
                <MdSettings className="settings-section-icon" />
                <p>User settings</p>
            </div>
            <Form id="user-settings-form" onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Email address:</Form.Label>
                    <Form.Control type="email" placeholder={user.email} disabled />
                    <Form.Text>{user.email_verified ? 'This is a verified email address' : 'This email has not been verified'}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" placeholder={user.name} disabled />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Nickname:</Form.Label>
                    <Form.Control type="text" placeholder={user.nickname} disabled />
                </Form.Group>
                <Button variant="primary" type="submit" disabled >
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default Settings;
