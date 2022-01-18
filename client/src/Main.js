import React, { useState } from 'react';
import './Main.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import List from './List';
import { IoMdEye } from 'react-icons/io';
import { MdFavorite, MdTaskAlt } from 'react-icons/md';

function Main({ user, addMovie }) {

    const [activeList, setActiveList] = useState("Favorites");

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="Favorites">
                        <Nav.Item>
                            <Nav.Link eventKey="Favorites" onClick={() => setActiveList("Favorites")} className="d-flex">
                                <p>Favorites</p>
                                <MdFavorite className="tabs-icon" />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Watch List" onClick={() => setActiveList("Watch List")} className="d-flex">
                                <p>Watch List</p>
                                <IoMdEye className="tabs-icon" />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Watched" onClick={() => setActiveList("Watched")} className="d-flex">
                                <p>Watched</p>
                                <MdTaskAlt className="tabs-icon" />
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Header>
                <Card.Body id="content-body">
                    {activeList === "Favorites" && <List user={user.email} list="Favorites" addMovie={addMovie} />}
                    {activeList === "Watch List" && <List user={user.email} list="Watch List" addMovie={addMovie} />}
                    {activeList === "Watched" && <List user={user.email} list="Watched" addMovie={addMovie} />}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Main;