import { useState, useEffect } from 'react';
import Axios from 'axios';
import { TokenHeader } from '../ListOfLinks';

export function Api_Request(api_url) {
    const [isError, setError] = useState();
    const [isLoading, setLoading] = useState(null);
    const [isItem, setItem] = useState(null);

    useEffect(() => {
        const token = process.env.REACT_APP_API_KEY_LABSTATS;
        Axios.get(api_url, TokenHeader(token)).then(
            result => {
                setLoading('true');
                setItem(result.data);
            },
            error => {
                setLoading('true');
                setError(error);
            }
        )
    },[api_url]);
    const arr = [isError, isLoading, isItem];

    return(
        arr
    );
}

export default { Api_Request };
