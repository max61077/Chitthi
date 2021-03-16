export const initialState = false;

export const reducer = (state, action) => {
    if(action.type === 'START_LOADING')
        return {
            ...state,
            loader: true
        }
    if(action.type === 'STOP_LOADING')
        return {
            ...state,
            loader: false
        };
    return state
}