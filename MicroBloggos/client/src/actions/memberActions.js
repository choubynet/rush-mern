import axios from 'axios';
import {
    GET_MEMBERS,
    LOADING_MEMBERS
} from '../constants';

export const loadMembers = () => dispatch => {
    return {
        type: LOADING_MEMBERS
    }
}

export const getAllMembers = () => dispatch => {
    dispatch(loadMembers)
    axios.get('http://localhost:5000/api/users/allusers')
        .then(res => dispatch({
            type: GET_MEMBERS,
            payload: res.data
        }))
        .catch(err => console.log(err))
}