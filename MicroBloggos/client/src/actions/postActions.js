import axios from 'axios';
import {
    ADD_POST,
    GET_POSTS,
    LOADING_POSTS,
    DELETE_POST,
    GET_ERRORS
} from '../constants';

export const loadPosts = () => dispatch => {
    return {
        type: LOADING_POSTS
    }
}

export const getPostById = (postId) => dispatch => {
    dispatch(loadPosts())
    axios.get('http://localhost:5000/api/users/find/', postId)
        .then(res => dispatch({
            type: GET_POSTS,
            payload: res.data
        }))
        .catch(err => console.log(err))
}

export const addPost = postData => dispatch => {
    axios.post('http://localhost:5000/api/posts/add', postData)
        .then(res => dispatch({
            type: ADD_POST,
            payload: res.data
        }))
        .catch(err => console.log(err))
}

export const deletePost = postData => dispatch => {
    axios.post('http://localhost:5000/api/posts/delete', postData)
        .then(res => dispatch({
            type: DELETE_POST,
            payload: res.data
        }))
        .catch(err => console.log(err))
}

export const editPost = (postData, history) => dispatch => {
    axios.post('http://localhost:5000/api/posts/edit', postData)
        .then(res => history.push(`/`))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
}

export const getPosts = () => dispatch => {
    dispatch(loadPosts)
    axios.get('http://localhost:5000/api/posts')
        .then(res => dispatch({
            type: GET_POSTS,
            payload: res.data
        }))
        .catch(err => console.log(err))
}

export const getPostsByFollowingUsers = () => dispatch => {
	axios.get('http://localhost:5000/api/posts/following')
	.then(res => dispatch({
		type: GET_POSTS,
		payload: res.data
	}))
	.catch(err => console.log(err))
}