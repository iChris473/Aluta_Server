import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./index.css"
import  {AuthContextProvider} from "./context/AuthContext"
import { RecoilRoot } from 'recoil';


ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
