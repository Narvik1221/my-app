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
import { getUser, blockUser } from "../http/userAPI";
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
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
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
  const blockUserHandle = () => {
    try {
      console.log(selectedItem.id);
      blockUser(selectedItem.id, !selectedItem.blocked).then((data) => {
        console.log(data);
        window.location.reload();
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Container fluid="xxl" className="mt-3">
      <Modal zIndex={"100"} active={modalDelete} setActive={setModalDelete}>
        <div>
          {selectedItem && (
            <Container fluid>
              <div className="modal-inner">
                <div className="modal-row">
                  <br></br>
                  <span>
                    Вы действительно хотите {selectedItem.blocked?"разблокировать ":"заблокировать "}{selectedItem.name}{" "}
                    {selectedItem.surname}?{" "}
                  </span>
                  <br></br>
                </div>
                <Button>
                  <div className="modal-row" onClick={blockUserHandle}>
                    Да
                  </div>
                </Button>
              </div>
            </Container>
          )}
        </div>
      </Modal>

      <Modal active={modal} setActive={setModal}>
        <div>
          {selectedItem && (
            <Container fluid>
              <Form className="modal-inner modal-inner_form">
                <Form.Label className=" modal-row">
                  Пользователь: {selectedItem.name} {selectedItem.surname}
                </Form.Label>

                <Button
                  className="modal-row"
                  onClick={() => setModalDelete(true)}
                >
                  Заблокировать
                </Button>
                <Button
                  className="modal-row"
                  onClick={() =>
                    history(FAMILY + "/" + selectedItem.id, {
                      state: {
                        ID: selectedItem.id,
                        NAME: selectedItem.name,
                        SURNAME: selectedItem.surname,
                      },
                    })
                  }
                >
                  Перейти к дереву
                </Button>
              </Form>
            </Container>
          )}
        </div>
      </Modal>
      <Row>
        <h1 className="inside-title title-text">Пользователи</h1>
      </Row>
      <Row>
        {items ? (
          <div className="family-cards-inner">
            {items.map((i) => (
              <Card
                className={
                  i.blocked ? "family-tree-card blocked" : "family-tree-card "
                }
              >
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
                  <Card.Title style={{ fontSize: "18px" }}>
                    Заблокирован: {i.blocked ? "Да" : "Нет"}
                  </Card.Title>
                  {i.blocked ? (
                    <Button
                      className="family-card-button"
                      variant="primary"
                      onClick={() => {
                        setSelectedItem(i);
                        setModalDelete(true)
                      }}
                    >
                      Разблокировать
                    </Button>
                  ) : (
                    <Button
                      className="family-card-button"
                      variant="primary"
                      onClick={() => {
                        setSelectedItem(i);
                        setModal(true);
                      }}
                    >
                      Открыть
                    </Button>
                  )}
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
