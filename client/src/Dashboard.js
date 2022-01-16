import React from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from '@auth0/auth0-react';

function Dashboard() {

    const { logout } = useAuth0();

    return (
        <div>
            <p>Welcome to the Dashboard!</p>
            <Button variant="primary" onClick={() => logout()}>
                Logout
            </Button>
        </div>
    );
};

export default Dashboard;