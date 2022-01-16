import React, { useEffect, useState } from 'react'
import './Authentication.css';
import { useAuth0 } from '@auth0/auth0-react';
import logo from './logo.png';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function Authentication() {

    const { loginWithRedirect } = useAuth0();
    const [covers, setCovers] = useState([]);
    const [activeCovers, setActiveCovers] = useState([]);
    const [index, setIndex] = useState(window.innerWidth < 768 ? 10 : 20);

    useEffect(() => {
        for (let i = 1; i <= 3; i++) {
            fetch("https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&page=" + i)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    data.results.forEach(item => setCovers(prev => [...prev, item]));
                });
        };
    }, [])

    useEffect(() => {
        if (window.innerWidth < 768) {
            let active = covers.filter((item, i) => i >= 0 && i < 10);
            setActiveCovers(active);
        } else {
            let active = covers.filter((item, i) => i >= 0 && i < 20);
            setActiveCovers(active);
        };
    }, [covers]);

    useEffect(() => {
        if (window.innerWidth < 768) {
            const interval = setInterval(() => {
                if (index !== 50) {
                    setIndex(index + 10);
                } else if (index === 50) {
                    setIndex(0);
                };
                let active = covers.filter((item, i) => i >= index && i < index + 10);
                setActiveCovers(active);
            }, 10000);
            return () => clearInterval(interval);
        } else {
            const interval = setInterval(() => {
                if (index !== 40) {
                    setIndex(index + 20);
                } else if (index === 40) {
                    setIndex(0);
                };
                let active = covers.filter((item, i) => i >= index && i < index + 20);
                setActiveCovers(active);
            }, 10000);
            return () => clearInterval(interval);
        };
    });

    return (
        <Container id="home-container" className="d-flex justify-content-center align-items-center">
            <div id="home" className="d-flex flex-column">
                <div id="home-info-one">
                    <div className="d-flex">
                        <h1>React Movie App</h1>
                        <div className="d-flex">
                            <img src={logo} alt="" className="img-fluid" />
                        </div>
                    </div>
                    <p>Organize your movie collection in a simple and easy way.</p>
                    <Button id="login-button" variant="success" onClick={() => loginWithRedirect()}>
                        Get Started
                    </Button>
                </div>
                <div id="home-info-two">
                    <p>Built with React and Node.</p>
                    <p>Using Bootstrap, Express, MongoDB and Mongoose.</p>
                    <p>For more information please visit this project's repository on <a href="https://github.com/victordrumond/react-movie-app" target="_blank" rel="noreferrer">GitHub</a>.</p>
                </div>
            </div>
            <div id="trending">
                {activeCovers.length > 0 && activeCovers.map(item => (
                    <img key={item.poster_path} src={"https://image.tmdb.org/t/p/w500" + item.poster_path} alt=""
                        className="img-fluid" />
                ))}
            </div>
        </Container>
    );
};

export default Authentication;