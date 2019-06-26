import React from 'react'

export default class Token extends React.Component {

    token(){
        let login = localStorage.getItem('token')

        return login
    }
}
