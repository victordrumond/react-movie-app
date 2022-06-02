import React from 'react';
import './Sidebar.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

function Sidebar({ show, hide, userData, logout }) {


    return (
        <Offcanvas show={show} onHide={hide} placement="end">
            <Offcanvas.Header id="sidebar-header" closeButton>
                <Offcanvas.Title id="sidebar-title">
                    Welcome back, <b>{userData.user.email}</b>!
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
                <Button id="logout" variant="outline-primary" onClick={() => logout()}>
                    Logout
                </Button>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
