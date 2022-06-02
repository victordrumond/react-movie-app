import React, { useState, useContext } from 'react';
import './List.css';
import { UserContext } from './UserContext';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Helper from "./Helper";
import LocalStorage from "./LocalStorage";
import ListConfig from "./ListConfig";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import Requests from './Requests';
import ExampleMovieCard from './ExampleMovieCard';
import ExpandedMovieInfo from './ExpandedMovieInfo';
import Rating from '@mui/material/Rating';

function List({ list, listData }) {

    const context = useContext(UserContext);
    const user = context.userData.user;
    const userRatings = context.userData.data.ratings;
    const listConfig = context.userData.config.lists[Helper.getNormalizedListName(list)];

    const [activeCard, setActiveCard] = useState(null);

    const [infoData, setInfoData] = useState(null);
    const [showExpandedInfo, setShowExpandedInfo] = useState(false);

    const [deleteMovie, setDeleteMovie] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [addMovieToList, setAddMovieToList] = useState(false);
    const [addData, setAddData] = useState(null);

    const getMovieExpandedData = (movieId) => {
        if (LocalStorage.hasExpandedMovie(movieId)) {
            let movieObj = LocalStorage.getExpandedMovie(movieId);
            if (movieObj) {
                setInfoData(movieObj);
                setShowExpandedInfo(true);
            }
        } else {
            Requests.getMovieData(movieId).then(res => {
                LocalStorage.setExpandedMovie(res.data);
                setInfoData(res.data);
                setShowExpandedInfo(true);
            });
        }
    };

    const handleAdd = (item, list) => {
        if (isMovieOnList(item, list)) {
            setAddData([item.title, list, false]);
            setAddMovieToList(true);
            return;
        }
        let newList = Helper.getNormalizedListName(list);
        Requests.addMovie(user.email, newList, item).then(res => {
            context.setUserData(res.data);
            setAddData([item.title, list, true]);
            setAddMovieToList(true);
        }).catch(err => {
            console.log(err);
        });
    };

    const handleDelete = (item) => {
        let currentList = Helper.getNormalizedListName(list);
        Requests.deleteMovie(user.email, currentList, item).then(res => {
            context.setUserData(res.data);
            setDeleteMovie(false);
            setDeleteData(null);
        }).catch(err => {
            console.log(err);
        });
    };

    const handleRate = (item, value) => {
        Requests.updateMovieRating(user.email, item, value).then(res => {
            context.setUserData(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const isMovieOnList = (item, list) => {
        let listMovies = context.userData.data[Helper.getNormalizedListName(list)];
        for (const movie of listMovies) {
            if (movie.data.id === item.id) {
                return true;
            }
        }
        return false;
    }

    return (
        <Container id="list-container">

            {listData.length === 0 && <ExampleMovieCard list={list} />}

            {listData.length !== 0 && ListConfig.sortData(listData, listConfig).map((item, index) => (
                <Card id="movie-card" key={index} onMouseEnter={() => setActiveCard(index)} onMouseLeave={() => setActiveCard(null)}>
                    {window.innerWidth > 991 &&
                        <div>
                            {activeCard === index
                                ? <CloseButton
                                    id="close-card"
                                    onClick={() => {
                                        setDeleteData(item.data);
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
                                    setDeleteData(item.data);
                                    setDeleteMovie(true);
                                }}
                            />
                        </div>
                    }
                    {window.innerWidth < 400
                        ? <Card.Img variant="top" className="card-img img-fluid"
                            src={item.data.poster_path ? "https://image.tmdb.org/t/p/w500" + item.data.poster_path : coverNotFound}
                        />
                        : <Card.Img
                            variant="top" className="card-img img-fluid"
                            src={item.data.backdrop_path ? "https://image.tmdb.org/t/p/w500" + item.data.backdrop_path : backdropNotFound}
                        />
                    }
                    <Card.Body id="movie-card-body">
                        {window.innerWidth > 400 &&
                            <div>
                                <Rating
                                    id="user-rating"
                                    value={Helper.getMovieRating(item.data.id, userRatings)}
                                    onChange={(e, newValue) => {handleRate(item, newValue)}}
                                />
                                <Card.Title id="movie-title" title={item.data.original_title}>{item.data.title}</Card.Title>
                            </div>
                        }
                        {window.innerWidth > 575 &&
                            <div className="d-flex justify-content-between align-items-center">
                                <Card.Text id="movie-date">{Helper.formatDate(item.data.release_date)}</Card.Text>
                                <Badge id="search-score" bg={Helper.getScoreBarColor(item.data.vote_average)}>
                                    {item.data.vote_average ? Helper.formatScore(item.data.vote_average) : 'NR'}
                                </Badge>
                            </div>
                        }
                        {window.innerWidth > 575 &&
                            <Card.Text id="movie-description">{item.data.overview}</Card.Text>
                        }
                        {window.innerWidth > 991 &&
                            <div>
                                {activeCard === index
                                    ? <div id="footer-icons">
                                        {list !== "Favorites" &&
                                            <MdFavorite title="Add to Favorites"
                                                onClick={() => handleAdd(item.data, "Favorites")}
                                                className="footer-icon fav-icon"
                                            />}
                                        {list !== "Watch List" &&
                                            <IoMdEye title="Add to Watch List"
                                                onClick={() => handleAdd(item.data, "Watch List")}
                                                className="footer-icon watch-icon"
                                            />}
                                        {list !== "Watched" &&
                                            <MdTaskAlt title="Add to Watched"
                                                onClick={() => handleAdd(item.data, "Watched")}
                                                className="footer-icon watched-icon"
                                            />}
                                    </div>
                                    : null}
                                <Button id="card-button" variant="primary" onClick={() => getMovieExpandedData(item.data.id)}>Info</Button>
                            </div>
                        }
                        {window.innerWidth < 992 &&
                            <div>
                                <div id="footer-icons">
                                    {list !== "Favorites" &&
                                        <MdFavorite title="Add to Favorites"
                                            onClick={() => handleAdd(item.data, "Favorites")}
                                            className="footer-icon fav-icon"
                                        />}
                                    {list !== "Watch List" &&
                                        <IoMdEye title="Add to Watch List"
                                            onClick={() => handleAdd(item.data, "Watch List")}
                                            className="footer-icon watch-icon"
                                        />}
                                    {list !== "Watched" &&
                                        <MdTaskAlt title="Add to Watched"
                                            onClick={() => handleAdd(item.data, "Watched")}
                                            className="footer-icon watched-icon"
                                        />}
                                </div>
                                <Button id="card-button" variant="primary" onClick={() => getMovieExpandedData(item.data.id)}>Info</Button>
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
                        Are you sure you want to delete {deleteData.title} from {list}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDelete(deleteData)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showExpandedInfo && <ExpandedMovieInfo movieObj={infoData} />}

        </Container>
    );
};

export default List;
