import React from 'react';
import './ExampleMovieCard.css';
import Card from 'react-bootstrap/Card';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function ExampleMovieCard({ list }) {

    return (
        <Card id="example-movie-card">
            <Card.Body className="d-flex flex-column justify-content-center">
                {list === 'Favorites' &&
                    <div className="d-flex flex-column align-items-center">
                        <MdFavorite className="example-card-img img-fluid" />
                        <p>Your first favorite movie will be shown here</p>
                    </div>}
                {list === "Watch List" &&
                    <div className="d-flex flex-column align-items-center">
                        <IoMdEye className="example-card-img img-fluid" />
                        <p>Your first movie to watch will be shown here</p>
                    </div>}
                {list === "Watched" &&
                    <div className="d-flex flex-column align-items-center">
                        <MdTaskAlt className="example-card-img img-fluid" />
                        <p>Your first watched movie will be shown here</p>
                    </div>}
            </Card.Body>
        </Card>
    )
}

export default ExampleMovieCard;
