import React from 'react'
import "./register.scss"
import Fetch from '../../env/Fetch'
import {Redirect} from 'react-router-dom'

export default class Register extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            redirect: false
        }
    }

    handleRegister() {
        const username = this.state.username
        const email = this.state.email
        const password = this.state.password
        const confirmPassword = this.state.confirmPassword

        if(!username) {
            this.setState({
                error: 'Username cant be blank'
            })

            return 
        } else if(!email) {
            this.setState({
                error: 'E-mail cant be blank'
            })

            return 
        } else if(!password) {
            this.setState({
                error: 'Password cant be blank'
            })
             
            return 
        } else if(!confirmPassword) {
            this.setState({
                error: 'Confirm password cant be blank'
            })
            
            return 
        } else if(password !== confirmPassword) {
            this.setState({
                error: 'Passwords dont match'
            })

            return 
        } else if(email.includes('@') == false) {
            this.setState({
                error: 'E-mail given is not valid'
            })

            return
        } else {
            this.setState({
                error: ''
            })
        }

        let bodyData = JSON.stringify({
            user_name: username,
            email: email,
            password: password
        })
        Fetch.postWT('register', bodyData).then(e => {
            if(e == 406) {
                this.setState({
                    error: 'E-mail is already taken'
                })

                return 
            } else if(e == 226) {
                this.setState({
                    error: 'Username is already taken'
                })

                return 
            } 

            let data = JSON.stringify({
                user_or_email: username,
                password: password
            })

            Fetch.postWT('login', data).then(e => {
                localStorage.setItem('token', e.api_token)
                localStorage.setItem('username', e.user.user_name)
                localStorage.setItem('role', e.user.role)
                localStorage.setItem('user_id', e.user.id)

                window.location.reload()

                this.setState({
                    redirect: true
                })
            })
        })
    }

    handlKeyPress(e) {
        if(e.keyCode == 13) {
            this.handleRegister()
        }
    }

    render() {
        return (
            <div className="container">
                <div className="register main-white-bg">
                    <h4 className="main-blue title">Register</h4>
                    <input type="text" onChange={e => this.setState({ username: e.target.value })} onKeyDown={e => this.handlKeyPress(e)} placeholder="Username" />
                    <div className="space"></div>
                    <input type="text" onChange={e => this.setState({ email: e.target.value })} onKeyDown={e => this.handlKeyPress(e)} placeholder="E-mail" />
                    <div className="space"></div>
                    <input type="password" onChange={e => this.setState({ password: e.target.value })} onKeyDown={e => this.handlKeyPress(e)} placeholder="Password" />
                    <div className="space"></div>
                    <input type="password" onChange={e => this.setState({ confirmPassword: e.target.value })} onKeyDown={e => this.handlKeyPress(e)} placeholder="Confirm password" />
                    <div className="space"></div>
                    <button className="main-white main-blue-bg" onClick={() => this.handleRegister()}>Register</button>
                    <div className="error">
                        <p className="main-blue">{this.state.error}</p>
                    </div>
                    {
                        this.state.redirect == true ?
                            <Redirect to='/' />
                        :
                        <div></div>
                    }
                </div>
            </div>
        )
    }
}