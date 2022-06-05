import React, { useState, useEffect } from 'react';
import './Settings.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CgProfile } from 'react-icons/cg';
import { useAuth0 } from '@auth0/auth0-react';
import Requests from './Requests';
import Helper from './Helper';

function Settings() {

    const { user, getAccessTokenSilently } = useAuth0();
    const [userProfileUpdated, setUserProfileUpdated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userProfileUpdated) {
            getAccessTokenSilently({ ignoreCache: true });
            setUserProfileUpdated(false);
        }
    }, [userProfileUpdated, getAccessTokenSilently]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                setLoading(false);
            };
        }, 5000)
        return () => clearTimeout(timer)
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [name, nickname, picture] = [e.target[1].value, e.target[2].value, e.target[3].value.replace(/ /g, '')];
        if (!Helper.validateUsername(nickname)) {
            setError('Invalid username');
            return;
        }
        setLoading(true);
        await getAccessTokenSilently().then(token => {
            Requests.editUserProfile(token, user.sub, name, nickname, picture)
                .then(res => {
                    setError(null);
                    setUserProfileUpdated(true);
                })
                .catch(error => {
                    console.log(error);
                })
            ;
        })
    }

    return (
        <Container id="settings-container">
            <div className="d-flex justify-content-start">
                <CgProfile className="settings-section-icon" />
                <p>Profile</p>
            </div>
            <Form id="user-settings-form" onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-2" controlId="formEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" defaultValue={user.email} disabled />
                    <Form.Text>{user.email_verified ? 'This is a verified email address' : 'This email has not been verified'}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" defaultValue={user.name} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formNickname">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="text" defaultValue={user.nickname} />
                </Form.Group>
                <Form.Group className="mb-2 d-flex flex-column" controlId="formPicture">
                    <Form.Label>Picture URL:</Form.Label>
                    <Form.Control type="url" defaultValue={user.picture} />
                </Form.Group>
                <div className="pt-2 d-flex justify-content-start align-items-center">
                    <Button id="update-profile-btn" variant={loading ? "success" : "primary"} type="submit" >
                        {loading ? "Done!" : "Save"}
                    </Button>
                    {error && <p id="error-msg">{error}</p>}
                </div>
            </Form>
        </Container>
    );
};

export default Settings;
