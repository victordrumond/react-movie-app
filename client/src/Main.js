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
    const [length, setLength] = useState(0);

    const getLengthFromList = (value) => {
        setLength(value);
    };

    return (
        <Container id="main-container">
            <Card className="d-flex flex-column">
                <Card.Header>
                    <Nav id="tabs-nav" variant="tabs" defaultActiveKey="Favorites" className="d-flex justify-content-between">
                        {window.innerWidth > 575 && window.innerWidth < 768 &&
                            <p id="list-stat">You have {length === 1 ? length + " movie" : length + " movies"} on {activeList}</p>
                        }
                        <div className="d-flex">
                            <Nav.Item>
                                <Nav.Link eventKey="Favorites" onClick={() => setActiveList("Favorites")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Favorites</p>}
                                    <MdFavorite className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Watch List" onClick={() => setActiveList("Watch List")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Watch List</p>}
                                    <IoMdEye className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Watched" onClick={() => setActiveList("Watched")} className="d-flex">
                                    {window.innerWidth > 575 && <p>Watched</p>}
                                    <MdTaskAlt className="tabs-icon" />
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        {window.innerWidth > 767 &&
                            <p id="list-stat">You have {length === 1 ? length + " movie" : length + " movies"} on {activeList}</p>
                        }
                        {window.innerWidth < 576 &&
                            <p id="list-stat">{activeList} - {length === 1 ? length + " movie" : length + " movies"}</p>
                        }
                    </Nav>
                </Card.Header>
                <Card.Body id="content-body">
                    {activeList === "Favorites" &&
                        <List
                            user={user.email}
                            list="Favorites"
                            addMovie={addMovie}
                            passDataToMain={getLengthFromList}
                        />}
                    {activeList === "Watch List" &&
                        <List
                            user={user.email}
                            list="Watch List"
                            addMovie={addMovie}
                            passDataToMain={getLengthFromList}
                        />}
                    {activeList === "Watched" &&
                        <List
                            user={user.email}
                            list="Watched"
                            addMovie={addMovie}
                            passDataToMain={getLengthFromList}
                        />}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Main;