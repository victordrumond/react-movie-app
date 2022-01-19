import React, { useState, useCallback } from 'react';
import './Dashboard.css';
import Search from './Search';
import Main from './Main';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from '@auth0/auth0-react';

function Dashboard() {

    const { user, logout } = useAuth0();
    const [addMovie, setAddMovie] = useState(0);

    const getDataFromSearch = useCallback(value => {
        setAddMovie(value);
    }, []);

    return (
        <Container id="dashboard-container">
            <div id="header-container" className="d-flex justify-content-between">
                <h2>React Movie App</h2>
                <div id="logout-wrapper" className="d-flex flex-column">
                    <p>Welcome back, <b>{user.email}</b> :-)</p>
                    <Button id="logout" variant="primary" onClick={() => logout()}>
                        Logout
                    </Button>
                </div>
            </div>
            <Search user={user} passDataToDashboard={getDataFromSearch} />
            <Main user={user} addMovie={addMovie} />
            <div id="footer-container" className="d-flex align-items-center justify-content-center">
                <p>&#169; 2022 React Movie App | A project by Victor</p>
            </div>
        </Container>
    );
};

export default Dashboard;