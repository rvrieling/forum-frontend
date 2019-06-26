import React from 'react'
import "./login.scss"
import Fetch from '../../env/Fetch'
import {Redirect} from 'react-router-dom'

export default class login extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            error: '',
            redirect: false
        }
    }

    handleLogin() {
        const username = this.state.username
        const password = this.state.password

        if(!username) {
            this.setState({
                error: 'Username or E-mail cant be blank'
            })
        } else if(!password) {
            this.setState({
                error: 'Password cant be blank'
            })
        }

        const data = JSON.stringify({
            user_or_email: username,
            password: password
        })

        Fetch.postWT('login', data).then(e => {
            if(e == 203) {
                this.setState({
                    error: 'The combination of Username or e-mail and password are incorrect'
                })
            } else if(e == 404) {
                this.setState({
                    error: 'User does not exists'
                })
            } else {
                localStorage.setItem('token', e.api_token)
                localStorage.setItem('username', e.user.user_name)
                localStorage.setItem('user_id', e.user.id)
                localStorage.setItem('role', e.user.role)

                window.location.reload()

                this.setState({
                    redirect: true
                })
            }
        })
    }

    handleKeyPress(e) {
        if(e.keyCode == 13) {
            this.handleLogin()
        }
    }

    render() {
        return (
            <div className="container">
                <div className="inputs main-white-bg">
                    <h4 className="main-blue title">Login</h4>
                    <input className="input" onChange={e => {this.setState({ username: e.target.value })}} onKeyDown={e =>  this.handleKeyPress(e)} type="text"  placeholder="Username or E-mail"/>
                    <div className="space"></div>
                    <input className="input" onChange={e => this.setState({ password: e.target.value })} onKeyDown={e =>  this.handleKeyPress(e)} type="password" placeholder="Password" />
                    <div className="space"></div>
                    <button className="button" onClick={() => this.handleLogin()}>Login</button>
                    {
                        this.state.redirect === true ?
                        <Redirect to="/" />
                        :
                        <div></div>
                    }
                    <p className="main-blue error-message">{this.state.error}</p>
                </div>
            </div>
        )
    }
}