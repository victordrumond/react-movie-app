import React, { useState, useEffect, useMemo } from 'react';
import './ExpandedTvShowInfo.css';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { TvShow } from './TvShow';
import { Helper } from './Helper';
import { Builder } from './Builder';
import useWindowSize from './useWindowSize';

function ExpandedTvShowInfo({ tvShowObj, country, hide }) {

    const width = useWindowSize().width;
    const show = useMemo(() => new TvShow(tvShowObj, '', 0), [tvShowObj]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [watchData, setWatchData] = useState(show.getWatchServices());
    const [viewSeason, setViewSeason] = useState("0");

    useEffect(() => {
        setViewSeason("0");
    }, [tvShowObj])

    useEffect(() => {
        setSelectedCountry(country);
    }, [country])

    useEffect(() => {
        setWatchData(show.getWatchServices());
        setShowInfoModal(true);
    }, [show])

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

    const isShowAvailable = () => {
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
        <Modal id="tvshow-modal" size="lg" show={showInfoModal} onHide={() => handleHide()} animation={true} centered={true} >
            <Modal.Header closeButton>
                {viewSeason === "0" &&
                    <Modal.Title>
                        {show.getReleaseYear(viewSeason) ? `${show.getTitle()} (${show.getYears(viewSeason)})` : show.getTitle()}
                    </Modal.Title>
                }
                {viewSeason > 0 &&
                    <Modal.Title>
                        {show.getReleaseYear(viewSeason) ? `${show.getTitle()} - Season ${viewSeason} (${show.getReleaseYear(viewSeason)})` : show.getTitle()}
                    </Modal.Title>
                }
            </Modal.Header>
            <Modal.Body id="modal-body" className="d-flex">
                <div>
                    {width > 575
                        ? <img className="modal-img" alt="tvshow_cover" src={show.getPosterPath(viewSeason) || coverNotFound} />
                        : <img className="modal-img img-fluid" alt="tvshow_cover" src={show.getBackdropPath() || backdropNotFound} />
                    }
                </div>
                <div id="modal-info">
                    {viewSeason === '0' &&
                        <div id="modal-stats" className="d-flex justify-content-between">
                            <p>{`Status: ${show.getStatus()}`}</p>
                            <p>{show.getNumberOfSeasons()}</p>
                            <p>{show.getParentalRating(selectedCountry)}</p>
                            <Badge bg={Builder.getScoreBarColor(show.getAverageRating())}>
                                {show.getAverageRating() === 'Not Rated' ? 'NR' : show.getAverageRating()}
                            </Badge>
                        </div>
                    }
                    {viewSeason > 0 &&
                        <div id="modal-stats" className="d-flex justify-content-between">
                            <p>{`${show.getNumberOfEpisodes(viewSeason)}`}</p>
                            <p>{`${Helper.getDateString(show.getReleaseDate(viewSeason))}`}</p>
                        </div>
                    }
                    <p id="modal-description">{show.getOverview(viewSeason)}</p>
                    <div id="modal-notes" className="d-flex flex-column">
                        <p><b>Genres: </b>{show.getGenres().length > 0 ? Helper.separateByComma(show.getGenres()) : 'not found'}</p>
                        <p><b>Starring: </b>{show.getCast().length > 0 ? Helper.separateByComma(show.getCast()) : 'not found'}</p>
                        <p><b>Created by: </b>{show.getCreators().length > 0 ? Helper.separateByComma(show.getCreators()) : 'not found'}</p>
                        <p><b>Network: </b>{show.getNetworks().length > 0 ? Helper.separateByComma(show.getNetworks()) : 'not found'}</p>
                    </div>
                    <div id="watch" className="d-flex flex-column">
                        <p><b>Watch:</b></p>
                        <div className="d-flex justify-content-start">
                            {isShowAvailable() &&
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
                            {isShowAvailable() &&
                                <Form.Select id="country-select" size="sm" defaultValue={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                    {watchData.map((item, i) => (
                                        <option key={i} value={item.country}>{item.country}</option>
                                    ))}
                                </Form.Select>
                            }
                        </div>
                        <div className="d-flex justify-content-start">
                            {!isShowAvailable() &&
                                <p>Not available in any country at the moment</p>
                            }
                            <div id="watch-services">
                                {isShowAvailable() && getAvailableProviders().map((item, i) => (
                                    <img key={i} alt="provider_logo" title={item.provider_name}
                                        src={'https://image.tmdb.org/t/p/w500' + item.logo_path}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <p><b>Season:</b></p>
                <Form.Select id="season-select" size="sm" defaultValue={viewSeason} onChange={(e) => setViewSeason(e.target.value)}>
                    <option key={0} value={0}>Overview</option>
                    {show.getSeasons().map((item, i) => (
                        <option key={item.season_number} value={item.season_number}>Season {item.season_number}</option>
                    ))}
                </Form.Select>
            </Modal.Footer>
        </Modal>
    )
}

export default ExpandedTvShowInfo;
