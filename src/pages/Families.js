import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";

import Family from "./Family";
import { observer } from "mobx-react-lite";
import Form from "react-bootstrap/Form";
import { Context } from "../index";
import UploadAvatar from "../components/UploadAvatar";
import Modal from "../Modal/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getUser } from "../http/userAPI";
import {
  fetchFamilies,
  createFamily,
  fetchOneFamily,
  putFamily,
  delFamily,
  fetchFamiliesSearch,
  fetchAllFamilies,
} from "../http/deviceAPI";
import Pages from "../components/Pages";
import React, { useContext, useEffect, useState } from "react";

import "../App.css";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE, FAMILY, USERS } from "../utils/consts";
import Loader from "../components/Loader/Loader";
const Families = observer(() => {
  const { user } = useContext(Context);
  const [modalCreate, setModalCreate] = useState(false);
  const [viewParam, setViewParam] = useState(false);
  const history = useNavigate();
  const [items, setItems] = useState(false);
  const [changeItem, setChangeItem] = useState({});
  const [modal, setModal] = useState(false);
  const [createItem, setCreateItem] = useState({});
  const [validated, setValidated] = useState(false);
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [myUsers, setMyUsers] = useState(null);
  const [modalChange, setModalChange] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [form, setForm] = useState(false);
  const [formChange, setFormChange] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  useEffect(() => {
    if (user.searchValue) {
      fetchFamiliesSearch(user.searchValue).then((data) => {
     
        setItems(data);
        let myUser = localStorage.getItem("userData");

        if (myUser) {
          setUserData(JSON.parse(myUser));
        }
      });
    } else {
      if (viewParam) {
        fetchAllFamilies().then((data) => {

          setItems(data);
          let myUser = localStorage.getItem("userData");

          if (myUser) {
            setUserData(JSON.parse(myUser));
          }
        });
      } else {
        fetchFamilies().then((data) => {

          setItems(data);
          let myUser = localStorage.getItem("userData");

          if (myUser) {
            setUserData(JSON.parse(myUser));
          }
        });
      }
    }
  }, [user.searchValue, viewParam]);
  useEffect(() => {

  }, [items]);

  useEffect(() => {
    if (items) {
      getUser().then((data) => {
        setMyUsers(data);
      });
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
    if (form) {
      createTree();
    }
  }, [form]);
  useEffect(() => {
    if (formChange) {
      changeFamily();
    }
  }, [formChange]);

  const createTree = () => {
    try {
      if (
        createItem.dateOfBirthday &&
        createItem.sex &&
        createItem.surname &&
        createItem.name &&
        createItem.namePerson &&
        createItem.userId &&
        createItem.public_tree
      ) {
        createFamily(form).then((data) => {
          window.location.reload();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFamily = () => {
    try {
      delFamily(selectedItem.id).then((data) => {
        if (data != "1") {
          if (data.includes("нельзя")) {
            alert(data);
          }
        } else {
          window.location.reload();
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const changeFamily = () => {
    try {
      putFamily(selectedItem.id, formChange).then((data) => {
        window.location.reload();
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container fluid="xxl" className="mt-3">
      <Modal
        onSubmit={handleSubmit}
        active={modalCreate}
        setActive={setModalCreate}
      >
        <div className="modal-inner">
          {
            <Container fluid>
              <Form
                noValidate
                validated={validated}
                className="modal-inner modal-inner_form"
              >
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
                  onClick={(e) => {
                    this.handleSubmit(e);
                    setForm({
                      userId: createItem.userId,
                      namePerson: createItem.namePerson,
                      name: createItem.name,
                      surname: createItem.surname,
                      patr: createItem.patr,
                      sex: createItem.sex,
                      dateOfBirthday: createItem.dateOfBirthday,
                      dateOfDeath: createItem.dateOfDeath,
                      public_tree: createItem.public_tree,
                      img: file,
                    });
                  }}
                >
                  Создать
                </Button>
              </Form>
            </Container>
          }
        </div>
      </Modal>
      <Modal zIndex={"100000"} active={modalChange} setActive={setModalChange}>
        <div>
          {selectedItem && (
            <Container fluid>
              <Form className="modal-inner modal-inner_form">
                <Form.Label className=" modal-row">
                  Дерево: {selectedItem.name}
                </Form.Label>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Название дерева</Form.Label>
                  <Form.Control
                    placeholder="Название дерева"
                    value={changeItem.name}
                    onChange={(e) =>
                      setChangeItem((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Публичное дерево</Form.Label>
                  <Form.Group className=" modal-row" controlId="formBasicEmail">
                    <Form.Check
                      required
                      defaultChecked={true}
                      inline
                      type="radio"
                      label="Публичное"
                      checked={changeItem.public_tree + "" == "true"}
                      name="inlineRadioOptions"
                      value={"true"}
                      id="inlineRadio1"
                      onChange={(e) =>
                        setChangeItem((prevState) => ({
                          ...prevState,
                          public_tree: e.target.value,
                        }))
                      }
                    />
                    <Form.Check
                      required
                      defaultChecked={true}
                      inline
                      type="radio"
                      label="Приватное"
                      checked={changeItem.public_tree + "" == "false"}
                      name="inlineRadioOptions"
                      value={"false"}
                      id="inlineRadio1"
                      onChange={(e) =>
                        setChangeItem((prevState) => ({
                          ...prevState,
                          public_tree: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Блокировать дерево</Form.Label>
                  <Form.Group className=" modal-row" controlId="formBasicEmail">
                    <Form.Check
                      required
                      defaultChecked={true}
                      inline
                      type="radio"
                      label="Да"
                      checked={changeItem.blocked + "" == "true"}
                      name="inlineRadioOptions1"
                      value={"true"}
                      id="inlineRadio2"
                      onChange={(e) =>
                        setChangeItem((prevState) => ({
                          ...prevState,
                          blocked: e.target.value,
                        }))
                      }
                    />
                    <Form.Check
                      required
                      defaultChecked={true}
                      inline
                      type="radio"
                      label="Нет"
                      checked={changeItem.blocked + "" == "false"}
                      name="inlineRadioOptions1"
                      value={"false"}
                      id="inlineRadio2"
                      onChange={(e) =>
                        setChangeItem((prevState) => ({
                          ...prevState,
                          blocked: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Form.Group>

                <Button
                  type="button"
                  className="modal-row"
                  onClick={() => {
                    setFormChange({
                      name: changeItem.name,
                      public_tree: changeItem.public_tree,
                      blocked: changeItem.blocked,
                    });
                  }}
                >
                  Сохранить
                </Button>
              </Form>
            </Container>
          )}
        </div>
      </Modal>

      <Modal zIndex={"100000"} active={modalDelete} setActive={setModalDelete}>
        <div>
          {selectedItem && (
            <Container fluid>
              <div className="modal-inner">
                <div className="modal-row">
                  <br></br>
                  <span>
                    Вы действительно хотите удалить дерево {selectedItem.name}?{" "}
                  </span>
                  <br></br>
                </div>
                <Button>
                  <div className="modal-row" onClick={deleteFamily}>
                    Удалить
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
                  Дерево: {selectedItem.name}
                </Form.Label>
                {(user.isAuth && selectedItem.id == user.userId) ||
                  (user.role == "ADMIN" && (
                    <>
                      <Button
                        required
                        className="modal-row"
                        onClick={() => setModalDelete(true)}
                      >
                        Удалить
                      </Button>
                      <Button
                        required
                        className="modal-row"
                        onClick={() => {
                          //console.log(selectedItem);
                          setChangeItem(selectedItem);
                          setModalChange(true);
                        }}
                      >
                        Изменить
                      </Button>
                    </>
                  ))}

                <Button
                  className="modal-row"
                  onClick={() =>
                    history(DEVICE_ROUTE + "/" + selectedItem.id, {
                      state: {
                        BLOCKED: selectedItem.blocked,
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
      {items ? (
        <>
          <Row className="button-panel">
            {user.isAuth && (
              <Button
                variant="primary"
                className="family-create-button modal-row"
                onClick={() => {
                  user.setSearchTable(false);
                  user.setSearchValue(false);

                  history(FAMILY + "/" + userData.id);
                }}
              >
                Мои деревья
              </Button>
            )}
            {user.isAuth && (
              <Button
                variant="primary"
                className="family-create-button modal-row"
                onClick={() => {
                  user.setSearchTable(false);
                  user.setSearchValue(false);

                  history(USERS);
                }}  
              >
                Пользователи
              </Button>
            )}
            {user.role == "ADMIN" && (
              <Button
                variant="primary"
                className="family-create-button modal-row"
                onClick={() => {
                  user.setSearchTable(false);
                  user.setSearchValue(false);
                  setViewParam(!viewParam);
                }}
              >
                {viewParam ? "Публичные деревья" : "Все деревья"}
              </Button>
            )}
          </Row>
          <Row>
            <div className="family-cards-inner">
              {items.length > 0 &&
                items.map(
                  (i) =>
                    i.families.length > 0 &&
                    i.families.map((j) => (
                      <Card className="family-tree-card">
                        <Card.Body className="card-body-tree">
                          <Card.Title style={{ fontSize: "28px" }}>
                            Дерево: {j.name}
                          </Card.Title>
                          <Card.Title style={{ fontSize: "18px" }}>
                            Тип: {j.public_tree ? "публичное" : "приватное"}
                          </Card.Title>
                          <Card.Title style={{ fontSize: "18px" }}>
                            Заблокированное: {j.blocked ? "да" : "нет"}
                          </Card.Title>
                          <Card.Title
                            className="family-owner"
                            style={{ fontSize: "18px" }}
                          >
                            владелец: {i.name} {i.surname}
                          </Card.Title>
                          <Button
                            className="family-card-button"
                            variant="primary"
                            onClick={() => {
                              setSelectedItem(j);
                              setModal(true);
                            }}
                          >
                            Открыть
                          </Button>
                        </Card.Body>
                      </Card>
                    ))
                )}
            </div>
          </Row>
        </>
      ) : (
        <Loader myHeight={"calc(100vh - 176px)"}></Loader>
      )}
    </Container>
  );
});

export default Families;
