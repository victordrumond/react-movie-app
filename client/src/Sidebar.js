import React, { useState } from 'react';
import './Sidebar.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Settings from './Settings';

function Sidebar({ show, hide, user, logout }) {

    const [activeTab, setActiveTab] = useState("Activities");

    return (
        <Offcanvas show={show} onHide={hide} placement="end">
            <Offcanvas.Header id="sidebar-header" closeButton>
                <Offcanvas.Title id="sidebar-title">
                    Welcome back, <b>{user.name || user.nickname}</b>!
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column">
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
                {activeTab === 'Activities' &&
                    <p>Ready to work!</p>
                }
                {activeTab === 'Settings' &&
                    <Settings user={user}/>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
