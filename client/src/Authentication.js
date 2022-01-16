import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

function Authentication() {

    const { loginWithRedirect } = useAuth0();

    return (
        <div>
            <p>Welcome to the Authentication!</p>
            <Button variant="success" onClick={() => loginWithRedirect()}>
                Get Started
            </Button>
        </div>
    );
};

export default Authentication;