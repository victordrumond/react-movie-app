import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import Helper from "./Helper";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const getKey = process.env.REACT_APP_GET_KEY;

function List({ user, list, addMovie, passDataToMain }) {

    const [data, setData] = useState([]);
    const [activeCard, setActiveCard] = useState(null);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoData, setInfoData] = useState(null);

    const [deleteMovie, setDeleteMovie] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [addMovieToList, setAddMovieToList] = useState(false);
    const [addData, setAddData] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            axios
                .get('/' + getKey + '/' + user + '/' + list)
                .then(res => {
                    setData(res.data);
                    passDataToMain(res.data.length);
                });
        }, 350);
        // eslint-disable-next-line   
    }, [addMovie, deleteMovie]);

    useEffect(() => {
        axios
            .get('/' + getKey + '/' + user + '/' + list)
            .then(res => {
                setData(res.data);
                passDataToMain(res.data.length);
            });
        // eslint-disable-next-line   
    }, [user, list]);

    const handleInfo = (item) => {
        axios.get('https://api.themoviedb.org/3/movie/' + item.id + '?api_key=' + apiKey + '&append_to_response=credits,release_dates')
            .then(res => {
                setInfoData(res.data);
                console.log(res.data);
            });
        setTimeout(() => {
            setShowInfoModal(true);
        }, 150);
    };

    const handleAdd = (item, newList) => {
        axios.post('/addmovie', {
            "user": item.user,
            "list": newList,
            "movie": item.movie
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        setTimeout(() => {
            setAddMovieToList(true);
            setAddData({ "movie": item.movie, "list": newList });
        }, 350);
    };

    const handleDelete = (movie) => {
        axios.post('/deletemovie', {
            "user": user,
            "list": list,
            "movie": movie
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        setTimeout(() => {
            setDeleteMovie(false);
        }, 350);
    };

    return (
        <Container id="list-container">
            {data.length !== 0 && data.slice(0).reverse().map((item, index) => (
                <Card id="movie-card" key={index} onMouseEnter={() => setActiveCard(index)} onMouseLeave={() => setActiveCard(null)}>
                    {window.innerWidth > 991 &&
                        <div>
                            {activeCard === index
                                ? <CloseButton
                                    id="close-card"
                                    onClick={() => {
                                        setDeleteData(item.movie);
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
                                    setDeleteData(item.movie);
                                    setDeleteMovie(true);
                                }}
                            />
                        </div>
                    }
                    {window.innerWidth < 400
                        ? <Card.Img
                            variant="top"
                            src={item.movie.poster_path ? "https://image.tmdb.org/t/p/w500" + item.movie.poster_path : null}
                            className="card-img img-fluid"
                        />
                        : <Card.Img
                            variant="top"
                            src={item.movie.backdrop_path ? "https://image.tmdb.org/t/p/w500" + item.movie.backdrop_path : null}
                            className="card-img img-fluid"
                        />
                    }
                    <Card.Body>
                        {window.innerWidth > 400 &&
                            <Card.Title id="movie-title" title={item.movie.original_title}>{Helper.formatTitle(item.movie.title)}</Card.Title>
                        }
                        {window.innerWidth > 575 &&
                            <div className="d-flex justify-content-between">
                                <Card.Text id="movie-date">{Helper.formatDate(item.movie.release_date)}</Card.Text>
                                <Card.Text id="movie-score">{Helper.formatScore(item.movie.vote_average)}</Card.Text>
                            </div>
                        }
                        {window.innerWidth > 575 &&
                            <Card.Text id="movie-description">{Helper.formatDescription(item.movie.overview, item.movie.original_title)}</Card.Text>
                        }
                        {window.innerWidth > 991 &&
                            <div>
                                {activeCard === index
                                    ? <div id="footer-icons">
                                        {list !== "Favorites" &&
                                            <MdFavorite title="Add to Favorites"
                                                onClick={() => handleAdd(item, "Favorites")}
                                                className="footer-icon fav-icon"
                                            />}
                                        {list !== "Watch List" &&
                                            <IoMdEye title="Add to Watch List"
                                                onClick={() => handleAdd(item, "Watch List")}
                                                className="footer-icon watch-icon"
                                            />}
                                        {list !== "Watched" &&
                                            <MdTaskAlt title="Add to Watched"
                                                onClick={() => handleAdd(item, "Watched")}
                                                className="footer-icon watched-icon"
                                            />}
                                    </div>
                                    : null}
                                <Button id="card-button" variant="primary" onClick={() => handleInfo(item.movie)}>Info</Button>
                            </div>
                        }
                        {window.innerWidth < 992 &&
                            <div>
                                <div id="footer-icons">
                                    {list !== "Favorites" &&
                                        <MdFavorite title="Add to Favorites"
                                            onClick={() => handleAdd(item, "Favorites")}
                                            className="footer-icon fav-icon"
                                        />}
                                    {list !== "Watch List" &&
                                        <IoMdEye title="Add to Watch List"
                                            onClick={() => handleAdd(item, "Watch List")}
                                            className="footer-icon watch-icon"
                                        />}
                                    {list !== "Watched" &&
                                        <MdTaskAlt title="Add to Watched"
                                            onClick={() => handleAdd(item, "Watched")}
                                            className="footer-icon watched-icon"
                                        />}
                                </div>
                                <Button id="card-button" variant="primary" onClick={() => handleInfo(item.movie)}>Info</Button>
                            </div>
                        }
                    </Card.Body>
                </Card>
            ))}

            {addMovieToList && (
                <Modal id="icons-modal" show={addMovieToList} onHide={() => setAddMovieToList(false)} animation={true} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add To New List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {addData ? addData.movie.title : null} was added to {addData ? addData.list : null}.
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
                        Proceed to delete {deleteData.title} from {list}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDelete(deleteData)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {infoData && (
                <Modal id="movie-modal" size="lg" show={showInfoModal} onHide={() => setShowInfoModal(false)} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{infoData.release_date ? infoData.title + " (" + Helper.formatDate(infoData.release_date) + ")" : infoData.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex">
                        <div>
                            <img
                                src={infoData.poster_path ? "https://image.tmdb.org/t/p/w500" + infoData.poster_path : null}
                                alt="movie_cover"
                                className="modal-img"
                            />
                        </div>
                        <div id="modal-info">
                            <div id="modal-stats" className="d-flex justify-content-between">
                                <p>{"Status: " + infoData.status}</p>
                                <p>{infoData.runtime + " min"}</p>
                                <p>{infoData.release_dates.results.filter(item => item.iso_3166_1 === "US").length > 0
                                    ? infoData.release_dates.results.filter(item => item.iso_3166_1 === "US")[0].release_dates[0].certification
                                    : "Not Rated"}
                                </p>
                                <p>{Helper.formatScore(infoData.vote_average)}</p>
                            </div>
                            <p id="modal-description">{infoData.overview}</p>
                            <div id="modal-notes" className="d-flex flex-column">
                                <p><b>Genres: </b>{infoData.genres.map(item => (" " + item.name)) + "."}</p>
                                <p><b>Starring: </b>{infoData.credits.cast.filter((item, i) => item.known_for_department === "Acting" && i < 8).map(item => (" " + item.name)) + "."}</p>
                                <p><b>Direction: </b>{infoData.credits.crew.filter(item => item.job === "Director").map(item => (" " + item.name)) + "."}</p>
                                <p><b>Production: </b>{infoData.production_companies.map(item => (" " + item.name)) + "."}</p>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default List;