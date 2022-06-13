import React, { useContext } from 'react';
import './ListSettings.css';
import { UserContext } from './UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import Helper from "./Helper";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Requests from './Requests';

function ListSettings({ activeList, isListEmpty }) {

    const context = useContext(UserContext);
    const { user, getAccessTokenSilently } = useAuth0();
    
    const listsConfig = context.userData.config.lists;

    const handleUpdateSorting = async (newSort) => {
        let listName = Helper.getNormalizedListName(activeList);
        await getAccessTokenSilently().then(token => {
            Requests.setSorting(token, user, listName, newSort).then(res => {
                context.setUserData(res.data);
            }).catch(err => {
                console.log(err);
            })
        });
    };

    const getActiveListSorting = (activeList) => {
        return listsConfig[Helper.getNormalizedListName(activeList)].sorting;
    };

    return (
        <Container id="list-settings-container">
            <Navbar>
                {isListEmpty &&
                    <div id="empty-list-config">
                        <p>Use the search bar to find a movie or TV show</p>
                    </div>
                }
                
                {!isListEmpty &&
                    <Navbar.Collapse>
                        <Nav>
                            <NavDropdown id="sort-dropdown" title="Sort">
                                <NavDropdown.Item className="sort-option" onClick={() => handleUpdateSorting('last_added')}>
                                    {getActiveListSorting(activeList) === 'last_added' ? <b>Last added</b> : 'Last added'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="sort-option" onClick={() => handleUpdateSorting('first_added')}>
                                    {getActiveListSorting(activeList) === 'first_added' ? <b>First added</b> : 'First added'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="sort-option" onClick={() => handleUpdateSorting('title')}>
                                    {getActiveListSorting(activeList) === 'title' ? <b>Title</b> : 'Title'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="sort-option" onClick={() => handleUpdateSorting('highest_score')}>
                                    {getActiveListSorting(activeList) === 'highest_score' ? <b>Highest rated</b> : 'Highest rated'}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="sort-option" onClick={() => handleUpdateSorting('lowest_score')}>
                                    {getActiveListSorting(activeList) === 'lowest_score' ? <b>Lowest rated</b> : 'Lowest rated'}
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
