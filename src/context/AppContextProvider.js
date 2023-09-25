import { createContext, useState } from "react";

const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [codeList, setCodeList] = useState();

    return (
        <AppContext.Provider value={{ auth, setAuth, codeList, setCodeList }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext;