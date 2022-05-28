import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import Requests from './Requests';
import { useAuth0 } from '@auth0/auth0-react';
import { initUserData, UserContext } from './UserContext';
import logo from './logo.png';
import Search from './Search';
import Main from './Main';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function Dashboard() {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/home/watchlist' && location.pathname !== '/home/watched') {
            navigate('/home/favorites');
        }
    }, [navigate, location.pathname]);

    const { user, logout } = useAuth0();
    const [userData, setUserData] = useState(initUserData);
    const context = { userData, setUserData };

    useEffect(() => {
        Requests.getUser(user.email).then((res) => {
            if (res.data) {
                console.log('User data updated');
                setUserData(res.data);
            } else {
                Requests.setUser(user).then((res) => {
                    if (res.data) {
                        console.log('User data updated');
                        setUserData(res.data);
                    }
                })
            }
        })
    }, [user]);

    return (
        <UserContext.Provider value={context}>
        <Container id="dashboard-container">
            <div id="header-container" className="d-flex justify-content-between">
                <div id="name-and-logo" className="d-flex">
                    <h2>React Movie App</h2>
                    <div className="d-flex">
                        <img src={logo} alt="app_logo" className="img-fluid" />
                    </div>
                </div>
                <div id="logout-wrapper" className="d-flex flex-column">
                    <p>Welcome back, <b>{userData.user.email}</b>!</p>
                    <Button id="logout" variant="primary" onClick={() => logout()}>
                        Logout
                    </Button>
                </div>
            </div>
            <Search />
            <Routes>
                <Route path="/home/*" element={<Main />} />
            </Routes>
            <div id="footer-container" className="d-flex flex-column align-items-center justify-content-center">
                <p>&#169; 2022 React Movie App | A project by Victor</p>
                <p>This product uses the <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMBd</a> API but is not endorsed or certified by TMDb.</p>
            </div>
        </Container>
        </UserContext.Provider>
    );
};

export default Dashboard;