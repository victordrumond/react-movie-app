import React, { useContext, useState } from 'react';
import './ListSettings.css';
import { UserContext } from './UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { Helper } from "./Helper";
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Requests } from './Requests';
import { BsFillGridFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';

function ListSettings({ activeList, isListEmpty, layout }) {

    const { user, getAccessTokenSilently } = useAuth0();
    const context = useContext(UserContext);

    const listsConfig = context.userData.config.lists;
    const [currentLayout, setCurrentLayout] = useState('grid');

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

    const handleUpdateFiltering = async (filter, value) => {
        let listName = Helper.getNormalizedListName(activeList);
        await getAccessTokenSilently().then(token => {
            Requests.setFiltering(token, user, listName, filter, value).then(res => {
                context.setUserData(res.data);
            }).catch(err => {
                console.log(err);
            })
        });
    };

    const handleUpdateLayout = (value) => {
        setCurrentLayout(value);
        layout(value);
    };

    const getActiveListSorting = (activeList) => {
        return listsConfig[Helper.getNormalizedListName(activeList)].sorting;
    };

    const getActiveListFiltering = (activeList) => {
        return listsConfig[Helper.getNormalizedListName(activeList)].filtering;
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
                    <Navbar.Collapse className="d-flex justify-content-between">
                        <div className="d-flex">
                            <Nav>
                                <NavDropdown id="filter-dropdown" title="Filter">
                                    <NavDropdown.Item className="filter-option" >
                                        <Form.Check key={Math.random()} type="checkbox" label='Movies' checked={getActiveListFiltering(activeList).movies} onChange={(e) => handleUpdateFiltering('movies', e.target.checked)} />
                                    </NavDropdown.Item>
                                    <NavDropdown.Item className="filter-option" >
                                        <Form.Check key={Math.random()} type="checkbox" label='TV Shows' checked={getActiveListFiltering(activeList).tvShows} onChange={(e) => handleUpdateFiltering('tvShows', e.target.checked)} />
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
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
                        </div>
                        <div>
                            {currentLayout === 'grid' &&
                                <BsFillGridFill className="list-layout-icon" onClick={() => handleUpdateLayout('list')}/>
                            }
                            {currentLayout === 'list' &&
                                <FaListUl className="list-layout-icon" onClick={() => handleUpdateLayout('grid')}/>
                            }
                        </div>
                    </Navbar.Collapse>
                }
            </Navbar>
        </Container>
    );
};

export default ListSettings;
