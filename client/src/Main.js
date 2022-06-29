import React, { useState, useEffect, useContext } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import './Main.css';
import { UserContext } from './UserContext';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Pagination from 'react-bootstrap/Pagination';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import ListSettings from './ListSettings';
import List from './List';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { AiFillStar } from 'react-icons/ai';
import { CgTrash } from 'react-icons/cg';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import { Movie } from './Movie';
import { TvShow } from './TvShow';
import { Activity } from './Activity';
import { ListConfig } from './ListConfig';
import { Constants } from './Constants';
import useWindowSize from './useWindowSize';
import { Helper } from './Helper';

function Main() {

    const context = useContext(UserContext);
    const location = useLocation();
    const width = useWindowSize().width;

    const listData = context.userData.data;
    const [activeList, setActiveList] = useState("favorites");

    const [activePage, setActivePage] = useState(1);
    const numOfItemsOnList = context.userData.data[activeList].length;

    const listConfig = context.userData.config.lists[activeList];
    const [layout, setLayout] = useState("grid");

    const [newActivities, setNewActivities] = useState([]);
    const [showActivities, setShowActivities] = useState(0);

    const [findItem, setFindItem] = useState('');

    useEffect(() => {
        if (location.pathname === '/home/watched') {
            setActiveList("watched");
        } else if (location.pathname === '/home/watching') {
            setActiveList("watching");
        } else if (location.pathname === '/home/watchlist') {
            setActiveList("watchList");
        } else if (location.pathname === '/home/favorites') {
            setActiveList("favorites");
        };
    }, [location.pathname]);

    useEffect(() => {
        let activities = [];
        for (const activity of context.userData.activities) {
            let item = new Activity(activity.label, activity.data, activity.timestamp);
            if (Date.now() - item.timestamp < 5000) {
                activities.push(item);
            }
        }
        setNewActivities(activities);
        setShowActivities(showActivities + 1);
        // eslint-disable-next-line
    }, [context.userData.activities]);

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
        return listData[activeList].length === 0;
    }

    const getSelectedPageData = (list) => {
        let data = initData(listData[list]);
        if (data.length >= activePage) {
            return data[activePage - 1];
        }
        return data[0];
    }

    const getNumberOfPages = () => {
        return initData(listData[activeList]).length;
    }

    const getPaginationIndex = (pageIndex) => {
        const MAX_VISIBLE_PAGES = Constants.MAX_VISIBLE_PAGES;
        if (getNumberOfPages() > MAX_VISIBLE_PAGES && activePage === getNumberOfPages()) {
            return pageIndex + activePage - MAX_VISIBLE_PAGES;
        }
        if (getNumberOfPages() > MAX_VISIBLE_PAGES && activePage >= MAX_VISIBLE_PAGES) {
            return pageIndex + activePage - MAX_VISIBLE_PAGES + 1;
        }
        return pageIndex;
    }

    const getItemsPerPage = () => {
        if (layout === 'list') return 10;
        if (width > 1199) return 10;
        if (width > 991) return 12;
        if (width > 767) return 12;
        return 10;
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
        let searchedData = ListConfig.searchForItem(items, findItem);
        let filteredData = ListConfig.filterData(searchedData, listConfig);
        let sortedData = ListConfig.sortData(filteredData, listConfig);
        let chunkedData = ListConfig.chunkData(sortedData, getItemsPerPage());
        return chunkedData;
    }

    const handleCloseToast = (activity) => {
        let current = newActivities;
        const findActivity = current.findIndex(item => item.timestamp === activity.timestamp);
        if (findActivity < 0) {
            return;
        }
        current.splice(findActivity, 1);
        setNewActivities(current);
        setShowActivities(showActivities + 1);
    }

    const getNavIconComponent = (navName) => {
        if (navName === 'favorites') return <MdFavorite className="tabs-icon" />;
        if (navName === 'watchList') return <RiFileListLine className="tabs-icon" />;
        if (navName === 'watching') return <IoMdEye className="tabs-icon" />;
        if (navName === 'watched') return <MdTaskAlt className="tabs-icon" />;
    }

    return (
        <Container id="main-container">

            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="favorites" activeKey={activeList} className="d-flex justify-content-between">
                        {width > 575 && width < 768 &&
                            <p id="list-stat">Showing {getSelectedPageData(activeList).length} of {numOfItemsOnList} {numOfItemsOnList === 1 ? "item" : "items"}</p>
                        }
                        <div className="d-flex">
                            {['favorites', 'watchList', 'watching', 'watched'].map((navName, index) => (
                                <Nav.Item key={index}>
                                    <Nav.Link as={Link} to={navName.toLowerCase()} eventKey={navName} onClick={() => setActiveList(navName)} className="nav-link d-flex">
                                        {width > 575 && <p>{Helper.getListName(navName)}</p>}
                                        {getNavIconComponent(navName)}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </div>
                        {width > 767 &&
                            <p id="list-stat">Showing {getSelectedPageData(activeList).length} of {numOfItemsOnList} {numOfItemsOnList === 1 ? "item" : "items"} </p>
                        }
                        {width < 576 &&
                            <p id="list-stat">{getSelectedPageData(activeList).length} of {numOfItemsOnList} {numOfItemsOnList === 1 ? "item" : "items"}</p>
                        }
                    </Nav>
                </Card.Header>
                <Card.Body id="content-body">
                    <ListSettings
                        activeList={activeList}
                        isListEmpty={isListEmpty()}
                        layout={(value) => setLayout(value)}
                        findItem={findItem}
                        setFindItem={(value) => setFindItem(value)}
                    />
                    <Routes>
                        <Route path="favorites" element={<List list="favorites" listData={getSelectedPageData('favorites')} layout={layout} />} />
                        <Route path="watchlist" element={<List list="watchList" listData={getSelectedPageData('watchList')} layout={layout} />} />
                        <Route path="watching" element={<List list="watching" listData={getSelectedPageData('watching')} layout={layout} />} />
                        <Route path="watched" element={<List list="watched" listData={getSelectedPageData('watched')} layout={layout} />} />
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
                        {activePage >= Constants.MAX_VISIBLE_PAGES && getNumberOfPages() > Constants.MAX_VISIBLE_PAGES &&
                            <Pagination.Ellipsis />
                        }
                        {!isListEmpty() && initData(listData[activeList]).slice(0, Constants.MAX_VISIBLE_PAGES).map((item, index) => (
                            <Pagination.Item key={index} active={activePage === getPaginationIndex(index + 1)} onClick={() => setActivePage(getPaginationIndex(index + 1))}>{getPaginationIndex(index + 1)}</Pagination.Item>
                        ))}
                        {isListEmpty() &&
                            <Pagination.Item disabled>1</Pagination.Item>
                        }
                        {getNumberOfPages() > Constants.MAX_VISIBLE_PAGES && activePage < getNumberOfPages() - 1 &&
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

            {showActivities > 0 &&
                <ToastContainer className="position-fixed p-3" position="bottom-end">
                    {newActivities.map((activity, index) => (
                        <Toast key={activity.timestamp} show={true} onClose={() => handleCloseToast(activity)} delay={5000} autohide>
                            <Toast.Header>
                                {activity.getLabel() === 'movie_deleted' &&
                                    <CgTrash className='toast-icon trash' />}
                                {activity.getLabel() === 'movie_added' && activity.getList() === 'favorites' &&
                                    <MdFavorite className='toast-icon favorites' />}
                                {activity.getLabel() === 'movie_added' && activity.getList() === 'watchList' &&
                                    <RiFileListLine className='toast-icon watchList' />}
                                {activity.getLabel() === 'movie_added' && activity.getList() === 'watching' &&
                                    <IoMdEye className='toast-icon watching' />}
                                {activity.getLabel() === 'movie_added' && activity.getList() === 'watched' &&
                                    <MdTaskAlt className='toast-icon watched' />}
                                {activity.hasRating() &&
                                    <AiFillStar className='toast-icon rating' />}
                                <strong className="me-auto">New activity</strong>
                                <small>{activity.getTimeString()}</small>
                            </Toast.Header>
                            <Toast.Body>{activity.getDescription()}</Toast.Body>
                        </Toast>
                    ))}
                </ToastContainer>
            }

        </Container>
    );
};

export default Main;
