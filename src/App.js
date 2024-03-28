import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import Loader from "./components/Loader/Loader";
import "./App.css";
import "./reset.css";
const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check()
      .then((data) => {
        let isAuth = localStorage.getItem("userData");
        
        const currentTree = localStorage.getItem("currentTree");
        const spouseId = localStorage.getItem("spouseId");
        const spouse = JSON.parse(localStorage.getItem("spouse"));
        if (currentTree && currentTree !== undefined && currentTree !== null) {
    
          user.setCurrentTree(currentTree);
          user.setSpouseId(spouseId);
          user.setSpouse(spouse);
        }

        if (data!==undefined && data) {
          user.setRole(JSON.parse(isAuth).role);
          user.setUser(true);
          user.setIsAuth(true);
          user.setName(JSON.parse(isAuth).name);
          user.setSurname(JSON.parse(isAuth).surname);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader></Loader>;
  }
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
