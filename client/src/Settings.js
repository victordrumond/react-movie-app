import React, { useState, useEffect, useContext } from 'react';
import './Settings.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import UpdateItemsDocumentation from './UpdateItemsDocumentation';
import { CgProfile } from 'react-icons/cg';
import { BsCheck, BsFillGearFill } from 'react-icons/bs';
import { MdOutlineDownloading } from 'react-icons/md';
import { useAuth0 } from '@auth0/auth0-react';
import { Requests } from './Requests';
import { Helper } from './Helper';
import { LocalStorage } from './LocalStorage';
import { UserContext } from './UserContext';

function Settings() {

    const { user, getAccessTokenSilently } = useAuth0();
    const context = useContext(UserContext);
    
    const [currentCountry, setCurrentCountry] = useState(context.userData.config.general.country);
    const [countries, setCountries] = useState([]);

    const [userProfileUpdated, setUserProfileUpdated] = useState(false);
    const [firstLoading, setFirstLoading] = useState(null);
    const [secondLoading, setSecondLoading] = useState(null);
    const [error, setError] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        getCountries();
    }, []);

    useEffect(() => {
        if (userProfileUpdated) {
            getAccessTokenSilently({ ignoreCache: true });
            setUserProfileUpdated(false);
            setFirstLoading(false);
        }
    }, [userProfileUpdated, getAccessTokenSilently]);

    useEffect(() => {
        if (!firstLoading) {
            const timer = setTimeout(() => {
                setFirstLoading(null);
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [firstLoading]);

    useEffect(() => {
        if (!secondLoading) {
            const timer = setTimeout(() => {
                setSecondLoading(null);
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [secondLoading]);

    const getCountries = () => {
        if (LocalStorage.hasUpdatedCountryList()) {
            setCountries(LocalStorage.getCountryList());
        } else {
            Requests.getCountryList().then(res => {
                LocalStorage.setCountryList(res.data);
                setCountries(res.data);
            })
        }
    }

    const handleSubmitCountry = async (countryCode) => {
        await getAccessTokenSilently().then(token => {
            Requests.updateCountry(token, user, countryCode).then(res => {
                context.setUserData(res.data);
                setCurrentCountry(res.data.config.general.country);
            }).catch(err => {
                console.log(err);
            })
        })
    }

    const handleSubmitProfile = async (e) => {
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
        setFirstLoading(true);
        await getAccessTokenSilently().then(token => {
            Requests.editUserProfile(token, user.sub, name, nickname, picture)
                .then(res => {
                    setUserProfileUpdated(true);
                })
                .catch(err => {
                    console.log(err);
                })
            ;
        })
    }

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        const [id, type] = [e.target[0].value.split('-')[1], e.target[0].value.split('-')[0]];
        setSecondLoading(true);
        await getAccessTokenSilently().then(token => {
            Requests.updateItemData(token, user, id, type)
                .then(res => {
                    context.setUserData(res.data);
                    setSecondLoading(false);
                })
                .catch(err => {
                    console.log(err);
                })
            ;
        })
    }

    const validateFormData = (name, nickname, picture) => {
        return (name !== user.name || nickname !== user.nickname || picture !== user.picture);
    }

    const getButtonVariant = (loadingState) => {
        if (loadingState === null) return 'primary';
        if (loadingState) return 'primary';
        if (!loadingState) return 'success'
    }

    const getButtonInnerHTML = (loadingState, defaultText) => {
        if (loadingState === null) return defaultText;
        if (loadingState) return '';
        if (!loadingState) return 'Done!'
    }

    const alphabetize = (savedItems) => {
        return savedItems.sort((a, b) => {
            let [aTitle, bTitle] = [a.data.title || a.data.name, b.data.title || b.data.name];
            return aTitle.localeCompare(bTitle);
        })
    }

    if (countries.length === 0) {
        return <p>Loading...</p>
    } else {
        return (
            <Container id="settings-container">

                <div id="general-title" className="d-flex justify-content-start">
                    <BsFillGearFill className="settings-section-icon" />
                    <p>General Settings</p>
                </div>
                <Form id="general-settings-form" >
                    <Form.Label>Country:</Form.Label>
                    <Form.Select id="default-country" defaultValue={currentCountry} onChange={(e) => handleSubmitCountry(e.target.value)} >
                        {countries.length > 0 && countries.map((item, i) => (
                            <option key={i} value={item.iso_3166_1}>{item.english_name}</option>
                        ))}
                    </Form.Select>
                    <Form.Text>Used to show regional information such as parental rating and watch availability</Form.Text>
                </Form>
                <div id="profile-title" className="d-flex justify-content-start">
                    <CgProfile className="settings-section-icon" />
                    <p>Profile Settings</p>
                </div>
                <Form id="user-settings-form" onSubmit={(e) => handleSubmitProfile(e)}>
                    <Form.Group className="mb-2" controlId="formEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" defaultValue={user.email} disabled />
                        <div>
                            {user.email_verified ? <BsCheck className="text-success email-status-icon" /> : ""}
                            <Form.Text>{user.email_verified ? 'This is a verified email address' : 'This email has not been verified yet'}</Form.Text>
                        </div>
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
                    <div className="pt-2 d-flex justify-content-end align-items-center">
                        <Button id="update-profile-btn" className="d-flex justify-content-center align-items-center" variant={getButtonVariant(firstLoading)} type="submit" >
                            {getButtonInnerHTML(firstLoading, 'Save')}
                            {firstLoading &&
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
                <div id="update-title" className="d-flex justify-content-start">
                    <MdOutlineDownloading className="update-section-icon" />
                    <p>Update items</p>
                </div>
                <Form id="update-settings-form" onSubmit={(e) => handleUpdateItem(e)}>
                    <Form.Label>Select saved item:</Form.Label>
                    <Form.Select id="update-item">
                        {context.userData.movies.length > 0 && alphabetize(context.userData.movies).map((item, i) => (
                            <option key={i} value={`${item.data.media_type}-${item.data.id}`}>{item.data.name || item.data.title}</option>
                        ))}
                    </Form.Select>
                    <Form.Text id="learn-more-link" onClick={() => setShowInfo(true)}>
                        Learn more
                    </Form.Text>
                    <div className="pt-2 d-flex justify-content-end align-items-center">
                        <Button id="update-items-btn" className="d-flex justify-content-center align-items-center" variant={getButtonVariant(secondLoading)} type="submit" >
                            {getButtonInnerHTML(secondLoading, 'Update')}
                            {secondLoading &&
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />}
                        </Button>
                    </div>
                </Form>

                {showInfo && <UpdateItemsDocumentation display={showInfo} hide={() => setShowInfo(false)}/>}

            </Container>
        )
    };

};

export default Settings;
