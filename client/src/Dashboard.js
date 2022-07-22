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
import Discover from './Discover';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import useWindowSize from './useWindowSize';

function Dashboard() {

    const navigate = useNavigate();
    const location = useLocation();
    const width = useWindowSize().width;

    useEffect(() => {
        if (location.pathname !== '/home/watchlist' && location.pathname !== '/home/watching' && location.pathname !== '/home/watched' && location.pathname !== '/discover') {
            navigate('/home/favorites');
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const { user, logout, getAccessTokenSilently } = useAuth0();
    const [userData, setUserData] = useState(initUserData);
    const context = { userData, setUserData };
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeView, setActiveView] = useState(location.pathname === '/discover' ? 'discover' : 'home');

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

    const handleChangeView = (view) => {
        if (view !== 'home' && activeView === 'home') {
            setActiveView('discover');
            navigate('/discover');
        }
        if (view !== 'discover' && activeView === 'discover') {
            setActiveView('home');
            navigate('/home/favorites');
        }
    }

    if (userData.user.email === 'email') {
        return <p id="loading-msg">Loading...</p>
    } else return (
        <UserContext.Provider value={context}>
        <Container id="dashboard-container">
            <div id="header-container" className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                    <h2>React Movie App</h2>
                    <div className="d-flex">
                        <img src={logo} alt="app_logo" className="img-fluid" />
                    </div>
                </div>
                {width > 575 &&
                    <div>
                        <ButtonGroup className="mx-2">
                            <ToggleButton className="dashboard-btn" type="radio" variant="outline-success" checked={activeView === 'home'} onClick={() => handleChangeView('home')}>
                                Home
                            </ToggleButton>
                            <ToggleButton className="dashboard-btn" type="radio" variant="outline-success" checked={activeView === 'discover'} onClick={() => handleChangeView('discover')}>
                                Discover
                            </ToggleButton>
                        </ButtonGroup>
                        <Button className="dashboard-btn" variant="primary" onClick={() => setShowSidebar(true)}>
                            Sidebar
                        </Button>
                    </div>
                }
                <Sidebar
                    show={showSidebar}
                    hide={() => setShowSidebar(false)}
                    user={user}
                    logout={logout}
                />
            </div>
            {width < 576 &&
                <div className="d-flex justify-content-end">
                    <ButtonGroup className="mx-2">
                        <ToggleButton className="dashboard-btn" type="radio" variant="outline-success" checked={activeView === 'home'} onClick={() => handleChangeView('home')}>
                            Home
                        </ToggleButton>
                        <ToggleButton className="dashboard-btn" type="radio" variant="outline-success" checked={activeView === 'discover'} onClick={() => handleChangeView('discover')}>
                            Discover
                        </ToggleButton>
                    </ButtonGroup>
                    <Button className="dashboard-btn" variant="primary" onClick={() => setShowSidebar(true)}>
                        Sidebar
                    </Button>
                </div>
            }
            {location.pathname !== '/discover' &&
                <Search />
            }
            <Routes>
                <Route path="/home/*" element={<Main />} />
                <Route path="/discover/*" element={<Discover />} />
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
