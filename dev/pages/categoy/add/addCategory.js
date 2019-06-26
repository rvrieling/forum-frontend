import React from 'react'
import './addCategory.scss'
import Fetch from '../../../env/Fetch';
import {Redirect} from 'react-router-dom'

export default class AddCategory extends React.Component{ 
    constructor(props){
        super(props)

        this.state = {
            name: '',
            error: '',
            redirect: false
        }
    }

    handleAdd() {
        const name = this.state.name

        if(!name) {
            this.setState({
                error: 'The name field cant be blank'
            })
            return 
        }

        let bodyData = JSON.stringify({
            name: name
        })

        Fetch.post('categories/create', bodyData).then(e => {
            if(e == 401) {
                this.setState({
                    error: 'You are not allowed to make a category'
                })
            } else if (e == 201) {
                this.setState({
                    redirect: true
                })
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="add-container main-blue-bg">
                    <input type="text" onChange={e => this.setState({ name: e.target.value })} placeholder="Name of new category"/>
                    <div className="space"></div>
                    <button onClick={() => this.handleAdd()}>Add category</button>
                    <div className="space"></div>
                    <p>{this.state.error}</p>
                    {this.state.redirect == true ?
                        <Redirect to="/categories" />
                        :
                        <div></div>
                    }
                </div>
            </div>
        )
    }
}