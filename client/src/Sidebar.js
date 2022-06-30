import React, { useState } from 'react';
import './Sidebar.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image'
import Activities from './Activities';
import Settings from './Settings';

function Sidebar({ show, hide, user, logout }) {

    const [activeTab, setActiveTab] = useState("Activities");

    return (
        <Offcanvas show={show} onHide={hide} placement="end">
            <Offcanvas.Header id="sidebar-header" closeButton>
                <Offcanvas.Title id="sidebar-title" className="d-flex">
                    <Image src={user.picture} className="img-fluid" alt="profile-pic" roundedCircle/>
                    <p>Welcome back, <b>{user.nickname || user.name}</b>!</p>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body id="sidebar-body" className="d-flex flex-column">
                <Button id="logout" variant="outline-dark" onClick={() => logout()} size="sm">
                    Logout
                </Button>
                <ListGroup id="sidebar-menu" horizontal>
                    <ListGroup.Item className="sidebar-tab" action active={activeTab === 'Activities' ? true : false} onClick={() => setActiveTab('Activities')}>
                        Activities
                    </ListGroup.Item>
                    <ListGroup.Item className="sidebar-tab" action active={activeTab === 'Settings' ? true : false} onClick={() => setActiveTab('Settings')}>
                        Settings
                    </ListGroup.Item>
                </ListGroup>
                {activeTab === 'Activities' && <Activities />}
                {activeTab === 'Settings' && <Settings />}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
