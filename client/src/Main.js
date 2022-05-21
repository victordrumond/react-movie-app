import React, { useState, useCallback, useEffect } from 'react';
import './Main.css';
import Helper from "./Helper";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import List from './List';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function Main({ user, userData, updateDashboard }) {

    const [activeList, setActiveList] = useState("Favorites");
    const [activeListLength, setActiveListLength] = useState(0);

    const [favoritesData, setFavoritesData] = useState([]);
    const [watchListData, setWatchListData] = useState([]);
    const [watchedData, setWatchedData] = useState([]);

    useEffect(() => {
        setFavoritesData(userData.lists.favorites);
        setWatchListData(userData.lists.watchList);
        setWatchedData(userData.lists.watched);
        getListLength(activeList);
    }, [userData, activeList])

    const updatedFromList = useCallback(updatedData => {
        updateDashboard(updatedData);
    }, []);

    const getListLength = (list) => {
        let listName = Helper.getNormalizedListName(list);
        setActiveListLength(userData.lists[listName].length);
    }

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
                    {activeList === "Favorites" &&
                        <List
                            user={user}
                            list="Favorites"
                            listData={favoritesData}
                            updateMain={updatedFromList}
                        />}
                    {activeList === "Watch List" &&
                        <List
                            user={user}
                            list="Watch List"
                            listData={watchListData}
                            updateMain={updatedFromList}
                        />}
                    {activeList === "Watched" &&
                        <List
                            user={user}
                            list="Watched"
                            listData={watchedData}
                            updateMain={updatedFromList}
                        />}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Main;