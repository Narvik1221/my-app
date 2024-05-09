import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import { NavLink } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  FAMILIES_ROUTE,
  BASKET_ROUTE,
} from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import basket from "../assets/basket.svg";
import Search from "../components/Search";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
const NavBar = observer(() => {
  const { user } = useContext(Context);
  const history = useNavigate();
  const [userData, setUserData] = useState(undefined);
  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    user.setRole(false);
    localStorage.removeItem("userData");
    setUserData(undefined);
    history(FAMILIES_ROUTE);
  };
  useEffect(() => {
    try {
      let myUser = localStorage.getItem("userData");
      console.log(user.name);
      if (myUser) {
        setUserData(JSON.parse(myUser).dataValues);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container
        fluid="xxl"
        style={{
          justifyContent: "space-between",
          paddingTop: "6px",
          paddingBottom: "6px",
        }}
      >
        <NavLink
          onClick={() => {
            user.setSearchTable(false);
            user.setSearchValue(false);
          }}
          style={{ color: "white", fontSize: "30px", padding: "0 8px" }}
          to={FAMILIES_ROUTE}
        >
          FAMILY TREE
        </NavLink>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          style={{ justifyContent: "right" }}
          id="responsive-navbar-nav"
        >
          {user.isAuth ? (
            <Nav className="nav-inner">
              <Search></Search>
              <div
                style={{
                  gap: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span className="modal-row">{"Пользователь: "}</span>
                <span className="modal-row">{user.name}</span>
                <span className="modal-row">{user.surname}</span>
              </div>

              <Button
                variant={"outline-light"}
                onClick={() => logOut()}
                className="ml-2 "
              >
                Выйти
              </Button>
            </Nav>
          ) : (
            <Nav className="ml-auto" style={{ color: "white" }}>
              <Button
                variant={"outline-light"}
                onClick={() => history(LOGIN_ROUTE)}
              >
                Авторизация
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;
