import { useState, useEffect } from 'react';
import axios from 'api/axios';

//Hook 사용은 함수 처리 안에서는 사용 불가능 하군요.

function useFatch(uri) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uri) return;

        fetch(uri).then(response => response.json())
            .then(setData)
            .then(setLoading(false))
            .catch(setError);
    }, [uri]);
    return { loading, data, error };
}

function usePost(uri, body) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uri || !body) return;

        axios.post(uri, body,
            {
                headers: { "Content-Type": "application/json" },
                responseType: "blob"
            })
            .then(setData)
            .then(setLoading(false))
            .catch(setError);
    }, [uri, body]);
    return { loading, data, error };
}

export { useFatch, usePost };