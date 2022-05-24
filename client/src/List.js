import React, { useState } from 'react';
import './List.css';
import Helper from "./Helper";
import ListConfig from "./ListConfig";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import Requests from './Requests';
import ExampleMovieCard from './ExampleMovieCard';

function List({ user, list, listData, listConfig, updateMain }) {

    const [activeCard, setActiveCard] = useState(null);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoData, setInfoData] = useState(null);

    const [deleteMovie, setDeleteMovie] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [addMovieToList, setAddMovieToList] = useState(false);
    const [addData, setAddData] = useState(null);

    const getMovieExpandedInfo = (movieId) => {
        Requests.getMovieInfo(movieId).then(res => {
            setInfoData(res.data);
            setShowInfoModal(true);
        });
    };

    const handleAdd = (item, list) => {
        let newList = Helper.getNormalizedListName(list);
        Requests.addMovie(user.email, newList, item).then(res => {
            updateMain(res.data);
            setAddData([item.title, list]);
            setAddMovieToList(true);
        }).catch(err => {
            console.log(err);
        });
    };

    const handleDelete = (item) => {
        let currentList = Helper.getNormalizedListName(list);
        Requests.deleteMovie(user.email, currentList, item).then(res => {
            updateMain(res.data);
            setDeleteMovie(false);
            setDeleteData(null);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <Container id="list-container">
            {listData.length === 0 &&
                <ExampleMovieCard list={list}/>
            }

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
                        ? <Card.Img
                            variant="top"
                            src={item.data.poster_path ? "https://image.tmdb.org/t/p/w500" + item.data.poster_path : null}
                            className="card-img img-fluid"
                        />
                        : <Card.Img
                            variant="top"
                            src={item.data.backdrop_path ? "https://image.tmdb.org/t/p/w500" + item.data.backdrop_path : null}
                            className="card-img img-fluid"
                        />
                    }
                    <Card.Body>
                        {window.innerWidth > 400 &&
                            <Card.Title id="movie-title" title={item.data.original_title}>{Helper.formatTitle(item.data.title)}</Card.Title>
                        }
                        {window.innerWidth > 575 &&
                            <div className="d-flex justify-content-between">
                                <Card.Text id="movie-date">{Helper.formatDate(item.data.release_date)}</Card.Text>
                                <Card.Text id="movie-score">{Helper.formatScore(item.data.vote_average)}</Card.Text>
                            </div>
                        }
                        {window.innerWidth > 575 &&
                            <Card.Text id="movie-description">{Helper.formatDescription(item.data.overview, item.data.original_title)}</Card.Text>
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
                                <Button id="card-button" variant="primary" onClick={() => getMovieExpandedInfo(item.data.id)}>Info</Button>
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
                                <Button id="card-button" variant="primary" onClick={() => getMovieExpandedInfo(item.data.id)}>Info</Button>
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
                        {addData ? addData[0] : null} was added to {addData ? addData[1] : null}.
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

            {infoData && (
                <Modal id="movie-modal" size="lg" show={showInfoModal} onHide={() => setShowInfoModal(false)} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{infoData.release_date ? infoData.title + " (" + Helper.formatDate(infoData.release_date) + ")" : infoData.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="modal-body" className="d-flex">
                        <div>
                            {window.innerWidth > 399
                                ? <img
                                    src={infoData.poster_path ? "https://image.tmdb.org/t/p/w500" + infoData.poster_path : null}
                                    alt="movie_cover"
                                    className="modal-img"
                                />
                                : <img
                                    src={infoData.backdrop_path ? "https://image.tmdb.org/t/p/w500" + infoData.backdrop_path : null}
                                    alt="movie_cover"
                                    className="modal-img img-fluid"
                                />
                            }
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