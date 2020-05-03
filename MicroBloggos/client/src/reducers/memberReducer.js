import {
    LOADING_MEMBERS,
    GET_MEMBERS
} from '../constants';

const initialState = {
    list: null,
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_MEMBERS:
            return {
                ...state,
                loading: true
            }
        case GET_MEMBERS:
            return {
                ...state,
                loading: false,
                list: action.payload
            }
        default:
            return state
    }
}