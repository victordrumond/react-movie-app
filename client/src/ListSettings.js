import React, { useContext, useState } from 'react';
import './ListSettings.css';
import { UserContext } from './UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Requests } from './Requests';
import { BsFillGridFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';
import useWindowSize from './useWindowSize';
import { Helper } from './Helper';
import { Builder } from './Builder';

function ListSettings({ activeList, isListEmpty, layout, findItem, setFindItem }) {

    const { user, getAccessTokenSilently } = useAuth0();
    const context = useContext(UserContext);
    const width = useWindowSize().width;

    const listsConfig = context.userData.config.lists;
    const [currentLayout, setCurrentLayout] = useState('grid');

    const handleUpdateSorting = async (newSort) => {
        await getAccessTokenSilently().then(token => {
            Requests.setSorting(token, user, activeList, newSort).then(res => {
                context.setUserData(res.data);
            }).catch(err => {
                console.log(err);
            })
        });
    };

    const handleUpdateFiltering = async (filter, value) => {
        await getAccessTokenSilently().then(token => {
            Requests.setFiltering(token, user, activeList, filter, value).then(res => {
                context.setUserData(res.data);
            }).catch(err => {
                console.log(err);
            })
        });
    };

    const handleUpdateLayout = (value) => {
        setCurrentLayout(value);
        layout(value);
    };

    const getFilteringComponent = () => {
        return <Nav><NavDropdown id="filter-dropdown" title="Filter">
            <NavDropdown.Item>
                <Form.Check key={Math.random()} type="checkbox" className="filter-option" label='Movies' checked={Builder.getListFiltering(listsConfig, activeList).movies} onChange={(e) => handleUpdateFiltering('movies', e.target.checked)} />
            </NavDropdown.Item>
            <NavDropdown.Item>
                <Form.Check key={Math.random()} type="checkbox" className="filter-option" label='TV Shows' checked={Builder.getListFiltering(listsConfig, activeList).tvShows} onChange={(e) => handleUpdateFiltering('tvShows', e.target.checked)} />
            </NavDropdown.Item>
        </NavDropdown></Nav>
    }

    const getSortingComponent = () => {
        return <Nav><NavDropdown id="sort-dropdown" title="Sort">
            {Builder.getFilters().map((filter, index) => (
                <NavDropdown.Item key={index} className="sort-option" onClick={() => handleUpdateSorting(filter)}>
                    {Builder.getListSorting(listsConfig, activeList) === filter ? <b>{Helper.getDenormalizeName(filter)}</b> : Helper.getDenormalizeName(filter)}
                </NavDropdown.Item>
            ))}
        </NavDropdown></Nav>
    }

    const getSearchComponent = () => {
        return <Form.Control id="search-list" type="search"
            placeholder={`Find on ${Builder.getListName(activeList)}`}
            value={findItem}
            onChange={e => {
                setFindItem(e.target.value);
            }}
        />
    }

    const getChangeLayoutComponent = () => {
        return <div className="d-flex align-items-center">
            {currentLayout === 'grid' &&
                <BsFillGridFill className="list-layout-icon" onClick={() => handleUpdateLayout('list')} />
            }
            {currentLayout === 'list' &&
                <FaListUl className="list-layout-icon" onClick={() => handleUpdateLayout('grid')} />
            }
        </div>
    }

    return (
        <Container className="m-0 p-0">
            <Navbar>
                {isListEmpty &&
                    <div id="empty-list-config">
                        <p>Use the search bar to find a movie or TV show</p>
                    </div>
                }
                {!isListEmpty &&
                    <Navbar.Collapse className="d-flex justify-content-between">
                        {width < 576 &&
                            <div className="d-flex flex-column mt-2 w-100">
                                {getSearchComponent()}
                                <div className="d-flex w-100 justify-content-between">
                                    <div className="d-flex">
                                        {getFilteringComponent()}
                                        {getSortingComponent()}
                                    </div>
                                    {getChangeLayoutComponent()}
                                </div>
                            </div>
                        }
                        {width > 575 &&
                            <div className="d-flex w-100 justify-content-between">
                                <div className="d-flex">
                                    {getFilteringComponent()}
                                    {getSortingComponent()}
                                </div>
                                <div className="d-flex">
                                    {getSearchComponent()}
                                    {getChangeLayoutComponent()}
                                </div>
                            </div>
                        }
                    </Navbar.Collapse>
                }
            </Navbar>
        </Container>
    );
};

export default ListSettings;
