import React from 'react'
import Fetch from '../../../env/Fetch';
import './rooms.scss'
import enviroment from '../../../env/enviroment';
import { Link } from "react-router-dom"
import Echo from "laravel-echo/dist/echo";
import Socketio from "socket.io-client";
var orderBy = require('lodash.orderby');


export default class Rooms extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            chats: [],
            searchChats: []
        }

        this.ismounted = false

        this.getChats()

        let echo = new Echo({
            broadcaster: 'socket.io',
            host: `${enviroment.echo}:6001`,  
            client: Socketio,
            auth: {
                headers: {
                     'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            },
        });

        let audio = new Audio('../assets/sounds/definite.mp3')

        let user_id = localStorage.getItem('user_id')
        if(this.ismounted) {
            echo.private(`user.notification.${user_id}`).listen(`.new.user.notification.${user_id}`, e => {
                if (/^\/chats/.test(location.pathname)) {
                    const chats = this.state.chats
                    chats.map((room, key) => {
                        if(room.id == e.room_id){
                            this.updateState(key, e)
                        }
                    })

                    audio.play()
                }
            })
        }
    }

    componentDidMount() {
        this.ismounted = true
    }

    componentWillUnmount() {
        this.ismounted = false
    }

    updateState(key, e) {
        const chats = this.state.chats
        chats[key].most_recent_message = e.message
        chats[key].most_recent_user = e.user_name
        chats[key].updated_at = e.updated_at
        chats[key].users[0].is_read = 0

        this.setState({
            chats: chats
        })
    }

    getChats() {
        Fetch.getToken('chat/rooms').then(e => {
            this.setState({ 
                chats: e ,
                searchChats: e
            })
        })
    }

    markRead(room_id) {
        var bodyData = JSON.stringify({
            chat_room_id: room_id
        })

        Fetch.post('chat/rooms/read', bodyData)
    }

    renderChats() {
        
        return orderBy(this.state.searchChats, ['updated_at'], ['desc']).map((chat, key) => (
            <div className="chat-container main-white-bg" key={key}>
                <Link to={`/chats/${chat.id}`} onClick={() => this.markRead(chat.id)}>
                    <div className="chat">
                        <div className="img" style={{
                            backgroundImage: `url(${enviroment.api}/chat/rooms/image/${chat.image})`
                            }} ></div>
                        <div className="text">
                            <h3 className="group-name main-blue">{chat.name}</h3>
                            <div className="info"><h5 className="person main-blue">{chat.most_recent_user}:</h5> <p className="main-blue">{chat.most_recent_message}</p></div>
                        </div>
                    </div>
                    {chat.users[0].is_read === 0 ? 
                        <div className="green-dot main-blue-bg opacity"></div>
                        :
                        <div className="green-dot main-blue-bg"></div>
                    }
                </Link>
            </div>
        ))
    }

    handleSearch(v) {
        const chats = this.state.chats
        const text = v.toLowerCase()
        const filter = chats.filter(v => v.name.toLowerCase().includes(text))

        this.setState({
            searchChats: filter
        })
    }

    render() {
        return (
            <div className="rooms">
                <div className="search">
                    <input type="text" placeholder="Search for a group" onKeyUp={e => this.handleSearch(e.target.value)}/>
                </div>
                {this.renderChats()}
                <div className="add-chat">
                    <Link to="/chats/new/room"><i className="fas fa-plus main-blue"></i></Link>
                </div>
            </div>
        )
    }
}