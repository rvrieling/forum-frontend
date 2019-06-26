import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"
import Header from '../pages/header/header';
import './main.scss'
import Rooms from '../pages/chats/rooms/rooms';
import Room from '../pages/chats/room/room';
import login from '../pages/login/login';
import Register from '../pages/register/register';
import Category from '../pages/categoy/category';
import AddCategory from '../pages/categoy/add/addCategory';
import AddRoom from '../pages/chats/rooms/add/addRoom';
import Profile from '../pages/profile/profile';
import Posts from '../pages/posts/posts';

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false
        }
    }

    componentWillMount () {
        if(localStorage.getItem('token') == 'not logged in' || localStorage.getItem('token') == null) {
            localStorage.setItem('token', 'not logged in')
        } else {
            this.setState({
                loggedIn: true
            })
        }
    }
    render() {
        return (
            <Router>
                <div className="black">
                    <Header logged={this.state.loggedIn}/>
                    <Route path="/" exact component={Posts}/>
                    <Route path="/chats" exact  component={Rooms}/>
                    <Route path="/chats/:id" exact component={Room}/>
                    <Route path="/chats/new/room" exact component={AddRoom} />
                    <Route path="/login" component={login} />
                    <Route path="/register" component={Register} />
                    <Route path="/categories" exact component={Category} />
                    <Route path="/categories/add" component={AddCategory} />
                    <Route path="/profile/:id" component={Profile} />
                </div>
            </Router>
        )
    } 
}

ReactDOM.render(<Index />, document.getElementById('root'))