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
import { ITEMS_PER_PAGE, MAX_VISIBLE_PAGES } from './Constants';

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

    useEffect(() => {
        if (activePage > getNumberOfPages()) {
            setActivePage(getNumberOfPages());
        }
        // eslint-disable-next-line
    }, [listData, activePage])

    const isListEmpty = () => {
        return listData[Helper.getNormalizedListName(activeList)].length === 0 ? true : false;
    }

    const getSelectedPageData = (list) => {
        let data = initData(listData[list]);
        if (data.length >= activePage) {
            return data[activePage - 1];
        }
        return data[0];
    }

    const getNumberOfPages = () => {
        return initData(listData[Helper.getNormalizedListName(activeList)]).length;
    }

    const getPaginationIndex = (pageIndex) => {
        if (getNumberOfPages() > MAX_VISIBLE_PAGES && activePage === getNumberOfPages()) {
            return pageIndex + activePage - MAX_VISIBLE_PAGES;
        }
        if (getNumberOfPages() > MAX_VISIBLE_PAGES && activePage >= MAX_VISIBLE_PAGES) {
            return pageIndex + activePage - MAX_VISIBLE_PAGES + 1;
        }
        return pageIndex;
    }

    const initData = (movies) => {
        if (movies.length === 0) return [[]];
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
        let chunkedData = ListConfig.chunkData(sortedData, ITEMS_PER_PAGE);
        return chunkedData;
    }

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="Favorites" activeKey={activeList} className="d-flex justify-content-between">
                        {window.innerWidth > 575 && window.innerWidth < 768 &&
                            <p id="list-stat">Showing {getSelectedPageData(Helper.getNormalizedListName(activeList)).length} of {numOfItemsOnList} {numOfItemsOnList === 1 ? "item" : "items"}</p>
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
                            <p id="list-stat">Showing {getSelectedPageData(Helper.getNormalizedListName(activeList)).length} of {numOfItemsOnList} {numOfItemsOnList === 1 ? "item" : "items"} </p>
                        }
                        {window.innerWidth < 576 &&
                            <p id="list-stat">{getSelectedPageData(Helper.getNormalizedListName(activeList)).length} of {numOfItemsOnList} {numOfItemsOnList === 1 ? "item" : "items"}</p>
                        }
                    </Nav>
                </Card.Header>
                <Card.Body id="content-body">
                    <ListSettings activeList={activeList} isListEmpty={isListEmpty()} />
                    <Routes>
                        <Route path="favorites" element={<List list="Favorites" listData={getSelectedPageData('favorites')} />} />
                        <Route path="watchlist" element={<List list="Watch List" listData={getSelectedPageData('watchList')} />} />
                        <Route path="watching" element={<List list="Watching" listData={getSelectedPageData('watching')} />} />
                        <Route path="watched" element={<List list="Watched" listData={getSelectedPageData('watched')} />} />
                    </Routes>
                </Card.Body>
                <Card.Footer id="pagination-container">
                    <Pagination className="d-flex justify-content-end mb-0">
                        {getNumberOfPages() > 1 &&
                            <Pagination.First onClick={() => setActivePage(1)} />
                        }
                        {getNumberOfPages() > 1 &&
                            <Pagination.Prev onClick={() => {
                                if (activePage > 1) {
                                    setActivePage(activePage - 1);
                                }
                            }} />
                        }
                        {activePage >= MAX_VISIBLE_PAGES && getNumberOfPages() > MAX_VISIBLE_PAGES &&
                            <Pagination.Ellipsis />
                        }
                        {!isListEmpty() && initData(listData[Helper.getNormalizedListName(activeList)]).slice(0, MAX_VISIBLE_PAGES).map((item, index) => (
                            <Pagination.Item key={index} active={activePage === getPaginationIndex(index + 1)} onClick={() => setActivePage(getPaginationIndex(index + 1))}>{getPaginationIndex(index + 1)}</Pagination.Item>
                        ))}
                        {isListEmpty() &&
                            <Pagination.Item disabled>1</Pagination.Item>
                        }
                        {getNumberOfPages() > MAX_VISIBLE_PAGES && activePage < getNumberOfPages() - 1 &&
                            <Pagination.Ellipsis />
                        }
                        {getNumberOfPages() > 1 &&
                            <Pagination.Next onClick={() => {
                                if (activePage < getNumberOfPages()) {
                                    setActivePage(activePage + 1);
                                }
                            }} />
                        }
                        {getNumberOfPages() > 1 &&
                            <Pagination.Last onClick={() => setActivePage(getNumberOfPages())} />
                        }
                    </Pagination>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Main;