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

const Shop = () => {
  const [modalCreate, setModalCreate] = useState(false);
  const history = useNavigate();
  const [items, setItems] = useState([{ id: "" }]);
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
      {/* <Modal
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        active={modalCreate}
        setActive={setModalCreate}
      >
        <div className="modal-inner">
          {
            <Container fluid>
              <Form className="modal-inner modal-inner_form">
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Название дерева</Form.Label>
                  <Form.Control
                    required
                    placeholder="Название дерева"
                    value={createItem.name}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                        userId: userData.id,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Тип доступа к дереву</Form.Label>
                  <Form.Group className=" modal-row" controlId="formBasicEmail">
                    <Form.Check
                      required
                      inline
                      type="radio"
                      label="Публичный"
                      checked={createItem.public_tree == "true"}
                      name="inlineRadioOptionsF"
                      value={"true"}
                      id="inlineRadioF1"
                      onChange={(e) =>
                        setCreateItem((prevState) => ({
                          ...prevState,
                          public_tree: e.target.value,
                        }))
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Приватный"
                      checked={createItem.public_tree == "false"}
                      value={"false"}
                      name="inlineRadioOptionsF"
                      id="inlineRadioF2"
                      onChange={(e) =>
                        setCreateItem((prevState) => ({
                          ...prevState,
                          public_tree: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Label className="title-text ">
                  Введите данные для главы дерева{" "}
                </Form.Label>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Фото</Form.Label>
                  <UploadAvatar setFile={setFile}></UploadAvatar>
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    required
                    placeholder="Имя"
                    value={createItem.namePerson}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        namePerson: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    required
                    placeholder="Фамилия"
                    value={createItem.surname}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        surname: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Отчество</Form.Label>
                  <Form.Control
                    placeholder="Отчество"
                    value={createItem.patr}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        patr: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Пол</Form.Label>
                  <Form.Group className=" modal-row" controlId="formBasicEmail">
                    <Form.Check
                      required
                      defaultChecked={true}
                      inline
                      type="radio"
                      label="М"
                      checked={createItem.sex == "М"}
                      name="inlineRadioOptions"
                      value={"М"}
                      id="inlineRadio1"
                      onChange={(e) =>
                        setCreateItem((prevState) => ({
                          ...prevState,
                          sex: e.target.value,
                        }))
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Ж"
                      checked={createItem.sex == "Ж"}
                      value={"Ж"}
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      onChange={(e) =>
                        setCreateItem((prevState) => ({
                          ...prevState,
                          sex: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Дата рождения</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    placeholder="Дата рождения"
                    value={createItem.dateOfBirthday}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        dateOfBirthday: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Дата смерти</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Дата смерти"
                    value={createItem.dateOfDeath}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        dateOfDeath: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="modal-row"
                  onClick={createTree}
                >
                  Создать
                </Button>
              </Form>
            </Container>
          }
        </div>
      </Modal> */}

      <Row>
        <h1>Пользователи</h1>
        {/* <Button
          variant="primary"
          className="family-create-button modal-row"
          onClick={() => setModalCreate(true)}
        >
          Добавить дерево
        </Button> */}
      </Row>
      <Row>
        {items && (
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
                        state: { navigateId: i.id },
                      })
                    }
                  >
                    Деревья
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Shop;
