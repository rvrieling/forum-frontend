import React from 'react'
import { Link } from "react-router-dom"
import "./header.scss"
import Echo from "laravel-echo/dist/echo";
import Socketio from "socket.io-client";
import enviroment from '../../env/enviroment'
import Fetch from '../../env/Fetch';


export default class Header extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            LoggedIn: false, 
            Button: 'Popular',
            Menu: 'Hide',
            width: '0px',
            padding: '0px 0px 0px 0px',
            chat: false,
            message: '',
            user_name: '',
            username: '',
            user_image: '',
            room_name: '',
            popup: false,
        }

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

        this.user_id = localStorage.getItem('user_id')

        this.username = localStorage.getItem('username')

        echo.private(`user.notification.${this.user_id}`).listen(`.new.user.notification.${this.user_id}`, e => {
            if (!/^\/chats/.test(location.pathname)) {
                this.setState({ 
                    chat: true, 
                    popup: true,
                    username: e.user_name, 
                    user_image: e.user_image,
                    room_name: e.room_name,
                    message: e.message,
                })
                audio.play()
            }
        })
    }

    componentDidMount() {
        this.setState({
            LoggedIn: this.props.logged,
            Button: localStorage.getItem('sort_by')
        })
    }

    button(sort_by) {
        localStorage.setItem('sort_by', sort_by)
        this.setState({
            Button: sort_by
        })

        let bodyData = JSON.stringify({
            sort_by: sort_by
        })

        Fetch.post('settings/sort_by', bodyData).then(() =>  window.location.reload())
    }

    SideMenu(menu) {
        this.setState({
            Menu: menu,
            width: menu == 'show' ? '200px' : '0px',
            padding: menu == 'show' ? '0px 0px 0px 150px' : '0px 0px 0px 0px'
        })
    }

    removePopup() {
        setTimeout(() => {
            this.setState({
                popup: false
            })
        }, 5000)
    }

    handleLogout() {
        Fetch.post('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('username')
        localStorage.removeItem('user_id')
        window.location.reload()
    }

    render() {
        return(
            <div className="nav-bar">
                <div className="icons">
                    {this.state.Menu == 'show' ? 
                        <i onClick={() => this.SideMenu('show')} className="material-icons icon main-blue hidden">menu</i> 
                        : 
                        <i onClick={() => this.SideMenu('show')} className="material-icons icon hover-green main-blue">menu</i>
                        
                    }
                    {this.state.chat === true ? 
                        <div className="green-dot main-green-bg green-dot-active"></div> 
                        : 
                        <div className="green-dot main-green-bg"></div>
                    }
                    
                </div>
                {this.state.Menu == 'show' ? 
                    <div className="hide-page"></div>
                    :
                    <div className="hide-page page-hidden"></div>
                }
                {this.state.Menu == 'show' ? 
                    <div className="side-menu width main-white-bg">
                        <div className="side-icon">
                            <i onClick={() => this.SideMenu('Hidden')} className="material-icons icon hover-green main-blue">close</i>
                        </div>
                        <div className="links">
                            <Link to="/" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Posts</Link>
                            <Link to="/categories" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Categories</Link>
                            {this.state.LoggedIn === true ? 
                                <div className="logged">
                                    <Link to={`/profile/${this.username}`} className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Profile</Link>
                                    <Link to="/chats" className="link  main-blue hover-green" onClick={() => this.setState({ chat: false, Menu: 'hidden' })}>Chats
                                    {this.state.chat === true ? 
                                        <div className="green-dot main-green-bg green-dot-active"></div> 
                                        : 
                                        <div className="green-dot main-green-bg"></div>
                                    }
                                    </Link>
                                    <Link to="/settings" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Settings</Link>
                                    <Link to="/" onClick={() => {this.handleLogout(), this.setState({ Menu: 'hidden' })}} className="link  main-blue hover-green" >Logout</Link>
                                </div>
                                :
                                <div className="login">
                                    <Link to="/login" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Login</Link>
                                    <Link to="/register" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Register</Link>
                                </div>
                            }
                        </div>
                        
                    </div>
                    
                    :
                    <div className="side-menu main-white-bg">
                        <div className="side-icon">
                            <i onClick={() => this.SideMenu('Hidden')} className="material-icons icon hover-green main-blue">close</i>
                        </div>
                        <div className="links">
                            <Link to="/" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Posts</Link>
                            <Link to="/categories" className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Categories</Link>
                            {this.state.LoggedIn === true ? 
                                <div className="logged">
                                    <Link to={`/profile/${this.username}`} className="link  main-blue hover-green" onClick={() => this.setState({ Menu: 'hidden' })}>Profile</Link>
                                    <Link to="/chats" className="link  main-blue hover-green" onClick={() => this.setState({ chat: false, Menu: 'hidden' })}>Chats
                                    {this.state.chat === true ? 
                                        <div className="green-dot main-green-bg green-dot-active"></div> 
                                        : 
                                        <div className="green-dot main-green-bg"></div>
                                    }
                                    </Link>
                                    <Link to="/settings"  onClick={() => this.setState({ Menu: 'hidden' })} className="link  main-blue hover-green">Settings</Link>
                                    <Link to="/" onClick={() => {this.handleLogout(), this.setState({ Menu: 'hidden' })}} className="link  main-blue hover-green">Logout</Link>
                                </div>
                                :
                                <div className="login">
                                    <Link to="/login" onClick={() => this.setState({ Menu: 'hidden' })} className="link  main-blue hover-green">Login</Link>
                                    <Link to="/register" onClick={() => this.setState({ Menu: 'hidden' })} className="link  main-blue hover-green">Register</Link>
                                </div>
                            }
                        </div>
                    </div>
                }
                {this.state.popup == true ? 
                <div className="popup-container active main-blue-bg">
                    <div className="top">
                        <Link to={`/profile/${this.state.username}`}><img src={`${enviroment.api}/user/image/${this.state.user_image}`} /></Link>
                        <div className="text">
                            <p className=" main-blue">New Message in: <Link to={`/chats/${this.state.room_name}`} className=" main-blue hover-green">{this.state.room_name}</Link> </p>
                            <p className=" main-blue">By: <Link to={`/profile/${this.state.username}`} className=" main-blue hover-green">{this.state.username}</Link></p>
                        </div>
                    </div>
                    <div className="message  main-blue">
                        <p>{this.state.message.substring(0,90)} <Link to={`/chats/${this.state.room_name}`} className=" main-blue hover-green">read more..</Link></p>
                    </div>
                    {this.removePopup()}
                </div> 
                
                :
                <div className="popup-container main-blue-bg">
                    <div className="top">
                        <Link to={`/profile/${this.state.username}`}><img src={`${enviroment.api}/user/image/${this.state.user_image}`} /></Link>
                        <div className="text">
                            <p className=" main-blue">New Message in: <Link to={`/chats/${this.state.room_name}`} className=" main-blue hover-green">{this.state.room_name}</Link> </p>
                            <p className=" main-blue">By: <Link to={`/profile/${this.state.username}`} className=" main-blue hover-green">{this.state.username}</Link></p>
                        </div>
                    </div>
                    <div className="message  main-blue">
                        <p>{this.state.message.substring(0,90)} <Link to={`/chats/${this.state.room_name}`} className=" main-blue hover-green">read more..</Link></p>
                    </div>
                 </div>
                }
                
                <div className="title-button">
                    {this.state.Menu == 'show' ? 
                        <div className="title padding">
                            <Link to="/" onClick={() => this.setState({ Menu: 'hidden' })} className="main-blue hover-green">Gangshit</Link>
                        </div>
                        :
                        <div className="title">
                            <Link to="/" onClick={() => this.setState({ Menu: 'hidden' })} className="main-blue hover-green">Gangshit</Link>
                        </div>
                    }

                    {window.location.pathname == '/' ? this.state.Button == 'popular' ? 
                        this.state.Menu == 'show' ?
                            <div className="buttons buttons-hidden">
                                <button className="btn-sort active hover main-blue-bg" onClick={() => this.button('popular')}>Popular</button>
                                <div className="space"></div>
                                <button className="btn-sort hover main-blue-bg" onClick={() => this.button('new')}>Newest</button>
                            </div> 
                            :
                            <div className="buttons">
                                <button className="btn-sort active hover main-blue-bg" onClick={() => this.button('popular')}>Popular</button>
                                <div className="space"></div>
                                <button className="btn-sort hover main-blue-bg" onClick={() => this.button('new')}>Newest</button>
                            </div> 
                        :
                        this.state.Menu == 'show' ?
                            <div className="buttons buttons-hidden">
                                <button className="btn-sort hover main-blue-bg" onClick={() => this.button('popular')}>Popular</button>
                                <div className="space"></div>
                                <button className="btn-sort active main-blue-bg hover" onClick={() => this.button('new')}>Newest</button>
                            </div>
                            :
                            <div className="buttons">
                                <button className="btn-sort hover main-blue-bg" onClick={() => this.button('popular')}>Popular</button>
                                <div className="space"></div>
                                <button className="btn-sort active main-blue-bg hover" onClick={() => this.button('new')}>Newest</button>
                            </div>
                        :
                        <div></div>
                    }
                </div>
                {this.state.LoggedIn == true ? 
                    <div className="user-container">
                        <Link className="main-blue" to={`/profile/${this.username}`}>{localStorage.getItem('username')}</Link>
                        <div className="image-container">
                        <Link className="main-blue" to={`/profile/${this.username}`}><div className="user-image" style={{
                                backgroundImage: `url(${enviroment.api}/user/image/${this.user_id})`
                            }}></div></Link>
                        </div>
                    </div>
                    :
                    <div></div>
                }
            </div>
        )
    }
}