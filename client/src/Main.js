import React, { useState, useEffect, useContext } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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
import Movie from './Movie';
import TvShow from './TvShow';

function Main() {

    const context = useContext(UserContext);
    const location = useLocation();

    const listData = context.userData.data;
    const [activeList, setActiveList] = useState("Favorites");
    const [activeListLength, setActiveListLength] = useState(0);

    useEffect(() => {
        if (location.pathname === '/home/watched') {
            setActiveList("Watched");
        } else if (location.pathname === '/home/watchlist') {
            setActiveList("Watch List");
        } else if (location.pathname === '/home/favorites') {
            setActiveList("Favorites");
        };
    }, [location.pathname]);

    useEffect(() => {
        setActiveListLength(listData[Helper.getNormalizedListName(activeList)].length);
    }, [listData, activeList])

    const isListEmpty = () => {
        return listData[Helper.getNormalizedListName(activeList)].length === 0 ? true : false;
    }

    const initData = (movies) => {
        let result = [];
        for (const movie of movies) {
            if (movie.data.media_type === 'movie') {
                result.push(new Movie(movie.data));
            }
            if (movie.data.media_type === 'tv') {
                result.push(new TvShow(movie.data));
            }
        }
        return result;
    }

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="Favorites" activeKey={activeList} className="d-flex justify-content-between">
                        {window.innerWidth > 575 && window.innerWidth < 768 &&
                            <p id="list-stat">You have {activeListLength === 1 ? activeListLength + " movie" : activeListLength + " movies"} on {activeList}</p>
                        }
                        <div className="d-flex">
                            <Nav.Item>
                                <Nav.Link as={Link} to="favorites" eventKey="Favorites" onClick={() => setActiveList("Favorites")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Favorites</p>}
                                    <MdFavorite className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="watchlist" eventKey="Watch List" onClick={() => setActiveList("Watch List")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Watch List</p>}
                                    <IoMdEye className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="watched" eventKey="Watched" onClick={() => setActiveList("Watched")} className="d-flex">
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
                    <ListSettings activeList={activeList} isListEmpty={isListEmpty()} />
                    <Routes>
                        <Route path="favorites" element={<List list="Favorites" listData={initData(listData.favorites)} />} />
                        <Route path="watchlist" element={<List list="Watch List" listData={initData(listData.watchList)} />} />
                        <Route path="watched" element={<List list="Watched" listData={initData(listData.watched)} />} />
                    </Routes>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Main;