import React, { useState, useEffect } from 'react';
import './ExpandedMovieInfo.css';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Movie from './Movie';

function ExpandedMovieInfo({ movieObj }) {

    const movie = new Movie(movieObj);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        setShowInfoModal(true);
    }, [movieObj])

    return (
        <Modal id="movie-modal" size="lg" show={showInfoModal} onHide={() => setShowInfoModal(false)} animation={true}>
            <Modal.Header closeButton>
                <Modal.Title>{`${movie.getTitle()} (${movie.getReleaseYear()})`}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body" className="d-flex">
                <div>
                    {window.innerWidth > 399
                        ? <img className="modal-img" alt="movie_cover" src={movie.getPosterPath()} />
                        : <img className="modal-img img-fluid" alt="movie_cover" src={movie.getBackdropPath()} />
                    }
                </div>
                <div id="modal-info">
                    <div id="modal-stats" className="d-flex justify-content-between">
                        <p>{`Status: ${movie.getStatus()}`}</p>
                        <p>{movie.getRuntime()}</p>
                        <p>{movie.getParentalRating()}</p>
                        <p>{movie.getAverageRating()}</p>
                    </div>
                    <p id="modal-description">{movie.getOverview()}</p>
                    <div id="modal-notes" className="d-flex flex-column">
                        <p><b>Genres: </b>{movie.getGenres() + "."}</p>
                        <p><b>Starring: </b>{movie.getCast() + "."}</p>
                        <p><b>Direction: </b>{movie.getDirectors() + "."}</p>
                        <p><b>Production: </b>{movie.getProductionCompanies() + "."}</p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ExpandedMovieInfo;
