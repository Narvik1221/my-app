import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import FamilyStore from "./store/FamilyStore";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        family: new FamilyStore(),
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);

