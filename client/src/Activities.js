import React, { useState, useEffect, useContext } from 'react';
import './Activities.css';
import coverNotFound from './cover-not-found.png';
import { UserContext } from './UserContext';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { Activity } from './Activity';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { AiFillStar } from 'react-icons/ai';
import { CgTrash } from 'react-icons/cg';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function Activities() {

    const context = useContext(UserContext);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        let activities = [];
        for (const activity of context.userData.activities) {
            activities.push(new Activity(activity.label, activity.data, activity.timestamp));
        }
        setActivities(activities);
    }, [context]);

    return (
        <Container id="activities-container">
            {activities.length === 0 &&
                <p id="no-activities">No recent activities to show</p>
            }
            {activities.length > 0 && activities.map((activity, index) => (
                <Alert key={index} className="activity d-flex">
                    <img className="activity-img" src={activity.getImageUrl() || coverNotFound} alt="" />
                    <div className="w-100 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between">
                            {activity.getLabel() === 'movie_deleted' &&
                                <CgTrash className='activity-icon trash' />}
                            {activity.getLabel() === 'movie_added' && activity.getList() === 'favorites' &&
                                <MdFavorite className='activity-icon favorites' />}
                            {activity.getLabel() === 'movie_added' && activity.getList() === 'watchList' &&
                                <RiFileListLine className='activity-icon watchList' />}
                            {activity.getLabel() === 'movie_added' && activity.getList() === 'watching' &&
                                <IoMdEye className='activity-icon watching' />}
                            {activity.getLabel() === 'movie_added' && activity.getList() === 'watched' &&
                                <MdTaskAlt className='activity-icon watched' />}
                            {activity.hasRating() &&
                                <AiFillStar className='activity-icon rating' />}
                            <p className="activity-time text-muted">{activity.getTimeString()}</p>
                        </div>
                        <p className="activity-description">{activity.getDescription()}</p>
                    </div>
                </Alert>
            ))
            }
        </Container>
    );
};

export default Activities;
