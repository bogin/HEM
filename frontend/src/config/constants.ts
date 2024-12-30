export const WS_URL = process.env.REACT_APP_WS_URL;

if (!WS_URL) {
    throw new Error('WS_URL is not defined in environment variables');
}


export const MAX_SELECTED_PERSONS = 4;