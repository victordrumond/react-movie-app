import React, { useState, useEffect, useMemo } from 'react';
import './ExpandedTvShowInfo.css';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import TvShow from './TvShow';
import Helper from './Helper';

function ExpandedTvShowInfo({ tvShowObj, country }) {

    const movie = useMemo(() => new TvShow(tvShowObj, ''), [tvShowObj]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [streamingData, setStreamingData] = useState(movie.getStreamingServices());
    const [selectedCountry, setSelectedCountry] = useState(country);
    const [viewSeason, setViewSeason] = useState("0");

    useEffect(() => {
        setSelectedCountry(country);
    }, [country])

    useEffect(() => {
        setViewSeason("0");
    }, [tvShowObj])

    useEffect(() => {
        setStreamingData(movie.getStreamingServices());
        setShowInfoModal(true);
    }, [movie])

    const isAvailableOnStreaming = () => {
        return streamingData.length === 0 ? false : true;
    }

    const getAvailableServicesOnCountry = () => {
        for (const dataCountry of streamingData) {
            if (dataCountry.country === selectedCountry) {
                return dataCountry.services;
            }
        }
        for (const dataCountry of streamingData) {
            if (dataCountry.country === 'US') {
                return dataCountry.services;
            }
        }
        return streamingData[0].services;
    }

    return (
        <Modal id="tvshow-modal" size="lg" show={showInfoModal} onHide={() => setShowInfoModal(false)} animation={true} centered={true} >
            <Modal.Header closeButton>
                {viewSeason === "0" &&
                    <Modal.Title>
                        {movie.getReleaseYear(viewSeason) ? `${movie.getTitle()} (${movie.getYears(viewSeason)})` : movie.getTitle()}
                    </Modal.Title>
                }
                {viewSeason > 0 &&
                    <Modal.Title>
                        {movie.getReleaseYear(viewSeason) ? `${movie.getTitle()} - Season ${viewSeason} (${movie.getReleaseYear(viewSeason)})` : movie.getTitle()}
                    </Modal.Title>
                }
            </Modal.Header>
            <Modal.Body id="modal-body" className="d-flex">
                <div>
                    {window.innerWidth > 399
                        ? <img className="modal-img" alt="tvshow_cover" src={movie.getPosterPath(viewSeason) || coverNotFound} />
                        : <img className="modal-img img-fluid" alt="tvshow_cover" src={movie.getBackdropPath() || backdropNotFound} />
                    }
                </div>
                <div id="modal-info">
                    {viewSeason === '0' &&
                        <div id="modal-stats" className="d-flex justify-content-between">
                            <p>{`Status: ${movie.getStatus()}`}</p>
                            <p>{movie.getNumberOfSeasons()}</p>
                            <p>{movie.getParentalRating(selectedCountry)}</p>
                            <p>{movie.getAverageRating()}</p>
                        </div>
                    }
                    {viewSeason > 0 &&
                        <div id="modal-stats" className="d-flex justify-content-between">
                            <p>{`${movie.getNumberOfEpisodes(viewSeason)}`}</p>
                        </div>
                    }
                    <p id="modal-description">{movie.getOverview(viewSeason)}</p>
                    <div id="modal-notes" className="d-flex flex-column">
                        <p><b>Genres: </b>{movie.getGenres().length > 0 ? Helper.separateByComma(movie.getGenres()) : 'not found'}</p>
                        <p><b>Starring: </b>{movie.getCast().length > 0 ? Helper.separateByComma(movie.getCast()) : 'not found'}</p>
                        <p><b>Created by: </b>{movie.getCreators().length > 0 ? Helper.separateByComma(movie.getCreators()) : 'not found'}</p>
                        <p><b>Network: </b>{movie.getNetworks().length > 0 ? Helper.separateByComma(movie.getNetworks()) : 'not found'}</p>
                    </div>
                    <div id="watch" className="d-flex flex-column">
                        <div className="d-flex justify-content-start">
                            <p><b>Streaming:</b></p>
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
            <Modal.Footer>
                <p><b>Season:</b></p>
                <Form.Select id="season-select" size="sm" defaultValue={viewSeason} onChange={(e) => setViewSeason(e.target.value)}>
                    <option key={0} value={0}>Overview</option>
                    {movie.getSeasons().map((item, i) => (
                        <option key={item.season_number} value={item.season_number}>Season {item.season_number}</option>
                    ))}
                </Form.Select>
            </Modal.Footer>
        </Modal>
    )
}

export default ExpandedTvShowInfo;
