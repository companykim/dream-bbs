import {useFatch, usePost} from "hooks/useFatch.js"

function Fetch({uri, renderSuccess = f=>f,
    loadingFallBack = <p>loading...</p>,
    renderError = ({error})=>(<pre>{JSON.stringify(error, null, 2)}</pre>)}) {

    const {loading, data, error} = useFatch(uri);

    if (loading) return loadingFallBack;
    if (error) return renderError({error});
    if (data) {
        return renderSuccess(data);
    }
}

function AxiosPost({uri, body, renderSuccess = f=>f,
    loadingFallBack = <p>loading...</p>,
    renderError = ({error})=>(<pre>{JSON.stringify(error, null, 2)}</pre>)}) {

    const {loading, data, error} = usePost(uri, body);

    if (loading) return loadingFallBack;
    if (error) return renderError({error});
    if (data) {
        return renderSuccess(body, data);
    }
}

export {Fetch, AxiosPost};