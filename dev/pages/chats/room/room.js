import React from 'react'
import Fetch from '../../../env/Fetch';
import './room.scss'
import enviroment from '../../../env/enviroment';
import autosize from "autosize";
import Echo from "laravel-echo/dist/echo";
import Socketio from "socket.io-client";
var orderBy = require('lodash.orderby');

export default class Room extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            username: '',
            height: '10px',
            newMessage: '',
            chat_room_id: 0,
            user_id: 0,
            typing: false,
            typingUsername: 'admin',
            buttonTop: 0,
            currentPage: 1,
            lastPage: 1,
            lastKey: 0
        }

        this.getChatHistory()

        this.echo = new Echo({
            broadcaster: 'socket.io',
            host: `${enviroment.echo}:6001`,  
            client: Socketio,
            auth: {
                headers: {
                     'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            },
        });

        this.insert = undefined;

        this.subGroup = undefined;

        this.isFetching = false;

        this.scroll = true;

        this.scrollKey = false

        this.audio = new Audio('../assets/sounds/definite.mp3')

        this.lastMessage = undefined

        this.handleScroll()
    }

    scrollToBottom(){
        if(this.scroll) {
            this.messagesEnd.scrollIntoView();
        } else if (this.scrollKey) {
            this.lastMessage.scrollIntoView()
        }
      }
      
      componentDidMount() {
        let user_id = localStorage.getItem('user_id')

        this.echo.leave(`.new.user.notification.${user_id}`)

        this.scrollToBottom();
        setTimeout(() => {this.scroll = false, this.scrollKey = true}, 1000)
        this.setState({ 
            username: localStorage.getItem('username'),
            user_id: localStorage.getItem('user_id')
        })
        this.textarea.focus();
        autosize(this.textarea);

        this.id = window.location.pathname.split('/').slice('-1')[0]

        this.listen = this.echo.join(`chat.room.${this.id}`).listen(`.new.message.room.${this.id}`, info => {
            if (/^\/chats\/[0-9]+/.test(location.pathname)) {
                let body = {
                    user: {
                        id: info.user_id,
                        user_name: info.user_name,
                    },
                    message: info.message,
                    test: '1'
                }
                if(!info.user_name == this.state.username && document.hidden == true) {
                    this.audio.play()
                }

                const messages = this.state.messages

                this.state.messages.map((mes, key) => {
                    if(!mes.message == this.state.newMessage) {
                        this.setState({
                            messages: [...messages, body]
                        })
                    }
                })

                let readBody = JSON.stringify({
                    chat_room_id: this.id
                })
                
                Fetch.post('chat/rooms/read', readBody)
            }
        }).listenForWhisper('typing', (e) => {
            this.setState({
                typing: e.typing,
                typingUsername: e.username
            });
        })

        this.setState({
            buttonTop: this.insert.offsetHeight + 50
        })
      }

      componentWillUnmount() {
          this.echo.leave(`chat.room.${this.id}`)
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }

    getChatHistory() {
        let id = window.location.pathname.split('/').slice('-1')[0]

        Fetch.getToken(`chat/room/${id}`).then(e => {
            this.setState({
                messages: e.data,
                chat_room_id: id,
                currentPage: e.current_page,
                lastPage: e.last_page,
                lastKey: e.data.length - 1
            })
        })
    }

    renderMessages() {
        return orderBy(this.state.messages, ['created_at'], ['asc']).map((mes, key) => (
            <div className="message-container" key={key}>
                {mes.user.user_name == this.state.username ? 
                    <div className="message flex-end">
                        <div className="text-container text-container-flex-right main-white-bg">
                            <div className="text">
                                <p className="main-blue">{mes.message}</p>
                            </div>
                        </div>
                        <img src={`${enviroment.api}/user/image/${mes.user.id}`} />
                        <div ref={e => this.state.lastKey == key ? this.lastMessage = e : e}></div>
                    </div>
                    :
                    <div className="message">
                        <img src={`${enviroment.api}/user/image/${mes.user.id}`} />
                        <div className="text-container text-container-flex-right main-white-bg">    
                            <div className="username">
                                <h4 className="main-blue">{mes.user.user_name}:</h4>
                            </div>
                            <div className="text">
                                <p className="main-blue">{mes.message}</p>
                            </div>
                        </div>
                        <div ref={e => this.state.lastKey == key ? this.lastMessage = e : e}></div>
                    </div>
                }
            </div>
        ))
    }

    sendMessage(e) {
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            if(this.state.newMessage !== ''){
                e.preventDefault();

                let stateData = {
                    user: {
                        id: this.state.user_id,
                        user_name: this.state.username,
                    },
                    message: this.state.newMessage
                }

                this.textarea.value = ''

                autosize(this.textarea);

                this.setState({
                    messages: [...this.state.messages, stateData]
                })

                let postData = JSON.stringify({
                    chat_room_id: this.state.chat_room_id,
                    message: this.state.newMessage
                })

                Fetch.post('chat/room/create', postData)

                let data = JSON.stringify({
                    chat_room_id: this.state.chat_room_id
                })

                Fetch.post('chat/rooms/read', data)

                this.setState({
                    newMessage: ''
                })
            }
        } else if (e.e == 'send') {
            if(this.state.newMessage !== '') {
                let stateData = {
                    user: {
                        id: this.state.user_id,
                        user_name: this.state.username,
                    },
                    message: this.state.newMessage
                }

                this.textarea.value = ''

                this.setState({
                    messages: [...this.state.messages, stateData]
                })

                let postData = JSON.stringify({
                    chat_room_id: this.state.chat_room_id,
                    message: this.state.newMessage
                })

                Fetch.post('chat/room/create', postData)

                let data = JSON.stringify({
                    chat_room_id: this.state.chat_room_id
                })
                
                Fetch.post('chat/rooms/read', data)

                this.setState({
                    newMessage: ''
                })
            }
        }
        
    }

    handleWhisper() {
        if(this.timeout){clearTimeout(this.timeout)}
        this.listen.whisper('typing', {username: this.state.username, typing: true})

        this.timeout = setTimeout(() => {
            this.listen.whisper('typing', {username: this.state.username, typing: false})
        }, 600);
    }

    handleScroll() {
        setTimeout(() => this.subGroup.addEventListener('scroll', () => {
            if(this.subGroup.scrollTop < 3) {
                if(this.state.currentPage !== this.state.lastPage && !this.isFetching) {
                    this.isFetching = true

                    let id = window.location.pathname.split('/').slice('-1')[0]

                    Fetch.getToken(`chat/room/${id}?page=${this.state.currentPage + 1}`).then(e => {
                        this.setState({
                            messages: [...this.state.messages, ...e.data],
                            currentPage: e.current_page,
                            lastKey: this.state.messages.length - 1
                        }, () => {
                            setTimeout(() => {this.isFetching = false}, 1000)
                        })
                    })
                }
            }
        }), 1000)
    }

    render() {
        return(
            <div className="room-container">
                <div className="room" ref={e => this.insert = e}>
                    <div className="sub-room" ref={e => this.subGroup = e}>
                        {this.renderMessages()}
                        <div ref={(el) => { this.messagesEnd = el; }}></div>
                    </div>
                    {this.state.typing == true ?
                        <p className="typing">{this.state.typingUsername} is typing...</p>
                        :
                        <div></div>
                    }
                    <div className="input-container" >
                        <textarea 
                            className="input" 
                            placeholder="Type here your message..." 
                            ref={c => (this.textarea = c)} 
                            rows={1} 
                            defaultValue="" 
                            style={{ height: this.state.height }} 
                            onChange={e => this.setState({ newMessage: e.target.value })}
                            onKeyDown={e => this.sendMessage(e)}
                            onKeyUp={() => this.handleWhisper()}
                        />
                    </div>
                </div>
                <button className="button main-white main-blue-bg hover-green" onClick={() => this.sendMessage({ e: 'send' })} style={{
                    top: this.state.buttonTop
                }}><i className="fas fa-location-arrow"></i></button>
            </div>
        )
    }
}