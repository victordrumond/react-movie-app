import React from 'react';
import './List.css';
import axios from 'axios';
import Helper from "./Helper";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

function ListSettings({ user, activeList, updateMain }) {

    const handleUpdateFilter = (newFilter) => {
        let listName = Helper.getNormalizedListName(activeList);
        axios
            .post('/updatefilter', { user: user.email, list: listName, value: newFilter })
            .then(res => {
                updateMain(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        ;
    };

    return (
        <Container id="list-settings-container">
            <Navbar expand="sm">
                <Container>
                    <Navbar.Collapse>
                        <Nav>
                            <NavDropdown id="filter-dropdown" title="Filter">
                                <NavDropdown.Item onClick={() => handleUpdateFilter('title')}>Title</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleUpdateFilter('highest_score')}>Highest rated</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleUpdateFilter('lowest_score')}>Lowest rated</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleUpdateFilter('last_added')}>Last added</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleUpdateFilter('first_added')}>First added</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    );
};

export default ListSettings;
