import {
    ADD_POST,
    LOADING_POSTS,
    GET_POSTS,
    DELETE_POST
} from '../constants';

const initialState = {
    list: null,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                list: [action.payload, ...state.list]
            }
        case LOADING_POSTS:
            return {
                ...state,
                loading: true
            }
        case GET_POSTS:
            return {
                ...state,
                loading: false,
                list: action.payload
            }
        case DELETE_POST:
            return {
                ...state,
                loading: false,
                list: state.list.filter(item => item !== action.payload)
            }
        default:
            return state
    }
}