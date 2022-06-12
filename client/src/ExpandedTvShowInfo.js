import React, { useState, useEffect, useMemo } from 'react';
import './ExpandedTvShowInfo.css';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import TvShow from './TvShow';
import Helper from './Helper';

function ExpandedTvShowInfo({ tvShowObj }) {

    const movie = useMemo(() => new TvShow(tvShowObj), [tvShowObj]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [streamingData, setStreamingData] = useState(movie.getStreamingServices());

    useEffect(() => {
        setStreamingData(movie.getStreamingServices());
        setShowInfoModal(true);
    }, [movie])

    const isAvailableOnStreaming = () => {
        return streamingData.length === 0 ? false : true;
    }

    const [selectedCountry, setSelectedCountry] = useState('US');

    const getAvailableServicesOnCountry = () => {
        for (const dataCountry of streamingData) {
            if (dataCountry.country === selectedCountry) {
                return dataCountry.services;
            }
        }
        return streamingData[0].services;
    }

    return (
        <Modal id="tvshow-modal" size="lg" show={showInfoModal} onHide={() => setShowInfoModal(false)} animation={true} centered={true} >
            <Modal.Header closeButton>
                <Modal.Title>
                    {movie.getReleaseYear() ? `${movie.getTitle()} (${movie.getReleaseYear()})` : movie.getTitle()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body" className="d-flex">
                <div>
                    {window.innerWidth > 399
                        ? <img className="modal-img" alt="tvshow_cover" src={movie.getPosterPath() || coverNotFound} />
                        : <img className="modal-img img-fluid" alt="tvshow_cover" src={movie.getBackdropPath() || backdropNotFound} />
                    }
                </div>
                <div id="modal-info">
                    <div id="modal-stats" className="d-flex justify-content-between">
                        <p>{`Status: ${movie.getStatus()}`}</p>
                        <p>{movie.getNumberOfSeasons()}</p>
                        <p>{movie.getParentalRating()}</p>
                        <p>{movie.getAverageRating()}</p>
                    </div>
                    <p id="modal-description">{movie.getOverview()}</p>
                    <div id="modal-notes" className="d-flex flex-column">
                        <p><b>Genres: </b>{movie.getGenres().length > 0 ? Helper.separateByComma(movie.getGenres()) : 'not found'}</p>
                        <p><b>Starring: </b>{movie.getCast().length > 0 ? Helper.separateByComma(movie.getCast()) : 'not found'}</p>
                        <p><b>Created by: </b>{movie.getCreators().length > 0 ? Helper.separateByComma(movie.getCreators()) : 'not found'}</p>
                        <p><b>Network: </b>{movie.getNetworks().length > 0 ? Helper.separateByComma(movie.getNetworks()) : 'not found'}</p>
                    </div>
                    <div id="watch" className="d-flex flex-column">
                        <div className="d-flex justify-content-start">
                            <p><b>Streaming</b></p>
                            {isAvailableOnStreaming() &&
                                <Form.Select id="country-select" size="sm" defaultValue={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                    {streamingData.map((item, i) => (
                                        <option key={i} value={item.country}>{item.country}</option>
                                    ))}
                                </Form.Select>
                            }
                        </div>
                        <div id="streaming-services" className="d-flex justify-content-start">
                            {!isAvailableOnStreaming() &&
                                <p>Not available for streaming in any country at the moment</p>
                            }
                            {isAvailableOnStreaming() && getAvailableServicesOnCountry().map((item, i) => (
                                <img
                                    key={i} src={'https://image.tmdb.org/t/p/w500' + item.logo_path}
                                    alt="streaming_logo" title={item.provider_name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ExpandedTvShowInfo;
