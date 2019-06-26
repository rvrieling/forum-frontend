import React from 'react'
import Fetch from '../../env/Fetch';
import './category.scss'
import {Link} from 'react-router-dom'

export default class Category extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cats: [],
            filterCats: [],
            token: ''
        }

        this.getCat()
    }

    getCat() {
        const token = localStorage.getItem('token')

        if(token == 'not logged in') {
            Fetch.get('categories').then(e => {
                this.setState({
                    cats: e,
                    filterCats: e,
                    token: token
                })
            })
        } else {
            Fetch.getToken('categories').then(e => {
                this.setState({
                    cats: e,
                    filterCats: e,
                    token: token
                })
            })
        }
    }

    handleSearch(value) {
        const cats = this.state.cats
        const text = value.toLowerCase()
        const filter = cats.filter(v => v.name.toLowerCase().includes(text))

        this.setState({
            filterCats: filter
        })
    }

    renderCats() {
        return this.state.filterCats.map((cat, key) => (
            <div className="cat" key={key}>
                <div className="categories">
                    <Link className="main-blue" to={`/categories/${cat.id}`}>{cat.name}</Link>
                </div>
                <div className="space"></div>
            </div>
        ))
    }

    handleSub(sub, key, cat_id) {
        const cats = this.state.filterCats
        
        cats[key].subs[0].subscribed = sub

        this.setState({
            filterCats: cats
        })

        let bodyData = JSON.stringify({
            category_id: cat_id,
            subscribed: sub
        })

        Fetch.post('subs/update', bodyData)
    }

    renderCatsLogged() {
        return this.state.filterCats.map((cat, key) => (
            <div className="cat" key={key}>
                <div className="categories">
                    <Link className="main-blue" to={`/categories/${cat.id}`}>
                        <p>{cat.name}</p>
                    </Link>
                    {cat.subs[0].subscribed == 0 ?
                        <button className="main-blue-bg" onClick={() => this.handleSub(1, key, cat.id)}>Subscribe</button>
                        :
                        <button className="main-blue-bg" onClick={() => this.handleSub(0, key, cat.id)}>Unsubscribe</button>
                    }
                </div>
                <div className="space"></div>
            </div>
        ))
    }

    render() {
        return(
            <div className="container">
                <div className="search">
                    <input type="text" placeholder="Search here for any category" onKeyUp={e => this.handleSearch(e.target.value)} />
                </div>
                {this.state.token == 'not logged in' ? 
                    <div className="categories-container">
                        {this.renderCats()}
                    </div>
                    :
                    <div className="categories-container">
                        {this.renderCatsLogged()}
                    </div>
                }
                {
                    localStorage.getItem('role') == 'admin' ?
                        <Link to="/categories/add" className="add main-blue-bg"><i className="fas fa-plus main-white"></i></Link>
                    :
                        <div></div>
                }
            </div>
        )
    }
}