import React from 'react';
import './ExampleMovieCard.css';
import Card from 'react-bootstrap/Card';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function ExampleMovieCard({ list }) {

    return (
        <Card id="example-movie-card">
            <Card.Header className="d-flex justify-content-center">
                {list === 'Favorites' && <MdFavorite className="example-card-img img-fluid"/>}
                {list === 'Watch List' && <IoMdEye className="example-card-img img-fluid"/>}
                {list === 'Watched' && <MdTaskAlt className="example-card-img img-fluid"/>}
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center">
                {list === 'Favorites' && <p>Your first favorite movie will be shown here</p>}
                {list === 'Watch List' && <p>Your first movie to watch will be shown here</p>}
                {list === 'Watched' && <p>Your first watched movie will be shown here</p>}
            </Card.Body>
        </Card>
    )
}

export default ExampleMovieCard;
