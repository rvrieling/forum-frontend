const express = require('express')

const path = require('path')

const app = express()


app.use(express.static('build'))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/chats', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/chats/:id', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/chats/new/room', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/categories', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/categories/add', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})

app.get('/profile/:id', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build/index.html'))
})


const port = 420;

app.listen(port, () => console.log('running on 420'))