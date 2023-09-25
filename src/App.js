import './App.css';

import BBSRouter from 'router/BBSRouter';

import {useContext } from 'react';
import AppContext from 'context/AppContextProvider';
import axios from 'api/axios';

const getCodeList = async (setCodeList) => {
  const response = await axios.get("/framework/anonymous/listAllContactPointType");
  setCodeList(response?.data);
}

function App() {
  const { codeList, setCodeList } = useContext(AppContext);
  if (!codeList) {
    getCodeList(setCodeList);
  }
  return <BBSRouter/>
}

export default App;
