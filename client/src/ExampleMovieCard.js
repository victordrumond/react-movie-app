import React from 'react';
import './ExampleMovieCard.css';
import Card from 'react-bootstrap/Card';
import { IoMdEye } from 'react-icons/io';
import { RiFileListLine } from 'react-icons/ri';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function ExampleMovieCard({ list, isReallyEmpty }) {

    return (
        <Card id="example-movie-card">
            {!isReallyEmpty &&
                <Card.Body className="d-flex flex-column justify-content-center">
                    <p>You have hidden items on {list}</p>
                </Card.Body>
            }
            {isReallyEmpty &&
                <Card.Body className="d-flex flex-column justify-content-center">
                    {list === 'Favorites' &&
                        <div className="d-flex flex-column align-items-center">
                            <MdFavorite className="example-card-img img-fluid" />
                            <p>Add your favorite movies and shows to this list</p>
                        </div>}
                    {list === "Watch List" &&
                        <div className="d-flex flex-column align-items-center">
                            <RiFileListLine className="example-card-img img-fluid" />
                            <p>Here you can keep track of what you want to watch</p>
                        </div>}
                    {list === "Watching" &&
                        <div className="d-flex flex-column align-items-center">
                            <IoMdEye className="example-card-img img-fluid" />
                            <p>Here you can keep track of what you're currently watching</p>
                        </div>}
                    {list === "Watched" &&
                        <div className="d-flex flex-column align-items-center">
                            <MdTaskAlt className="example-card-img img-fluid" />
                            <p>Add the movies and shows you already watched to this list</p>
                        </div>}
                </Card.Body>
            }
        </Card>
    )
}

export default ExampleMovieCard;
