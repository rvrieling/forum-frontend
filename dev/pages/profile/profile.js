import React from 'react'
import './profile.scss'
import Fetch from '../../env/Fetch';
import enviroment from '../../env/enviroment';

export default class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            info: {},
            user: {}
        }

        this.username = null

        this.getProfile()
    }

    getProfile() {

        this.username = window.location.pathname.split('/')[2]

        Fetch.get(`profile?username=${this.username}`).then(data => {
            this.setState({ info: data, user: data.user })
            console.log(data)
        })
    }

    render() {
        return (
            <div className="container">
                <div className="profile-container main-white-bg">
                    <div className="profile-background-image" style={{ backgroundImage: `url(${enviroment.api}/profile/image/${this.username})`}}></div>
                    <div className="profile-image" style={{ backgroundImage: `url(${enviroment.api}/user/image/${this.state.info.user_id})`}}></div>
                    <div className="sub-container">
                        <div className="info-user-container">
                            <div className="user-container">
                                <h4>{ this.username }</h4>
                                <h4>{this.state.user.first_name}</h4>
                                <h4>{this.state.user.last_name}</h4>
                            </div>
                        </div>
                        <div className="bio-container">
                            <h4>{this.state.info.bio}</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}