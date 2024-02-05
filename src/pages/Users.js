import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import Form from "react-bootstrap/Form";
import { Context } from "../index";
import UploadAvatar from "../components/UploadAvatar";
import Modal from "../Modal/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getUser } from "../http/userAPI";
import Pages from "../components/Pages";
import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { FAMILY } from "../utils/consts";
import Loader from "../components/Loader/Loader";
const Shop = () => {
  const [modalCreate, setModalCreate] = useState(false);
  const history = useNavigate();
  const [items, setItems] = useState(false);
  const [createItem, setCreateItem] = useState({});
  const [validated, setValidated] = useState(false);
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [myUsers, setMyUsers] = useState(null);

  useEffect(() => {
    let myUser = localStorage.getItem("userData");
    setUserData(JSON.parse(myUser));
  }, []);

  useEffect(() => {
    getUser().then((data) => {
      setItems(data.data.user);
      let myUser = localStorage.getItem("userData");
      console.log(myUser);
      if (myUser) {
        setUserData(JSON.parse(myUser));
      }
    });
  }, []);

  return (
    <Container fluid="xxl" className="mt-3">
      <Row>
        <h1 className="inside-title title-text">Пользователи</h1>
      </Row>
      <Row>
        {items ? (
          <div className="family-cards-inner">
            {items.map((i) => (
              <Card className="family-tree-card">
                <Card.Body className="card-body-tree">
                  <Card.Title style={{ fontSize: "28px" }}>
                    Имя: {i.name}
                  </Card.Title>
                  <Card.Title style={{ fontSize: "28px" }}>
                    Фамилия: {i.surname}
                  </Card.Title>
                  <Card.Title style={{ fontSize: "18px" }}>
                    Email: {i.email}
                  </Card.Title>
                  <Card.Title style={{ fontSize: "18px" }}>
                    Роль: {i.email}
                  </Card.Title>

                  <Button
                    className="family-card-button"
                    variant="primary"
                    onClick={() =>
                      history(FAMILY + "/" + i.id, {
                        state: {
                          ID: i.id,
                          NAME: i.name,
                          SURNAME: i.surname,
                        },
                      })
                    }
                  >
                    Деревья
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <Loader></Loader>
        )}
      </Row>
    </Container>
  );
};

export default Shop;
