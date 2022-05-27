import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Dashboard from './Dashboard';
import Authentication from './Authentication';
import { useAuth0 } from '@auth0/auth0-react';

function App() {

  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div id="loading-msg">Loading...</div>
  } else {
    return (
      <Container id="app-container">
        {isAuthenticated ? <Dashboard /> : <Authentication />}
      </Container>
    );
  };
};

export default App;