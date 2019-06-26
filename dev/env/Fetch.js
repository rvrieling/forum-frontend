import enviroment from './enviroment' 
import fetch from 'unfetch'
import Token from './token'
const get = async (url) => {
    const res = await fetch(`${enviroment.api}/${url}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
}

const getToken = async (url) => {
    const token = await new Token().token()
    const res = await fetch(`${enviroment.api}/${url}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
}

const post = async (url, bodyData) => {
    const token = await new Token().token()
    const res = await fetch(`${enviroment.api}/${url}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: bodyData
    })
    return await res.json()
}

const postWT = async (url, bodyData) => {
    const res = await fetch(`${enviroment.api}/${url}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: bodyData
    })
    return await res.json()
}

export default {
    get,
    getToken,
    post,
    postWT
}
