import React, { useState, useEffect, useRef } from 'react';
import './Search.css';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function Search({ user }) {

    const [searchInput, setSearchInput] = useState("");
    const [searchFor, setSearchFor] = useState("");
    const [data, setData] = useState([]);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (searchFor) {
            fetch("https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + searchFor)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.results) {
                        setData(data.results);
                    };
                });
        } else {
            setData([]);
        };
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

    const addMovie = (item, list) => {
        setSearchFor("");
        axios.post('/addmovie', {
            "user": user.email,
            "list": list,
            "movie": item
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <Container id="search-container">
            <div className="d-flex" ref={searchRef}>
                <BiSearch id="search-icon"/>
                <Form.Control id="input" type="search"
                    placeholder={user.given_name
                        ? "What is your next story, " + user.given_name + "?"
                        : "What is your next story, " + user.nickname + "?"
                    }
                    value={searchInput}
                    onChange={e => {
                        setSearchInput(e.target.value);
                        setSearchFor(e.target.value);
                    }}
                    onClick={e => setSearchFor(e.target.value)}
                />
            </div>
            <ListGroup id="results" ref={resultsRef}>
                {data.length !== 0 && searchFor !== "" && data.map(item => (
                    <ListGroup.Item key={item.id} className="result-item d-flex justify-content-between">
                        <div className="d-flex">
                            <img src={"https://image.tmdb.org/t/p/w500" + item.poster_path} alt="" />
                            <div id="results-text" className="d-flex flex-column">
                                <p>{item.title}</p>
                                <p className="text-muted">{item.original_title !== item.title ? item.original_title : null}</p>
                                <p>{item.release_date ? item.release_date.slice(0, 4) : null}</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-between">
                            <MdFavorite title="Add to Favorites"
                                onClick={() => addMovie(item, "Favorites")}
                                className="results-icon fav-icon"
                            />
                            <IoMdEye title="Add to Watch List"
                                onClick={() => addMovie(item, "Watch List")}
                                className="results-icon watch-icon"
                            />
                            <MdTaskAlt title="Add to Watched"
                                onClick={() => addMovie(item, "Watched")}
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