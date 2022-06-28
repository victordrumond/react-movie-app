import React, { useState, useEffect, useRef, useContext } from 'react';
import './Search.css';
import { UserContext } from './UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import coverNotFound from './cover-not-found.png';
import ExpandedMovieInfo from './ExpandedMovieInfo';
import ExpandedTvShowInfo from './ExpandedTvShowInfo';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import { Requests } from './Requests';
import { Helper } from './Helper';
import { LocalStorage } from './LocalStorage';
import { SearchResult } from './SearchResult';

function Search() {

    const context = useContext(UserContext);
    const { user, getAccessTokenSilently } = useAuth0();

    const [searchInput, setSearchInput] = useState("");
    const [searchFor, setSearchFor] = useState("");
    const [data, setData] = useState([]);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);

    const [infoData, setInfoData] = useState(null);
    const [showExpandedInfo, setShowExpandedInfo] = useState(false);

    const [addMovieToList, setAddMovieToList] = useState(false);
    const [addData, setAddData] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchFor) {
                Requests.searchFor(searchFor).then(res => {
                    if (res.data.results) {
                        let results = [];
                        for (const result of res.data.results) {
                            results.push(new SearchResult(result));
                        }
                        setData(results);
                    };
                });
            } else {
                setData([]);
            };
        }, 300)
        return () => clearTimeout(timer)
    }, [searchFor]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!showExpandedInfo && resultsRef.current && !resultsRef.current.contains(event.target) && !searchRef.current.contains(event.target)) {
                setSearchFor("");
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [resultsRef, showExpandedInfo]);

    const handleAdd = async (item, list) => {
        setSearchFor("");
        if (await isMovieOnList(item.result, list)) {
            setAddData([item.result.title || item.result.name, list, false]);
            setAddMovieToList(true);
            return;
        }
        await getAccessTokenSilently().then(token => {
            Requests.addMovie(token, user, list, item.result).then(res => {
                context.setUserData(res.data);
                setAddData([item.result.title || item.result.name, list, true]);
                setAddMovieToList(true);
            }).catch(err => {
                console.log(err);
            })
        });
    };

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

    const isMovieOnList = async (item, list) => {
        let listMovies = context.userData.data[list];
        for (const movie of listMovies) {
            if (movie.data.id === item.id) {
                return true;
            }
        }
        return false;
    }

    const getButtonComponents = (item) => {
        const addToFavorites = [<MdFavorite key="add-favorites" title="Add to Favorites" onClick={() => handleAdd(item, "favorites")} className="results-icon favorites-icon" />, 'favorites'];
        const addToWatchList = [<RiFileListLine key="add-watchList" title="Add to Watch List" onClick={() => handleAdd(item, "watchList")} className="results-icon watchList-icon" />, 'watchList'];
        const addToWatching = [<IoMdEye key="add-watching" title="Add to Watching" onClick={() => handleAdd(item, "watching")} className="results-icon watching-icon" />, 'watching'];
        const addToWatched = [<MdTaskAlt key="add-watched" title="Add to Watched" onClick={() => handleAdd(item, "watched")} className="results-icon watched-icon" />, 'watched'];
        return [addToFavorites, addToWatchList, addToWatching, addToWatched];
    }

    return (
        <Container id="search-container">
            <div className="d-flex" ref={searchRef}>
                <BiSearch className="search-icon" />
                <Form.Control id="input" type="search"
                    placeholder={`What's your next story, ${user.name}?`}
                    value={searchInput}
                    onChange={e => {
                        setSearchInput(e.target.value);
                        setSearchFor(e.target.value);
                    }}
                    onClick={e => setSearchFor(e.target.value)}
                />
            </div>
            <ListGroup id="results" ref={resultsRef}>
                {data.length !== 0 && searchFor !== "" && data.map((item, index) => (
                    <ListGroup.Item key={index} className="result-item d-flex justify-content-between">
                        <div className="d-flex">
                            <img
                                src={item.getPosterPath() || coverNotFound}
                                alt="movie_cover" className="img-fluid"
                            />
                            <div id="results-text" className="d-flex flex-column">
                                <p title={item.getTitle()}>{item.getTitle()}{item.getOriginalTitle() !== item.getTitle() ? ` (${item.getOriginalTitle()})` : ''}</p>
                                <p className="text-muted">{item.getReleaseYear()}</p>
                                <p><Badge id="search-score" bg={Helper.getScoreBarColor(item.getAverageRating())}>{item.getAverageRating() === 'Not Rated' ? 'NR' : item.getAverageRating()}</Badge></p>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-end">
                                <Button id="info-btn" variant="link" onClick={() => getMovieExpandedData(item.result)}>Info</Button>
                            </div>
                            <div className="d-flex justify-content-between align-items-end">
                                {getButtonComponents(item).map(element => element[0])}
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {addMovieToList && !addData[2] && (
                <Modal show={addMovieToList} onHide={() => setAddMovieToList(false)} animation={true} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Already On List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{addData[0]} is already on {Helper.getListName(addData[1])}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setAddMovieToList(false)}>
                            Continue
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

export default Search;
