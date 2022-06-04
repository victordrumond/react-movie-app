import React, { useState, useEffect, useRef, useContext } from 'react';
import './Search.css';
import { UserContext } from './UserContext';
import coverNotFound from './cover-not-found.png';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import Requests from './Requests';
import Helper from './Helper';

function Search({ user }) {

    const context = useContext(UserContext);

    const [searchInput, setSearchInput] = useState("");
    const [searchFor, setSearchFor] = useState("");
    const [data, setData] = useState([]);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchFor) {
                Requests.searchFor(searchFor).then(res => {
                    if (res.data.results) {
                        setData(res.data.results);
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
            if (resultsRef.current && !resultsRef.current.contains(event.target) && !searchRef.current.contains(event.target)) {
                setSearchFor("");
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [resultsRef]);

    const handleAdd = (item, list) => {
        setSearchFor("");
        Requests.addMovie(user.email, list, item).then(res => {
            context.setUserData(res.data);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <Container id="search-container">
            <div className="d-flex" ref={searchRef}>
                <BiSearch id="search-icon" />
                <Form.Control id="input" type="search"
                    placeholder={`What's your next story, ${user.given_name ? user.given_name : user.nickname}?`}
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
                                src={item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : coverNotFound}
                                alt="movie_cover"
                                className="img-fluid"
                            />
                            <div id="results-text" className="d-flex flex-column">
                                <p title={item.title}>{item.title}{item.original_title !== item.title ? ` (${item.original_title})` : ''}</p>
                                <p className='text-muted'>{item.release_date ? item.release_date.slice(0, 4) : ''}</p>
                                <p><Badge id="search-score" bg={Helper.getScoreBarColor(item.vote_average)}>{item.vote_average ? Helper.formatScore(item.vote_average) : 'NR'}</Badge></p>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-between">
                            <MdFavorite title="Add to Favorites"
                                onClick={() => handleAdd(item, "favorites")}
                                className="results-icon fav-icon"
                            />
                            <IoMdEye title="Add to Watch List"
                                onClick={() => handleAdd(item, "watchList")}
                                className="results-icon watch-icon"
                            />
                            <MdTaskAlt title="Add to Watched"
                                onClick={() => handleAdd(item, "watched")}
                                className="results-icon watched-icon"
                            />
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default Search;
