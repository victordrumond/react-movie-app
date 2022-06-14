import React, { useState, useContext } from 'react';
import './List.css';
import { UserContext } from './UserContext';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Helper from "./Helper";
import LocalStorage from "./LocalStorage";
import { useAuth0 } from '@auth0/auth0-react';
import ListConfig from "./ListConfig";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import Requests from './Requests';
import ExampleMovieCard from './ExampleMovieCard';
import ExpandedMovieInfo from './ExpandedMovieInfo';
import ExpandedTvShowInfo from './ExpandedTvShowInfo';
import Rating from '@mui/material/Rating';

function List({ list, listData }) {

    const context = useContext(UserContext);
    const { user, getAccessTokenSilently } = useAuth0();

    const userRatings = context.userData.data.ratings;
    const listConfig = context.userData.config.lists[Helper.getNormalizedListName(list)];

    const [activeCard, setActiveCard] = useState(null);

    const [infoData, setInfoData] = useState(null);
    const [showExpandedInfo, setShowExpandedInfo] = useState(false);

    const [deleteMovie, setDeleteMovie] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [addMovieToList, setAddMovieToList] = useState(false);
    const [addData, setAddData] = useState(null);

    const getMovieExpandedData = async (item) => {
        if (LocalStorage.hasExpandedMovie(item.id)) {
            let movieObj = LocalStorage.getExpandedMovie(item.id);
            if (movieObj) {
                item.media_type === 'movie' ? setInfoData([movieObj, 'movie']) : setInfoData([movieObj, 'tv']);
                setShowExpandedInfo(true);
            }
        } else {
            await getAccessTokenSilently().then(token => {
                Requests.getMovieData(token, item).then(res => {
                    LocalStorage.setExpandedMovie(res.data);
                    item.media_type === 'movie' ? setInfoData([res.data, 'movie']) : setInfoData([res.data, 'tv']);
                    setShowExpandedInfo(true);
                })
            })
        };
    };

    const handleAdd = async (item, list) => {
        if (await isMovieOnList(item, list)) {
            setAddData([item.title, list, false]);
            setAddMovieToList(true);
            return;
        }
        let newList = Helper.getNormalizedListName(list);
        await getAccessTokenSilently().then(token => {
            Requests.addMovie(token, user, newList, item).then(res => {
                context.setUserData(res.data);
                setAddData([item.title || item.name, list, true]);
                setAddMovieToList(true);
            }).catch(err => {
                console.log(err);
            })
        });
    };

    const handleDelete = async (item) => {
        let currentList = Helper.getNormalizedListName(list);
        await getAccessTokenSilently().then(token => {
            Requests.deleteMovie(token, user, currentList, item).then(res => {
                context.setUserData(res.data);
                setDeleteMovie(false);
                setDeleteData(null);
            }).catch(err => {
                console.log(err);
            })
        });
    };

    const handleRate = async (movie, value) => {
        await getAccessTokenSilently().then(token => {
            Requests.updateMovieRating(token, user, movie, value).then(res => {
                context.setUserData(res.data);
            }).catch(err => {
                console.log(err);
            })
        });
    }

    const isMovieOnList = async (item, list) => {
        let listMovies = context.userData.data[Helper.getNormalizedListName(list)];
        for (const movie of listMovies) {
            if (movie.data.id === item.id) {
                return true;
            }
        }
        return false;
    }

    const prepareListData = (listData) => {
        let filteredData = ListConfig.filterData(listData, listConfig);
        return ListConfig.sortData(filteredData, listConfig);
    }

    return (
        <Container id="list-container">

            {listData.length === 0 && <ExampleMovieCard list={list} />}

            {listData.length > 0 && prepareListData(listData).map((item, index) => (
                <Card id="movie-card" key={index} onMouseEnter={() => setActiveCard(index)} onMouseLeave={() => setActiveCard(null)}>
                    {window.innerWidth > 991 &&
                        <div>
                            {activeCard === index
                                ? <CloseButton
                                    id="close-card"
                                    onClick={() => {
                                        setDeleteData(item.item);
                                        setDeleteMovie(true);
                                    }}
                                />
                                : null}
                        </div>
                    }
                    {window.innerWidth < 992 &&
                        <div>
                            <CloseButton
                                id="close-card"
                                onClick={() => {
                                    setDeleteData(item.item);
                                    setDeleteMovie(true);
                                }}
                            />
                        </div>
                    }
                    {window.innerWidth < 400
                        ? <Card.Img variant="top" className="card-img img-fluid"
                            src={item.getPosterPath() || coverNotFound}
                        />
                        : <Card.Img variant="top" className="card-img img-fluid"
                            src={item.getBackdropPath() || backdropNotFound}
                        />
                    }
                    <Card.Body id="movie-card-body">
                        {window.innerWidth > 400 &&
                            <div>
                                <Rating
                                    id="user-rating"
                                    value={Helper.getMovieRating(item.getId(), userRatings)}
                                    onChange={(e, newValue) => {handleRate(item.item, newValue)}}
                                />
                                <Card.Title id="movie-title" title={item.getOriginalTitle()}>{item.getTitle()}</Card.Title>
                            </div>
                        }
                        {window.innerWidth > 575 &&
                            <div className="d-flex justify-content-between align-items-center">
                                <Card.Text id="movie-date">{item.getReleaseYear()}</Card.Text>
                                <Badge id="search-score" bg={Helper.getScoreBarColor(item.getAverageRating())}>
                                    {item.getAverageRating() === 'Not Rated' ? 'NR' : item.getAverageRating()}
                                </Badge>
                            </div>
                        }
                        {window.innerWidth > 575 &&
                            <Card.Text id="movie-description">{item.getOverview()}</Card.Text>
                        }
                        {window.innerWidth > 991 &&
                            <div>
                                {activeCard === index
                                    ? <div id="footer-icons">
                                        {list !== "Favorites" &&
                                            <MdFavorite title="Add to Favorites"
                                                onClick={() => handleAdd(item.item, "Favorites")}
                                                className="footer-icon fav-icon"
                                            />}
                                        {list !== "Watch List" &&
                                            <RiFileListLine title="Add to Watch List"
                                                onClick={() => handleAdd(item.item, "Watch List")}
                                                className="footer-icon watch-icon"
                                            />}
                                        {list !== "Watching" &&
                                            <IoMdEye title="Add to Watching"
                                                onClick={() => handleAdd(item.item, "Watching")}
                                                className="footer-icon watching-icon"
                                            />}
                                        {list !== "Watched" &&
                                            <MdTaskAlt title="Add to Watched"
                                                onClick={() => handleAdd(item.item, "Watched")}
                                                className="footer-icon watched-icon"
                                            />}
                                    </div>
                                    : null}
                                <Button id="card-button" variant="primary" onClick={() => getMovieExpandedData(item.item)}>Info</Button>
                            </div>
                        }
                        {window.innerWidth < 992 &&
                            <div>
                                <div id="footer-icons">
                                    {list !== "Favorites" &&
                                        <MdFavorite title="Add to Favorites"
                                            onClick={() => handleAdd(item.item, "Favorites")}
                                            className="footer-icon fav-icon"
                                        />}
                                    {list !== "Watch List" &&
                                        <RiFileListLine title="Add to Watch List"
                                            onClick={() => handleAdd(item.item, "Watch List")}
                                            className="footer-icon watch-icon"
                                        />}
                                    {list !== "Watching" &&
                                        <IoMdEye title="Add to Watching"
                                            onClick={() => handleAdd(item.item, "Watching")}
                                            className="footer-icon watching-icon"
                                        />}
                                    {list !== "Watched" &&
                                        <MdTaskAlt title="Add to Watched"
                                            onClick={() => handleAdd(item.item, "Watched")}
                                            className="footer-icon watched-icon"
                                        />}
                                </div>
                                <Button id="card-button" variant="primary" onClick={() => getMovieExpandedData(item.item)}>Info</Button>
                            </div>
                        }
                    </Card.Body>
                </Card>
            ))}

            {addMovieToList && (
                <Modal id="icons-modal" show={addMovieToList} onHide={() => setAddMovieToList(false)} animation={true} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {addData[2] ? 'Added To List' : 'Already On List'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {addData[0]} {addData[2] ? 'was added to' : 'is already on'} {addData[1]}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setAddMovieToList(false)}>
                            Continue
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {deleteMovie && (
                <Modal id="delete-modal" show={deleteMovie} onHide={() => setDeleteMovie(false)} animation={true} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete From List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete {deleteData.title || deleteData.name} from {list}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDelete(deleteData)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showExpandedInfo && infoData[1] === 'movie' && <ExpandedMovieInfo movieObj={infoData[0]} />}
            {showExpandedInfo && infoData[1] === 'tv' && <ExpandedTvShowInfo tvShowObj={infoData[0]} />}

        </Container>
    );
};

export default List;
