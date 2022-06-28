import React from 'react';
import './ExampleMovieCard.css';
import Card from 'react-bootstrap/Card';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function ExampleMovieCard({ list, isReallyEmpty }) {

    const getIconComponent = (list) => {
        if (list === 'favorites') return <MdFavorite className="example-card-img img-fluid" />;
        if (list === 'watchList') return <RiFileListLine className="example-card-img img-fluid" />;
        if (list === 'watching') return <IoMdEye className="example-card-img img-fluid" />;
        if (list === 'watched') return <MdTaskAlt className="example-card-img img-fluid" />;
    }

    const getDescriptionComponent = (list) => {
        if (list === 'favorites') return <p>Add your favorite movies and shows to this list</p>;
        if (list === 'watchList') return <p>Here you can keep track of what you want to watch</p>;
        if (list === 'watching') return <p>Here you can keep track of what you're currently watching</p>;
        if (list === 'watched') return <p>Add the movies and shows you already watched to this list</p>;
    }

    return (
        <Card id="example-movie-card">
            {!isReallyEmpty &&
                <Card.Body className="d-flex flex-column justify-content-center">
                    <p>You have hidden items on {list}</p>
                </Card.Body>
            }
            {isReallyEmpty &&
                <Card.Body className="d-flex flex-column justify-content-center">
                    <div className="d-flex flex-column align-items-center">
                        {getIconComponent(list)}
                        {getDescriptionComponent(list)}
                    </div>
                </Card.Body>
            }
        </Card>
    )
}

export default ExampleMovieCard;
