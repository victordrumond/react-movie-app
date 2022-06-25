import React, { useState, useEffect, useMemo } from 'react';
import './ExpandedTvShowInfo.css';
import backdropNotFound from './backdrop-not-found.png';
import coverNotFound from './cover-not-found.png';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { TvShow } from './TvShow';
import { Helper } from './Helper';
import useWindowSize from './useWindowSize';

function ExpandedTvShowInfo({ tvShowObj, country, hide }) {

    const show = useMemo(() => new TvShow(tvShowObj, ''), [tvShowObj]);
    const width = useWindowSize().width;

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [watchData, setWatchData] = useState(show.getWatchServices());
    const [selectedCountry, setSelectedCountry] = useState(country);
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

    const isAvailable = () => {
        return !(watchData.length === 0);
    }

    const getAvailableServicesOnCountry = () => {
        for (const watchService of watchData) {
            if (watchService.country === selectedCountry && watchService.services['flatrate'].length > 0) {
                return watchService.services['flatrate'];
            }
        }
        for (const watchService of watchData) {
            if (watchService.country === 'US' && watchService.services['flatrate'].length > 0) {
                return watchService.services['flatrate'];
            }
        }
        for (const watchService of watchData) {
            if (watchService.services['flatrate'].length > 0) {
                return watchService.services['flatrate'];
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
                    {width > 399
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
                            <Badge bg={Helper.getScoreBarColor(show.getAverageRating())}>
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
                        <div className="d-flex justify-content-start">
                            <p><b>Streaming:</b></p>
                            {isAvailable() &&
                                <Form.Select id="country-select" size="sm" defaultValue={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                    {watchData.map((item, i) => (
                                        <option key={i} value={item.country}>{item.country}</option>
                                    ))}
                                </Form.Select>
                            }
                        </div>
                        <div id="watch-services" className="d-flex justify-content-start">
                            {!isAvailable() &&
                                <p>Not available for streaming in any country at the moment</p>
                            }
                            {isAvailable() && getAvailableServicesOnCountry().map((item, i) => (
                                <img
                                    key={i} src={'https://image.tmdb.org/t/p/w500' + item.logo_path}
                                    alt="provider_logo" title={item.provider_name}
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
                    {show.getSeasons().map((item, i) => (
                        <option key={item.season_number} value={item.season_number}>Season {item.season_number}</option>
                    ))}
                </Form.Select>
            </Modal.Footer>
        </Modal>
    )
}

export default ExpandedTvShowInfo;
