import React from 'react';
import './UpdateItemsDocumentation.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function UpdateItemsDocumentation({ display, hide }) {

    return (
        <Modal id="" size="lg" show={display} onHide={() => hide(false)} centered animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Update data for a saved item
                </Modal.Title>
            </Modal.Header>
            <Modal.Body id="update-item-modal-body">
                <p>
                    The data displayed on the React Movie App comes from <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
                    TMDb</a>. This data is 100% user contributed and therefore it's constantly being updated. When
                    you first add a movie (or a TV show) to a list, the app saves its basic information as they are at
                    the moment.
                </p>
                <p>
                    For the vast majority of the more than 900,000 productions you can find, this basic information
                    does not change significantly over time. However, there are some cases for
                    which a data update can be necessary. For example, if you add a movie that has not been
                    yet released to your Watch List, it surely won't have an average score and it might be missing
                    important information such as the release date. This info will be updated on TMDb side at some 
                    point.
                </p>
                <p>
                   You can replace an item's saved data for the most up to date available one by selecting the item
                   on the dropdown list and clicking on <b>Update</b>. As of today the React Movie App can only
                   provide this one-by-one update method, but hopefully in the future a silent and automatic method
                   will be suported.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => hide(false)}>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default UpdateItemsDocumentation;
