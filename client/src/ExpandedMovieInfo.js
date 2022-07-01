import React, { useState, useEffect, useMemo } from 'react';
import './ExpandedMovieInfo.css';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { Movie } from './Movie';
import { Helper } from './Helper';
import useWindowSize from './useWindowSize';

function ExpandedMovieInfo({ movieObj, country, hide }) {

    const width = useWindowSize().width;
    const movie = useMemo(() => new Movie(movieObj, '', 0), [movieObj]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [watchData, setWatchData] = useState(movie.getWatchServices());

    useEffect(() => {
        setWatchData(movie.getWatchServices());
        setShowInfoModal(true);
    }, [movie])

    const getCountry = () => {
        if (watchData.length === 0) return '';
        const hasCountry = watchData.findIndex(watchService => watchService.country === country);
        if (hasCountry >= 0) return country;
        const hasUsa = watchData.findIndex(watchService => watchService.country === 'US');
        if (hasUsa >= 0) return 'US';
        return watchData[0].country;
    }

    const [selectedCountry, setSelectedCountry] = useState(getCountry());

    const getService = () => {
        const watchServices = watchData.filter(watchService => watchService.country === selectedCountry);
        if (watchServices.length === 0) return '';
        const services = watchServices[0].services;
        if (services['flatrate'].length > 0) return 'flatrate';
        if (services['rent'].length > 0) return 'rent';
        if (services['buy'].length > 0) return 'buy';
    }

    const [selectedService, setSelectedService] = useState(getService());

    const isMovieAvailable = () => {
        return !(watchData.length === 0);
    }

    const isServiceAvailable = (service) => {
        const index = watchData.findIndex(watchService => watchService.country === selectedCountry && watchService.services[service].length > 0);
        return index >= 0;
    }

    const getAvailableProviders = () => {
        const index = watchData.findIndex(watchService => watchService.country === selectedCountry);
        return watchData[index].services[selectedService];
    }

    const getDefaultProvider = () => {
        if (isServiceAvailable(selectedService)) return selectedService;
        const services = ['flatrate', 'rent', 'buy'];
        for (const service of services) {
            if (isServiceAvailable(service)) {
                if (service !== selectedService) {
                    setSelectedService(service);
                }
                return service;
            }
        }
    }

    const handleHide = () => {
        setShowInfoModal(false);
        hide(false);
    }

    return (
        <Modal id="movie-modal" size="lg" show={showInfoModal} onHide={() => handleHide()} animation={true} centered={true} >
            <Modal.Header closeButton>
                <Modal.Title>
                    {movie.getReleaseYear() ? `${movie.getTitle()} (${movie.getReleaseYear()})` : movie.getTitle()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal-body" className="d-flex">
                <div>
                    {width > 575
                        ? <img className="modal-img" alt="movie_cover" src={movie.getPosterPath() || coverNotFound} />
                        : <img className="modal-img img-fluid" alt="movie_cover" src={movie.getBackdropPath() || backdropNotFound} />
                    }
                </div>
                <div id="modal-info">
                    <div id="modal-stats" className="d-flex justify-content-between">
                        <p>{`Status: ${movie.getStatus()}`}</p>
                        <p>{movie.getRuntime()}</p>
                        <p>{movie.getParentalRating(selectedCountry)}</p>
                        <Badge bg={Helper.getScoreBarColor(movie.getAverageRating())}>
                            {movie.getAverageRating() === 'Not Rated' ? 'NR' : movie.getAverageRating()}
                        </Badge>
                    </div>
                    <p id="modal-description">{movie.getOverview()}</p>
                    <div id="modal-notes" className="d-flex flex-column">
                        <p><b>Genres: </b>{movie.getGenres().length > 0 ? Helper.separateByComma(movie.getGenres()) : 'not found'}</p>
                        <p><b>Starring: </b>{movie.getCast().length > 0 ? Helper.separateByComma(movie.getCast()) : 'not found'}</p>
                        <p><b>Direction: </b>{movie.getDirection().length > 0 ? Helper.separateByComma(movie.getDirection()) : 'not found'}</p>
                        <p><b>Production: </b>{movie.getProductionCompanies().length > 0 ? Helper.separateByComma(movie.getProductionCompanies()) : 'not found'}</p>
                    </div>
                    <div id="watch" className="d-flex flex-column">
                        <p><b>Watch:</b></p>
                        <div className="d-flex justify-content-start">
                            {isMovieAvailable() &&
                                <Form.Select id="service-select" size="sm" defaultValue={getDefaultProvider()} onChange={(e) => setSelectedService(e.target.value)}>
                                    {isServiceAvailable('flatrate') &&
                                        <option key="flatrate" value="flatrate">Streaming</option>
                                    }
                                    {isServiceAvailable('rent') &&
                                        <option key="rent" value="rent">Rent</option>
                                    }
                                    {isServiceAvailable('buy') &&
                                        <option key="buy" value="buy">Buy</option>
                                    }
                                </Form.Select>
                            }
                            {isMovieAvailable() &&
                                <Form.Select id="country-select" size="sm" defaultValue={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                    {watchData.map((item, i) => (
                                        <option key={i} value={item.country}>{item.country}</option>
                                    ))}
                                </Form.Select>
                            }
                        </div>
                        <div className="d-flex justify-content-start">
                            {!isMovieAvailable() &&
                                <p>Not available in any country at the moment</p>
                            }
                            <div id="watch-services">
                                {isMovieAvailable() && getAvailableProviders().map((item, i) => (
                                    <img key={i} alt="provider_logo" title={item.provider_name}
                                        src={'https://image.tmdb.org/t/p/w500' + item.logo_path}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ExpandedMovieInfo;
