import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { Requests } from './Requests';
import { useAuth0 } from '@auth0/auth0-react';
import { initUserData, UserContext } from './UserContext';
import logo from './logo.png';
import Sidebar from './Sidebar';
import Search from './Search';
import Main from './Main';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function Dashboard() {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/home/watchlist' && location.pathname !== '/home/watching' && location.pathname !== '/home/watched') {
            navigate('/home/favorites');
        }
    }, [navigate, location.pathname]);

    const { user, logout, getAccessTokenSilently } = useAuth0();
    const [userData, setUserData] = useState(initUserData);
    const context = { userData, setUserData };
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        findUserOnDatabase();
        // eslint-disable-next-line
    }, [user]);

    const findUserOnDatabase = async () => {
        await getAccessTokenSilently().then(token => {
            Requests.getUser(token, user).then((res) => {
                if (res.data) {
                    setUserData(res.data);
                } else if (!res.data) {
                    Requests.setUser(token, user).then((res) => {
                        if (res.data) {
                            setUserData(res.data);
                        }
                    })
                }
            })
        })
    }

    return (
        <UserContext.Provider value={context}>
        <Container id="dashboard-container">
            <div id="header-container" className="d-flex justify-content-between align-items-center">
                <div id="name-and-logo" className="d-flex">
                    <h2>React Movie App</h2>
                    <div className="d-flex">
                        <img src={logo} alt="app_logo" className="img-fluid" />
                    </div>
                </div>
                <Button id="sidebar" variant="primary" onClick={() => setShowSidebar(true)}>
                    Sidebar
                </Button>
                <Sidebar
                    show={showSidebar}
                    hide={() => setShowSidebar(false)}
                    user={user}
                    logout={logout}
                />
            </div>
            <Search />
            <Routes>
                <Route path="/home/*" element={<Main />} />
            </Routes>
            <div id="footer-container" className="d-flex flex-column align-items-center justify-content-center">
                <p>&#169; 2022 React Movie App | A project by Victor</p>
                <p id="tmdb-credits">This product uses the TMDb API but is not endorsed or certified by <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMBd</a>.</p>
            </div>
        </Container>
        </UserContext.Provider>
    );
};

export default Dashboard;