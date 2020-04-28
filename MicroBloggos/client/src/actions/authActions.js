import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from '../constants';

export const registerUser = (userData, history) => dispatch => {
    axios.post('http://localhost:5000/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
}

export const getCurrentUser = () => dispatch => {
    axios.get('http://localhost:5000/api/users/')
        .then(res => dispatch(setCurrentUser(res.data)))
}

export const setCurrentUser = () => {
    return {
        type: SET_CURRENT_USER,
        payload: data
    }
}