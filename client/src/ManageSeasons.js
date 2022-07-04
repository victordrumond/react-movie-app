import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './ManageSeasons.css';
import Badge from 'react-bootstrap/Badge';
import { UserContext } from './UserContext';
import { Builder } from './Builder';
import { Requests } from './Requests';

function ManageSeasons({ show, list }) {

    const context = useContext(UserContext);
    const { user, getAccessTokenSilently } = useAuth0();

    const handleSelectSeason = async (season) => {
        await getAccessTokenSilently().then(token => {
            Requests.manageSeasons(token, user, show.item.id, list, season).then(res => {
                context.setUserData(res.data);
            }).catch(err => {
                console.log(err);
            })
        })
    }

    const getSeasonBarColor = (season) => {
        return Builder.isSeasonSelectedOnList(context.userData, show.item.id, list, season) ? 'primary' : 'colorNR';
    }

    const getDescriptionComponent = (list) => {
        if (list === 'favorites') return <p id="manage-seasons-title">Favorite seasons:</p>;
        if (list === 'watchList') return <p id="manage-seasons-title">Seasons to watch:</p>;
        if (list === 'watching') return <p id="manage-seasons-title">Watching seasons:</p>;
        if (list === 'watched') return <p id="manage-seasons-title">Watched seasons:</p>;
    }

    return (
        <div id="manage-seasons">
            {getDescriptionComponent(list)}
            <div id="seasons-container" className="d-flex">
                {[...Array(show.item.number_of_seasons)].map((e, i) => (
                    <Badge key={i} className="season-badge" pill bg={getSeasonBarColor(i + 1)} onClick={() => handleSelectSeason(i + 1)}>
                        {Builder.getSeasonCode(i + 1)}
                    </Badge>
                ))}
            </div>
        </div>
    )
}

export default ManageSeasons;
