import React, { useState, useContext } from 'react';
import './List.css';
import { UserContext } from './UserContext';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import { Helper } from "./Helper";
import { LocalStorage } from './LocalStorage';
import { useAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import { Requests } from './Requests';
import ExampleMovieCard from './ExampleMovieCard';
import ExpandedMovieInfo from './ExpandedMovieInfo';
import ExpandedTvShowInfo from './ExpandedTvShowInfo';
import Rating from '@mui/material/Rating';
import useWindowSize from './useWindowSize';

function List({ list, listData, layout }) {

    const context = useContext(UserContext);
    const { user, getAccessTokenSilently } = useAuth0();
    const width = useWindowSize().width;

    const userRatings = context.userData.data.ratings;
    const moviesOnList = context.userData.data[Helper.getNormalizedListName(list)];

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
            setAddData([item.title || item.name, list, false]);
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

    return (
        <Container className='m-0 p-0'>

            {listData.length === 0 && <ExampleMovieCard list={list} isReallyEmpty={moviesOnList.length === 0} />}

            <div id="list-container">
                <ListGroup variant="flush">
                    {layout === 'list' && listData.length > 0 && listData.map((item, index) => (
                        <ListGroup.Item id="movie-card-list" key={index} className="d-flex">
                            <img className="img-fluid" src={item.getPosterPath() || coverNotFound} alt="cover-img" />
                            <div className="d-flex flex-column w-100">
                                <Card.Title id="movie-title-list" title={item.getOriginalTitle()}>{item.getTitle()}</Card.Title>
                                <div className='d-flex justify-content-start'>
                                    <div id="date-ratings-container">
                                        <div className="d-flex justify-content-between">
                                            <Card.Text id="movie-date">{item.getReleaseYear()}</Card.Text>
                                            <Badge id="search-score" bg={Helper.getScoreBarColor(item.getAverageRating())}>
                                                {item.getAverageRating() === 'Not Rated' ? 'NR' : item.getAverageRating()}
                                            </Badge>
                                        </div>
                                        <Rating
                                            id="user-rating-list"
                                            value={Helper.getMovieRating(item.getId(), userRatings)}
                                            onChange={(e, newValue) => { handleRate(item.item, newValue) }}
                                        />
                                    </div>
                                    {width > 575 &&
                                        <div id="description-container" className='d-flex align-items-end'>
                                            <Card.Text >{item.getOverview()}</Card.Text>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div id="buttons-container" className='d-flex flex-column justify-content-between'>
                                <div className='d-flex justify-content-end'>
                                    <CloseButton id="close-card-list"
                                        onClick={() => {
                                            setDeleteData(item.item);
                                            setDeleteMovie(true);
                                        }}
                                    />
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <Button id="card-button-list" variant="link" onClick={() => getMovieExpandedData(item.item)}>Info</Button>
                                </div>
                                <div className='d-flex align-items-end'>
                                    {list !== "Favorites" &&
                                        <MdFavorite title="Add to Favorites"
                                            onClick={() => handleAdd(item.item, "Favorites")}
                                            className="footer-icon-list fav-icon"
                                        />}
                                    {list !== "Watch List" &&
                                        <RiFileListLine title="Add to Watch List"
                                            onClick={() => handleAdd(item.item, "Watch List")}
                                            className="footer-icon-list watch-icon"
                                        />}
                                    {list !== "Watching" &&
                                        <IoMdEye title="Add to Watching"
                                            onClick={() => handleAdd(item.item, "Watching")}
                                            className="footer-icon-list watching-icon"
                                        />}
                                    {list !== "Watched" &&
                                        <MdTaskAlt title="Add to Watched"
                                            onClick={() => handleAdd(item.item, "Watched")}
                                            className="footer-icon-list watched-icon"
                                        />}
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            <div id="list-container-grid">
                {layout === 'grid' && listData.length > 0 && listData.map((item, index) => (
                    <Card id="movie-card" key={index} onMouseEnter={() => setActiveCard(index)} onMouseLeave={() => setActiveCard(null)}>
                        {width > 991 &&
                            <div>
                                {activeCard === index &&
                                    <CloseButton
                                        id="close-card"
                                        onClick={() => {
                                            setDeleteData(item.item);
                                            setDeleteMovie(true);
                                        }}
                                    />}
                            </div>
                        }
                        {width < 992 &&
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
                        {width < 400
                            ? <Card.Img variant="top" className="card-img img-fluid"
                                src={item.getPosterPath() || coverNotFound}
                            />
                            : <Card.Img variant="top" className="card-img img-fluid"
                                src={item.getBackdropPath() || backdropNotFound}
                            />
                        }
                        <Card.Body id="movie-card-body">
                            {width > 400 &&
                                <div>
                                    <Rating
                                        id="user-rating"
                                        value={Helper.getMovieRating(item.getId(), userRatings)}
                                        onChange={(e, newValue) => { handleRate(item.item, newValue) }}
                                    />
                                    <Card.Title id="movie-title" title={item.getOriginalTitle()}>{item.getTitle()}</Card.Title>
                                </div>
                            }
                            {width > 575 &&
                                <div className="d-flex justify-content-between align-items-center">
                                    <Card.Text id="movie-date">{item.getReleaseYear()}</Card.Text>
                                    <Badge id="search-score" bg={Helper.getScoreBarColor(item.getAverageRating())}>
                                        {item.getAverageRating() === 'Not Rated' ? 'NR' : item.getAverageRating()}
                                    </Badge>
                                </div>
                            }
                            {width > 575 &&
                                <Card.Text id="movie-description">{item.getOverview()}</Card.Text>
                            }
                            {width > 991 &&
                                <div>
                                    {activeCard === index &&
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
                                        </div>}
                                    <Button id="card-button" variant="primary" onClick={() => getMovieExpandedData(item.item)}>Info</Button>
                                </div>
                            }
                            {width < 992 &&
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
            </div>

            {addMovieToList && !addData[2] && (
                <Modal id="icons-modal" show={addMovieToList} onHide={() => setAddMovieToList(false)} animation={true} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Already On List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{addData[0]} is already on {addData[1]}</Modal.Body>
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

            {showExpandedInfo && infoData[1] === 'movie' &&
                <ExpandedMovieInfo
                    movieObj={infoData[0]}
                    country={context.userData.config.general.country}
                    hide={() => setShowExpandedInfo(false)}
                />
            }
            {showExpandedInfo && infoData[1] === 'tv' &&
                <ExpandedTvShowInfo
                    tvShowObj={infoData[0]}
                    country={context.userData.config.general.country}
                    hide={() => setShowExpandedInfo(false)}
                />
            }

        </Container>
    );
};

export default List;
