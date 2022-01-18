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

function Search({ user, passDataToDashboard }) {

    const [searchInput, setSearchInput] = useState("");
    const [searchFor, setSearchFor] = useState("");
    const [data, setData] = useState([]);
    const [addMovie, setAddMovie] = useState(0);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (searchFor) {
            axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + searchFor)
                .then(res => {
                    console.log(res.data);
                    if (res.data.results) {
                        setData(res.data.results);
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

    const handleAdd = (item, list) => {
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
        setAddMovie(addMovie + 1);
        passDataToDashboard(addMovie + 1);
    };

    return (
        <Container id="search-container">
            <div className="d-flex" ref={searchRef}>
                <BiSearch id="search-icon" />
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
                            <img src={item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null} alt="" />
                            <div id="results-text" className="d-flex flex-column">
                                <p>{item.title}</p>
                                <p className="text-muted">{item.original_title !== item.title ? item.original_title : null}</p>
                                <p>{item.release_date ? item.release_date.slice(0, 4) : null}</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-between">
                            <MdFavorite title="Add to Favorites"
                                onClick={() => handleAdd(item, "Favorites")}
                                className="results-icon fav-icon"
                            />
                            <IoMdEye title="Add to Watch List"
                                onClick={() => handleAdd(item, "Watch List")}
                                className="results-icon watch-icon"
                            />
                            <MdTaskAlt title="Add to Watched"
                                onClick={() => handleAdd(item, "Watched")}
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