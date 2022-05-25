import React, { useState, useCallback, useEffect } from 'react';
import './Dashboard.css';
import Requests from './Requests';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from './UserContext';
import logo from './logo.png';
import Search from './Search';
import Main from './Main';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function Dashboard() {

    let initUser = {
        user: '',
        lists: { favorites: [], watchList: [], watched: [] },
        config: {
            lists: {
                favorites: { filtering: "last_added" },
                watchList: { filtering: "last_added" },
                watched: { filtering: "last_added" }
            }
        }
    }

    const { user, logout } = useAuth0();
    const [userData, setUserData] = useState(initUser);

    const updatedFromSearch = useCallback(updatedData => {
        console.log('User data updated');
        setUserData(updatedData);
    }, []);

    const updatedFromMain = useCallback(updatedData => {
        console.log('User data updated');
        setUserData(updatedData);
    }, []);

    useEffect(() => {
        Requests.getUser(user.email).then((res) => {
            if (res.data) {
                console.log('User data updated');
                setUserData(res.data);
            } else {
                Requests.setUser(user.email).then((res) => {
                    if (res.data) {
                        console.log('User data updated');
                        setUserData(res.data);
                    }
                })
            }
        })
    }, [user]);

    return (
        <UserContext.Provider value={user}>
        <Container id="dashboard-container">
            <div id="header-container" className="d-flex justify-content-between">
                <div id="name-and-logo" className="d-flex">
                    <h2>React Movie App</h2>
                    <div className="d-flex">
                        <img src={logo} alt="app_logo" className="img-fluid" />
                    </div>
                </div>
                <div id="logout-wrapper" className="d-flex flex-column">
                    <p>Welcome back, <b>{user.email}</b>!</p>
                    <Button id="logout" variant="primary" onClick={() => logout()}>
                        Logout
                    </Button>
                </div>
            </div>
            <Search updateDashboard={updatedFromSearch} />
            <Main userData={userData} updateDashboard={updatedFromMain} />
            <div id="footer-container" className="d-flex align-items-center justify-content-center">
                <p>&#169; 2022 React Movie App | A project by Victor</p>
            </div>
        </Container>
        </UserContext.Provider>
    );
};

export default Dashboard;