import React, { useState, useEffect } from 'react';
import './Settings.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { CgProfile } from 'react-icons/cg';
import { useAuth0 } from '@auth0/auth0-react';
import Requests from './Requests';
import Helper from './Helper';

function Settings() {

    const { user, getAccessTokenSilently } = useAuth0();
    const [userProfileUpdated, setUserProfileUpdated] = useState(false);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userProfileUpdated) {
            getAccessTokenSilently({ ignoreCache: true });
            setUserProfileUpdated(false);
            setLoading(false);
        }
    }, [userProfileUpdated, getAccessTokenSilently]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loading) {
                setLoading(null);
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
        if (!validateFormData(name, nickname, picture)) {
            setError('Please edit at least one field');
            return;
        }
        setError(null);
        setLoading(true);
        await getAccessTokenSilently().then(token => {
            Requests.editUserProfile(token, user.sub, name, nickname, picture)
                .then(res => {
                    setUserProfileUpdated(true);
                })
                .catch(error => {
                    console.log(error);
                })
            ;
        })
    }

    const validateFormData = (name, nickname, picture) => {
        return (name !== user.name || nickname !== user.nickname || picture !== user.picture) ? true : false;
    }

    const getButtonVariant = () => {
        if (loading === null) return 'primary';
        if (loading) return 'primary';
        if (!loading) return 'success'
    }

    const getButtonInnerHTML = () => {
        if (loading === null) return 'Save';
        if (loading) return '';
        if (!loading) return 'Done!'
    }

    return (
        <Container id="settings-container">
            <div id="profile-title" className="d-flex justify-content-start">
                <CgProfile className="settings-section-icon" />
                <p>Profile Settings</p>
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
                    <Button id="update-profile-btn" className="d-flex justify-content-center align-items-center" variant={getButtonVariant()} type="submit" >
                        {getButtonInnerHTML()}
                        {loading &&
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                    </Button>
                    {error && <p id="error-msg">{error}</p>}
                </div>
            </Form>
        </Container>
    );
};

export default Settings;
