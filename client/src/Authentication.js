import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Authentication.css';
import { Requests } from "./Requests";
import { useAuth0 } from '@auth0/auth0-react';
import logo from './logo.png';
import coverNotFound from './cover-not-found.png';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LocalStorage } from './LocalStorage';

function Authentication() {

    const navigate = useNavigate();

    useEffect(() => {
        navigate('/start');
    }, [navigate]);

    const { loginWithRedirect } = useAuth0();
    const [covers, setCovers] = useState([]);
    const [activeCovers, setActiveCovers] = useState([]);
    const [index, setIndex] = useState(window.innerWidth < 768 ? 10 : 20);

    useEffect(() => {
        if (LocalStorage.hasUpdatedTrendingCovers()) {
            setCovers(LocalStorage.getTrendingCovers());
        } else {
            Requests.getCovers().then(res => {
                setCovers(res.data);
                LocalStorage.setTrendingCovers(res.data);
            })
        }
    }, []);

    useEffect(() => {
        let n = window.innerWidth < 768 ? 10 : 20;
        let active = covers.filter((item, i) => i >= 0 && i < n);
        setActiveCovers(active);
    }, [covers]);

    useEffect(() => {
        let n = window.innerWidth < 768 ? 10 : 20;
        const interval = setInterval(() => {
            if (index !== 60 - n) {
                setIndex(index + n);
            } else if (index === 60 - n) {
                setIndex(0);
            };
            let active = covers.filter((item, i) => i >= index && i < index + n);
            setActiveCovers(active);
        }, 10000);
        return () => clearInterval(interval);
    });

    return (
        <Container id="home-container" className="d-flex justify-content-center align-items-center">
            <div id="home" className="d-flex flex-column">
                <div id="home-info-one">
                    <div className="d-flex">
                        <h1>React Movie App</h1>
                        <div className="d-flex">
                            <img src={logo} alt="app_logo" className="img-fluid" />
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
                {activeCovers.length > 0 && activeCovers.map((item, i) => (
                    <img
                        key={i}
                        src={item ? "https://image.tmdb.org/t/p/w500" + item : coverNotFound}
                        alt=""
                        className="img-fluid"
                    />
                ))}
            </div>
        </Container>
    );
};

export default Authentication;