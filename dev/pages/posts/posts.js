import React from 'react'
import { Link } from "react-router-dom"
import Fetch from '../../env/Fetch'
import './posts.scss'
import enviroment from '../../env/enviroment';

export default class Posts extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            posts: [],
            currentPage: 1,
            lastPage: 1,
            liked: false,
            token: '',
            username: '',
            role: '',
        }

        this.bottom = undefined

        this.isFetching = false

        this.handleScroll()
    }

    componentWillMount() {
        this.sort = localStorage.getItem('sort_by')

        if(localStorage.getItem('token') == 'not logged in') {
            Fetch.get(this.sort == 'new' ? `posts/new` :`posts`).then(data => (this.setState({ posts: data.data, currentPage: data.current_page, lastPage: data.lastPage })))
        } else {
            Fetch.getToken(`posts`).then(data => (this.setState({ posts: data.data, currentPage: data.current_page, lastPage: data.lastPage })))
        }

        this.setState({
            token: localStorage.getItem('token'),
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role')
        })

    }

    renderPosts() {
        return this.state.posts.map((post, key) => (
            <div key={key} className="post-container">
                <div className="side-post">
                    <div className="user-image" style={{
                        backgroundImage: `url(${enviroment.api}/user/image/${post.user_id})`
                    }}></div>
                    {this.state.token !== 'not logged in' ?
                        <div className="white-border" onClick={() => this.handleLike(key, post.id, post.likes_count, post.likes[0].liked == 1 ? 0 : 1)}>
                            <div className="icons">
                                <i className="far fa-heart"></i>
                                {post.likes[0].liked == 1 ?
                                    <i className="fas fa-heart liked active"></i>
                                    :
                                    <i className="fas fa-heart liked"></i>
                                }   
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
                <div className="content-post">
                    <div className="content-header">
                        <Link to={`/profile/${post.user.user_name}`}><p>{post.user.user_name}</p></Link>
                        <div className="dot"></div>
                        <Link to={`/catego.ries/${post.category_id}`}><p>{post.category.name}</p></Link>
                        <div className="dot"></div>
                        {(() => {
                            this.number = 10
                            this.text = ''
                            this.fixed = 0
                            if(post.likes_count >= 1000 && post.likes_count < 100000) {
                                this.number = 10000
                                this.text = 'K'
                                this.fixed = 1
                            } else if (post.likes_count >= 100000 && post.likes_count < 1000000) {
                                this.number = 10000
                                this.text ='K'
                                this.fixed = 1
                            } else if (post.likes_count >= 1000000 && post.likes_count < 100000000) {
                                this.number = 10000000
                                this.text = 'M'
                                this.fixed = 1
                            } else if (post.likes_count >= 100000000) {
                                this.number = 10000000
                                this.text = 'M'
                                this.fixed = 1
                            }
                        })
                        ()}
                        <p>{(Math.round(post.likes_count * 10) / this.number).toFixed(this.fixed)}{this.text} Likes</p>
                    </div>
                    <div className="grey-line"></div>
                    <div className="content-body">
                        {post.images.image !== null ? 
                            <div className="image" style={{
                                backgroundImage: `url(${enviroment.api}/posts/image/${post.id})`
                            }}></div>
                            :
                            <div></div>
                        }
                        <h2 className="title">{post.name}</h2>
                        <p className="content">{post.content}</p>
                    </div>
                </div>
            </div>
        ))
    }

    handleLike(key, post_id, likes_count,liked) {
        const post = this.state.posts

        post[key].likes[0].liked = liked

        if(liked == 1) {
            post[key].likes_count = likes_count + 1
        } else {
            post[key].likes_count = likes_count - 1
        }

        this.setState({
            posts: post
        })

        let bodyData = JSON.stringify({
            post_id: post_id,
            liked: liked
        })

        Fetch.post('likes/update', bodyData)
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop + window.innerHeight + 1000
            const bottom = this.bottom.offsetTop

            if(scrollTop > bottom) {
                if(localStorage.getItem('token') == 'not logged in') {
                    if(this.state.currentPage !== this.state.lastPage && !this.isFetching) {
                        this.isFetching = true
                        Fetch.get(this.sort == 'new' ? `posts/new?page=${this.state.currentPage + 1}` : `posts?page=${this.state.currentPage + 1}`).then(data => {
                            this.setState({ 
                                posts: [...this.state.posts, ...data.data], 
                                currentPage: data.current_page, 
                            }, () => {
                                setTimeout(() => {this.isFetching = false}, 1000)
                            })
                        })
                    }
                } else {
                    if(this.state.currentPage !== this.state.lastPage && !this.isFetching) {
                        this.isFetching = true
                        Fetch.getToken(`posts?page=${this.state.currentPage + 1}`).then(data => {
                            this.setState({ 
                                posts: [...this.state.posts, ...data.data], 
                                currentPage: data.current_page, 
                            }, () => {
                                setTimeout(() => {this.isFetching = false}, 1000)
                            })
                        })
                    }
                }
            }
        })
    }

    render() {
        return(
            <div className="body">
                {this.renderPosts()}
                <div className="bottom" ref={e => this.bottom = e}></div>
            </div>
        )
    }
}