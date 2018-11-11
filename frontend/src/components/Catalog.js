import React from 'react'
import { Grid, List, Header, Select } from 'semantic-ui-react'
import { Route } from 'react-router-dom';

import CatalogItem from '../components/CatalogItem';
import CatalogItemPreview from "../components/CatalogItemPreview";
import queryString from 'query-string';

import { getCatalog } from "../util/ApiUtil";

import '../styles/Catalog.css';

class Catalog extends React.Component {
    state = { 
        catalog: null,
        type: '',
        query: '',
        order: '',
        direction: '',
     };

    componentDidMount = async () => {
        try {
            const { match: { params : { type } }, location: { search } } = this.props;
            const { query, order, direction } = queryString.parse(search);
            const { data } = await getCatalog(type, query, order, direction);
            this.setState({ 
                catalog: data,
                type: type ? type : '',
                query: query ? query : '',
                order: order ? order : 'title',
                direction: direction ? direction : 'asc',
            });
        } catch (error) {

        }
    }

    componentDidUpdate = async (prevProps) => {
        if (this.props.location.search !== prevProps.location.search) {
            const { match: { params: { type } }, location: { search } } = this.props;
            const { query, order, direction } = queryString.parse(search);
            const { data } = await getCatalog(type, query, order, direction);
            console.log(data)
            this.setState({ 
                catalog: data,
                type: type ? type : '',
                query: query ? query : '',
                order: order ? order : 'title',
                direction: direction ? direction : 'asc',
            });
        }
    }

    handleDropdownChange = (e, { name, value }) => {
        const { type, query } = this.state;
        let order, direction;
        switch (value) {
            case 'Oldest': 
                order = 'date';
                direction = 'asc';
                break;
            case 'Newest':
                order = 'date';
                direction = 'desc';
                break;
            case 'A-Z':
                order = 'title';
                direction = 'asc';
                break;
            case 'Z-A':
                order = 'title';
                direction = 'desc';
                break;
            default:
        }
        console.log(this.props.location)
        this.props.history.push(`/catalog/${type}?query=${query}&order=${order}&direction=${direction}`);
    }
    
    handlePostDelete = (id) => {
        this.setState(({ catalog }) => ({
            catalog: catalog.filter(item => item.id !== id)
        }), () => {
            this.props.history.push('/catalog');
        });
    }

    renderCatalogItem = (props) => {
        return <CatalogItem {...props} handlePostDelete={this.handlePostDelete}/>;
    }
    
    render() {
        const options = [
            { text: 'Oldest', value: 'Oldest',  },
            { text: 'Newest', value: 'Newest' },
            { text: 'A-Z', value: 'A-Z' },
            { text: 'Z-A', value: 'Z-A' },
        ];

        const { match, location } = this.props;
        const { catalog } = this.state;
        return (
            <div style={{
                display: 'inline-block',
                width: '100%',
                marginTop: '4em',
                padding: '0 1em' }}>
                    <Header 
                        as='h1' 
                        color='teal' 
                        textAlign='left' 
                        style={{ display: 'inline-block', margin: '1em 0', width: 'fit-content'}}>
                        Catalog
                    </Header>
                    <Select  
                        name='direction'
                        options={options} 
                        placeholder='Order By'
                        onChange={this.handleDropdownChange}
                        style={{ position: 'absolute', right: 0, margin: '2em'}}/>
                <Grid textAlign='center' stackable>
                    <Grid.Column width={location.pathname.match(/^\/catalog(\/(book|magazine|movie|music))?\/?$/) ? 16 : 10} floated="left">
                        <List 
                            className="catalog-list"
                            style={{ margin: '0 auto', overflowY: 'auto' }} 
                            celled>
                            {
                                catalog && catalog.map((catalogItem) => {
                                    return  <CatalogItemPreview key={catalogItem.id} item={catalogItem}/>
                                })
                            }
                        </List>
                    </Grid.Column>
                    <Grid.Column width={location.pathname.match(/^\/catalog\/(book|magazine|movie|music)\/\d+/) ? 6 : null}>
                            <Route 
                                path={`${match.path}/:type(book|magazine|movie|music)/:id(\\d+)`} 
                                render={this.renderCatalogItem}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Catalog;
