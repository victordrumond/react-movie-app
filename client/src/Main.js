import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './Main.css';
import { UserContext } from './UserContext';
import Helper from "./Helper";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import ListSettings from './ListSettings';
import List from './List';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function Main() {

    const context = useContext(UserContext);
    const location = useLocation();

    const [favoritesData, setFavoritesData] = useState([]);
    const [watchListData, setWatchListData] = useState([]);
    const [watchedData, setWatchedData] = useState([]);

    const [activeList, setActiveList] = useState("Favorites");
    const [activeListLength, setActiveListLength] = useState(0);

    useEffect(() => {
        setFavoritesData(context.userData.lists.favorites);
        setWatchListData(context.userData.lists.watchList);
        setWatchedData(context.userData.lists.watched);
        if (location.pathname === '/home/watched') {
            setActiveList("Watched");
        } else if (location.pathname === '/home/watchlist') {
            setActiveList("Watch List");
        };
    }, [context, location.pathname]);

    useEffect(() => {
        setActiveListLength(context.userData.lists[Helper.getNormalizedListName(activeList)].length);
    }, [context, activeList])

    const isListEmpty = () => {
        if (activeList === 'Favorites' && favoritesData.length === 0) return true;
        if (activeList === 'Watch List' && watchListData.length === 0) return true;
        if (activeList === 'Watched' && watchedData.length === 0) return true;
        return false;
    }

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="/home/favorites" activeKey={location.pathname} className="d-flex justify-content-between">
                        {window.innerWidth > 575 && window.innerWidth < 768 &&
                            <p id="list-stat">You have {activeListLength === 1 ? activeListLength + " movie" : activeListLength + " movies"} on {activeList}</p>
                        }
                        <div className="d-flex">
                            <Nav.Item>
                                <Nav.Link eventKey="/home/favorites" onClick={() => setActiveList("Favorites")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Favorites</p>}
                                    <MdFavorite className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="/home/watchlist" onClick={() => setActiveList("Watch List")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Watch List</p>}
                                    <IoMdEye className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="/home/watched" onClick={() => setActiveList("Watched")} className="d-flex">
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

                    <ListSettings
                        activeList={activeList}
                        isListEmpty={isListEmpty()}
                    />

                    {activeList === "Favorites" &&
                        <List list="Favorites" listData={favoritesData} />}
                    {activeList === "Watch List" &&
                        <List list="Watch List" listData={watchListData} />}
                    {activeList === "Watched" &&
                        <List list="Watched" listData={watchedData} />}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Main;