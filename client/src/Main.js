import React, { useState, useEffect, useContext } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import './Main.css';
import { UserContext } from './UserContext';
import Helper from "./Helper";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Pagination from 'react-bootstrap/Pagination';
import ListSettings from './ListSettings';
import List from './List';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import Movie from './Movie';
import TvShow from './TvShow';
import ListConfig from './ListConfig';

function Main() {

    const context = useContext(UserContext);
    const location = useLocation();

    const listData = context.userData.data;
    const [activeList, setActiveList] = useState("Favorites");

    const [activePage, setActivePage] = useState(1);
    const numOfItemsOnList = context.userData.data[Helper.getNormalizedListName(activeList)].length;

    const listConfig = context.userData.config.lists[Helper.getNormalizedListName(activeList)];

    useEffect(() => {
        if (location.pathname === '/home/watched') {
            setActiveList("Watched");
        } else if (location.pathname === '/home/watching') {
            setActiveList("Watching");
        } else if (location.pathname === '/home/watchlist') {
            setActiveList("Watch List");
        } else if (location.pathname === '/home/favorites') {
            setActiveList("Favorites");
        };
    }, [location.pathname]);

    useEffect(() => {
        setActivePage(1);
    }, [activeList])

    const isListEmpty = () => {
        return listData[Helper.getNormalizedListName(activeList)].length === 0 ? true : false;
    }

    const initData = (movies) => {
        if (movies.length === 0) return movies;
        let items = [];
        for (const movie of movies) {
            if (movie.data.media_type === 'movie') {
                items.push(new Movie(movie.data, movie.timestamp));
            }
            if (movie.data.media_type === 'tv') {
                items.push(new TvShow(movie.data, movie.timestamp));
            }
        }
        let filteredData = ListConfig.filterData(items, listConfig);
        let sortedData = ListConfig.sortData(filteredData, listConfig);
        let chunkedData = ListConfig.chunkData(sortedData, 4);
        return chunkedData;
    }

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="Favorites" activeKey={activeList} className="d-flex justify-content-between">
                        {window.innerWidth > 575 && window.innerWidth < 768 &&
                            <p id="list-stat">You have {numOfItemsOnList === 1 ? numOfItemsOnList + " item" : numOfItemsOnList + " items"} on {activeList}</p>
                        }
                        <div className="d-flex">
                            <Nav.Item>
                                <Nav.Link as={Link} to="favorites" eventKey="Favorites" onClick={() => setActiveList("Favorites")} className="nav-link d-flex">
                                    {window.innerWidth > 575 && <p>Favorites</p>}
                                    <MdFavorite className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="watchlist" eventKey="Watch List" onClick={() => setActiveList("Watch List")} className="nav-link d-flex">
                                    {window.innerWidth > 575 && <p>Watch List</p>}
                                    <RiFileListLine className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="watching" eventKey="Watching" onClick={() => setActiveList("Watching")} className="nav-link d-flex">
                                    {window.innerWidth > 575 && <p>Watching</p>}
                                    <IoMdEye className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="watched" eventKey="Watched" onClick={() => setActiveList("Watched")} className="nav-link d-flex">
                                    {window.innerWidth > 575 && <p>Watched</p>}
                                    <MdTaskAlt className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        {window.innerWidth > 767 &&
                            <p id="list-stat">You have {numOfItemsOnList === 1 ? numOfItemsOnList + " item" : numOfItemsOnList + " items"} on {activeList}</p>
                        }
                        {window.innerWidth < 576 &&
                            <p id="list-stat">{numOfItemsOnList === 1 ? numOfItemsOnList + " item" : numOfItemsOnList + " items"}</p>
                        }
                    </Nav>
                </Card.Header>
                <Card.Body id="content-body">
                    <ListSettings activeList={activeList} isListEmpty={isListEmpty()} />
                    <Routes>
                        <Route path="favorites" element={<List list="Favorites" listData={initData(listData.favorites)} />} />
                        <Route path="watchlist" element={<List list="Watch List" listData={initData(listData.watchList)} />} />
                        <Route path="watching" element={<List list="Watching" listData={initData(listData.watching)} />} />
                        <Route path="watched" element={<List list="Watched" listData={initData(listData.watched)} />} />
                    </Routes>
                </Card.Body>
                <Card.Footer id="pagination-container">
                    <Pagination className="d-flex justify-content-end mb-0">
                        {/* <Pagination.First />
                        <Pagination.Prev /> */}
                        {initData(listData[Helper.getNormalizedListName(activeList)]).length > 0 && initData(listData[Helper.getNormalizedListName(activeList)]).map((item, index) => (
                            <Pagination.Item key={index} active={activePage === index + 1} onClick={() => setActivePage(index + 1)}>{index + 1}</Pagination.Item>
                        ))}
                        {initData(listData[Helper.getNormalizedListName(activeList)]).length === 0 &&
                            <Pagination.Item disabled>1</Pagination.Item>
                        }
                        {/* <Pagination.Ellipsis />
                        <Pagination.Item active={activePage === 20}>{20}</Pagination.Item> */}
                        {/* <Pagination.Next />
                        <Pagination.Last /> */}
                    </Pagination>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Main;