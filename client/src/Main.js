import React, { useState, useCallback, useEffect } from 'react';
import './Main.css';
import axios from 'axios';
import Helper from "./Helper";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import List from './List';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function Main({ user, userData, updateDashboard }) {

    const [activeList, setActiveList] = useState("Favorites");
    const [activeListLength, setActiveListLength] = useState(0);

    const [favoritesData, setFavoritesData] = useState([]);
    const [watchListData, setWatchListData] = useState([]);
    const [watchedData, setWatchedData] = useState([]);

    const [favoritesConfig, setFavoritesConfig] = useState(userData.config.lists.favorites);
    const [watchListConfig, setWatchListConfig] = useState(userData.config.lists.watchList);
    const [watchedConfig, setWatchedConfig] = useState(userData.config.lists.watched);

    useEffect(() => {
        setFavoritesData(userData.lists.favorites);
        setWatchListData(userData.lists.watchList);
        setWatchedData(userData.lists.watched);
        setFavoritesConfig(userData.config.lists.favorites);
        setWatchListConfig(userData.config.lists.watchList);
        setWatchedConfig(userData.config.lists.watched);
        getListLength(activeList);
    }, [userData, activeList])

    const updatedFromList = useCallback(updatedData => {
        updateDashboard(updatedData);
    }, []);

    const getListLength = (list) => {
        let listName = Helper.getNormalizedListName(list);
        setActiveListLength(userData.lists[listName].length);
    };

    const handleUpdateFilter = (newFilter) => {
        let listName = Helper.getNormalizedListName(activeList);
        axios
            .post('/updatefilter', { user: user.email, list: listName, value: newFilter })
            .then(res => {
                updateDashboard(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        ;
    };

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="Favorites" className="d-flex justify-content-between">
                        {window.innerWidth > 575 && window.innerWidth < 768 &&
                            <p id="list-stat">You have {activeListLength === 1 ? activeListLength + " movie" : activeListLength + " movies"} on {activeList}</p>
                        }
                        <div className="d-flex">
                            <Nav.Item>
                                <Nav.Link eventKey="Favorites" onClick={() => setActiveList("Favorites")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Favorites</p>}
                                    <MdFavorite className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Watch List" onClick={() => setActiveList("Watch List")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Watch List</p>}
                                    <IoMdEye className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Watched" onClick={() => setActiveList("Watched")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Watched</p>}
                                    <MdTaskAlt className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        {window.innerWidth > 767 &&
                            <p id="list-stat">You have {activeListLength === 1 ? activeListLength + " movie" : activeListLength + " movies"} on {activeList}</p>
                        }
                        {window.innerWidth < 576 &&
                            <p id="list-stat">{activeList} - {activeListLength === 1 ? activeListLength + " movie" : activeListLength + " movies"}</p>
                        }
                    </Nav>
                </Card.Header>
                <Card.Body id="content-body">


                    {/* TESTING FEATURE */}
                    <Navbar expand="lg">
                        <Container>
                            <Navbar.Toggle aria-controls="navbar-dark-example" />
                            <Navbar.Collapse id="navbar-dark-example">
                                <Nav>
                                    <NavDropdown
                                        id="nav-dropdown-dark-example"
                                        title="Filter"
                                    >
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
                    {/* TESTING FEATURE */}


                    {activeList === "Favorites" &&
                        <List
                            user={user}
                            list="Favorites"
                            listData={favoritesData}
                            listConfig={favoritesConfig}
                            updateMain={updatedFromList}
                        />}
                    {activeList === "Watch List" &&
                        <List
                            user={user}
                            list="Watch List"
                            listData={watchListData}
                            listConfig={watchListConfig}
                            updateMain={updatedFromList}
                        />}
                    {activeList === "Watched" &&
                        <List
                            user={user}
                            list="Watched"
                            listData={watchedData}
                            listConfig={watchedConfig}
                            updateMain={updatedFromList}
                        />}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Main;