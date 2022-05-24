import React from 'react';
// import './ExampleMovieCard.css';
import Card from 'react-bootstrap/Card';
// import { IoMdEye } from 'react-icons/io';
// import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function ExampleMovieCard({ list }) {

    return (
        <Card id="movie-card">
            {window.innerWidth < 400
                ? <Card.Img
                    variant="top"
                    src={"https://st2.depositphotos.com/3765753/5349/v/450/depositphotos_53491489-stock-illustration-example-rubber-stamp-vector-over.jpg"}
                    className="card-img img-fluid"
                />
                : <Card.Img
                    variant="top"
                    src={"https://st2.depositphotos.com/3765753/5349/v/450/depositphotos_53491489-stock-illustration-example-rubber-stamp-vector-over.jpg"}
                    className="card-img img-fluid"
                />
            }
            <Card.Body>
                <p>EXAMPLE CARD</p>
            </Card.Body>
        </Card>
    );
};

export default ExampleMovieCard;
