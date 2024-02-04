import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import Family from "../pages/Family";
import { observer } from "mobx-react-lite";
import Form from "react-bootstrap/Form";
import { Context } from "../index";
import UploadAvatar from "../components/UploadAvatar";
import Modal from "../Modal/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getUser } from "../http/userAPI";
import { fetchFamilies, createFamily } from "../http/deviceAPI";
import Pages from "../components/Pages";
import React, { useContext, useEffect, useState } from "react";

import "../App.css";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE, FAMILY,USERS } from "../utils/consts";

const Shop = observer(() => {
  const {user} = useContext(Context)
  const [modalCreate, setModalCreate] = useState(false);
  const history = useNavigate();
  const [items, setItems] = useState(null);
  const [createItem, setCreateItem] = useState({});
  const [validated, setValidated] = useState(false);
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [myUsers, setMyUsers] = useState(null);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  useEffect(() => {
    fetchFamilies().then((data) => {
      console.log(data);
      setItems(data);
      let myUser = localStorage.getItem("userData");
      console.log(myUser);
      if (myUser) {
        setUserData(JSON.parse(myUser));
      }
    });
  }, []);
  useEffect(() => {
   console.log(user)

  }, []);
  useEffect(() => {
    if (items) {
      getUser().then((data) => {
        setMyUsers(data);
      });

      let myItems = document.querySelectorAll(".family-owner");
      myItems.forEach((i) => {});
    }
  }, [items]);
  useEffect(() => {
    if (myUsers) {
      let myItems = document.querySelectorAll(".family-owner");
      myItems.forEach((i) => {
        myUsers.data.user.map((j) => {
          if (j.id == i.id) {
            i.textContent = "владелец: " + j.name + " " + j.surname;
          }
        });
      });
    }
  }, [myUsers]);
  useEffect(() => {
    console.log(createItem);
  }, [createItem]);

  const createTree = () => {
    try {
      const formData = new FormData();
      formData.append("userId", createItem.userId);
      formData.append("namePerson", createItem.namePerson);
      formData.append("name", createItem.name);
      formData.append("surname", createItem.surname);
      formData.append("patr", createItem.patr);
      formData.append("sex", createItem.sex);
      formData.append("dateOfBirthday", createItem.dateOfBirthday);
      formData.append("public_tree", createItem.public_tree);
      if (createItem.dateOfDeath)
        formData.append("dateOfDeath", createItem.dateOfDeath);
      formData.append("img", file);
      console.log(formData);
      console.log(createItem);

      if (
        createItem.dateOfBirthday &&
        createItem.sex &&
        createItem.surname &&
        createItem.name &&
        createItem.namePerson &&
        createItem.userId &&
        createItem.public_tree
      ) {
        createFamily(formData).then((data) => {
          console.log(data);
          setItems(data);
          //window.location.reload();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Container fluid="xxl" className="mt-3">
      <Modal
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
      </Modal>

      <Row>
        {/* <Button
          variant="primary"
          className="family-create-button modal-row"
          onClick={() => setModalCreate(true)}
        >
          Добавить дерево
        </Button> */}
        {user.isAuth && (
          <Button
            variant="primary"
            className="family-create-button modal-row"
            onClick={() => history(FAMILY + "/" + userData.id)}
          >
            Мои деревья
          </Button>
        )}
        {(user.role == "ADMIN") && (
          <Button
            variant="primary"
            className="family-create-button modal-row"
            onClick={() => history(USERS)}
          >
            Пользователи
          </Button>
        )}
      </Row>
      <Row>
        {items && (
          <div className="family-cards-inner">
            {items.map((i) => (
              i.public_tree&&
              <Card className="family-tree-card">
                <Card.Body className="card-body-tree">
                  <Card.Title style={{ fontSize: "28px" }}>
                    Дерево: {i.name}
                  </Card.Title>
                  <Card.Title style={{ fontSize: "18px" }}>
                    Тип: {i.public_tree ? "публичное" : "приватное"}
                  </Card.Title>
                  <Card.Title
                    className="family-owner"
                    id={i.userId}
                    style={{ fontSize: "18px" }}
                  >
                    владелец: {}
                  </Card.Title>
                  <Button
                    className="family-card-button"
                    variant="primary"
                    onClick={() => history(DEVICE_ROUTE + "/" + i.id)}
                  >
                    Перейти к дереву
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Row>
    </Container>
  );
});

export default Shop;
