import React, { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from './UserContext';
import './Discover.css';
import coverNotFound from './cover-not-found.png';
import Container from 'react-bootstrap/Container';
import { Requests } from './Requests';
import { LocalStorage } from './LocalStorage';
import ExpandedMovieInfo from './ExpandedMovieInfo';
import ExpandedTvShowInfo from './ExpandedTvShowInfo';

function Discover() {

    const context = useContext(UserContext);
    const { getAccessTokenSilently } = useAuth0();

    const [trendingItems, setTrendingItems] = useState([]);
    const [infoData, setInfoData] = useState(null);
    const [showExpandedInfo, setShowExpandedInfo] = useState(false);

    useEffect(() => {
        if (LocalStorage.hasTrendingItems()) {
            setTrendingItems(LocalStorage.getTrendingItems());
        } else {
            Requests.getTrending().then(res => {
                setTrendingItems(res.data);
                LocalStorage.setTrendingItems(res.data);
            })
        }
    }, [])

    const showExpandedData = async (item) => {
        if (LocalStorage.hasExpandedItem(item.id, item.media_type)) {
            let movieObj = LocalStorage.getExpandedItem(item.id, item.media_type);
            if (movieObj) {
                item.media_type === 'movie' ? setInfoData([movieObj, 'movie']) : setInfoData([movieObj, 'tv']);
                setShowExpandedInfo(true);
            }
        } else {
            await getAccessTokenSilently().then(token => {
                Requests.getItemData(token, item).then(res => {
                    LocalStorage.setExpandedItem(res.data);
                    item.media_type === 'movie' ? setInfoData([res.data, 'movie']) : setInfoData([res.data, 'tv']);
                    setShowExpandedInfo(true);
                })
            })
        }
    }

    if (trendingItems.length === 0) {
        return <p>Loading...</p>
    } else {
        return (
            <Container id="discover-container" className="m-0 p-0">
                <h2>Find out what's trending</h2>
                <div id="trending-top" className="d-flex flex-column">
                    <h4>Top 10 Today</h4>
                    <div id="trending-top-img-container" className="d-flex">
                        {trendingItems.filter((item, index) => index < 10).map((item, index) => (
                            <img key={`t10-${index}`} className="img-fluid" alt="" onClick={() => showExpandedData(item)}
                                src={item.backdrop_path ? "https://image.tmdb.org/t/p/w1280" + item.backdrop_path : coverNotFound}
                            />
                        ))}
                    </div>
                </div>
                <div id="trending-movies" className="d-flex flex-column">
                    <h4>Trending Movies</h4>
                    <div id="trending-movies-img-container" className="d-flex">
                        {trendingItems.filter(item => item.media_type === 'movie').map((item, index) => (
                            <img key={`tm-${index}`} className="img-fluid" alt="" onClick={() => showExpandedData(item)}
                                src={item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : coverNotFound}
                            />
                        ))}
                    </div>
                </div>
                <div id="trending-shows" className="d-flex flex-column">
                    <h4>Trending TV Shows</h4>
                    <div id="trending-shows-img-container" className="d-flex">
                        {trendingItems.filter(item => item.media_type === 'tv').map((item, index) => (
                            <img key={`ts-${index}`} className="img-fluid" alt="" onClick={() => showExpandedData(item)}
                                src={item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : coverNotFound}
                            />
                        ))}
                    </div>
                </div>

                {showExpandedInfo && infoData[1] === 'movie' &&
                    <ExpandedMovieInfo
                        movieObj={infoData[0]}
                        country={context.userData.config.general.country}
                        display={showExpandedInfo}
                        hide={() => setShowExpandedInfo(false)}
                    />
                }
                {showExpandedInfo && infoData[1] === 'tv' &&
                    <ExpandedTvShowInfo
                        tvShowObj={infoData[0]}
                        country={context.userData.config.general.country}
                        display={showExpandedInfo}
                        hide={() => setShowExpandedInfo(false)}
                    />
                }
            </Container>
        )
    }

}

export default Discover;
