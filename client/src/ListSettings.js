import React, { useContext } from 'react';
import './ListSettings.css';
import { UserContext } from './UserContext';
import Helper from "./Helper";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Requests from './Requests';

function ListSettings({ activeList, isListEmpty }) {

    const context = useContext(UserContext);
    const user = context.userData.user;
    
    const listsConfig = context.userData.config.lists;

    const handleUpdateFilter = (newFilter) => {
        let listName = Helper.getNormalizedListName(activeList);
        Requests.setFilter(user, listName, newFilter).then(res => {
            context.setUserData(res.data);
        }).catch(err => {
            console.log(err);
        });
    };

    const getActiveListFiltering = (activeList) => {
        return listsConfig[Helper.getNormalizedListName(activeList)].filtering;
    };

    return (
        <Container id="list-settings-container">
            <Navbar>
                {isListEmpty &&
                    <div id="empty-list-config">
                        <p>Use the search bar to add a movie</p>
                    </div>
                }
                
                {!isListEmpty &&
                    <Navbar.Collapse>
                        <Nav>
                            <NavDropdown id="filter-dropdown" title="Filter">
                                <NavDropdown.Item className="filter-option" onClick={() => handleUpdateFilter('last_added')}>
                                    {getActiveListFiltering(activeList) === 'last_added' ? <b>Last added</b> : 'Last added'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="filter-option" onClick={() => handleUpdateFilter('first_added')}>
                                    {getActiveListFiltering(activeList) === 'first_added' ? <b>First added</b> : 'First added'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="filter-option" onClick={() => handleUpdateFilter('title')}>
                                    {getActiveListFiltering(activeList) === 'title' ? <b>Title</b> : 'Title'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="filter-option" onClick={() => handleUpdateFilter('highest_score')}>
                                    {getActiveListFiltering(activeList) === 'highest_score' ? <b>Highest rated</b> : 'Highest rated'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="filter-option" onClick={() => handleUpdateFilter('lowest_score')}>
                                    {getActiveListFiltering(activeList) === 'lowest_score' ? <b>Lowest rated</b> : 'Lowest rated'}
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                }
            </Navbar>
        </Container>
    );
};

export default ListSettings;
