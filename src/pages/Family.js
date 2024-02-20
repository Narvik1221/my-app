import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { observer } from "mobx-react-lite";
import Form from "react-bootstrap/Form";
import { Context } from "../index";
import UploadAvatar from "../components/UploadAvatar";
import Modal from "../Modal/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useLocation } from "react-router-dom";
import { getUser } from "../http/userAPI";
import {
  fetchFamilies,
  createFamily,
  createFamilyGed,
  fetchOneFamily,
  putFamily,
  delFamily,
  fetchFamiliesAutoSearch,
} from "../http/deviceAPI";
import Pages from "../components/Pages";
import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
const Family = observer(() => {
  let { id } = useParams();
  const { user } = useContext(Context);
  const ID = useLocation().state?.ID;
  const { state } = useLocation();
  const { navigateId } = state != null ? state : "";
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalCreateGed, setModalCreateGed] = useState(false);
  const history = useNavigate();
  const [items, setItems] = useState(false);
  const [changeItem, setChangeItem] = useState({});
  const [createItem, setCreateItem] = useState({});
  const [createItemGed, setCreateItemGed] = useState({});
  const [validated, setValidated] = useState(false);
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState(undefined);
  const [myUsers, setMyUsers] = useState(null);
  const [modalChange, setModalChange] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [gedFile, setGedFile] = useState("");
  const [form, setForm] = useState(false);
  const [formGed, setFormGed] = useState(false);
  const [formChange, setFormChange] = useState(false);
  const [myName, setMyName] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [mySurname, setMySurname] = useState(false);
  const [gedButtonText, setGedButtonText] = useState("Создать");
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    setValidated(true);
  };
  useEffect(() => {
    console.log("userId");
    console.log(id);
    if (id) {
      getUser().then((data) => {
        let d = data.data.user.filter((d) => d.id == id);
        console.log(d);
        setMyName(d[0].name);
        setMySurname(d[0].surname);
      });
    }
    console.log(user.isAuth);
    let myUser = localStorage.getItem("userData");
    setUserData(JSON.parse(myUser));
  }, []);
  useEffect(() => {
    console.log(items);
  }, [items]);
  useEffect(() => {
    if (userData) {
      console.log(userData);
      let param = userData.id;
      if (typeof ID == "number") {
        param = ID;
      }
      fetchOneFamily(param).then((data) => {
        console.log(data);
        setItems(data);
      });
    }
  }, [userData]);
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

  useEffect(() => {
    if (form) {
      createTree();
    }
  }, [form]);

  useEffect(() => {
    if (formGed) {
      createTreeGed();
    }
  }, [formGed]);
  const createTreeGed = () => {
    try {
      if (
        gedFile &&
        createItemGed.name &&
        createItemGed.userId &&
        createItemGed.public_tree
      ) {
        setGedButtonText("Идет загрузка...");
        let myFormData = new FormData();
        myFormData.append("name", createItemGed.name);
        myFormData.append("userId", createItemGed.userId);
        myFormData.append("public_tree", createItemGed.public_tree);
        myFormData.append("file", gedFile);
        console.log(gedFile);
        createFamilyGed(myFormData).then((data) => {
          console.log(data);
          console.log(myFormData);
          window.location.reload();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (formChange) {
      console.log(formChange);
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
          console.log(data);
          //setItems(data);
          window.location.reload();
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFamily = () => {
    try {
      console.log(selectedItem.id);
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
        console.log(data);
        window.location.reload();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const searchAuto = () => {
    setModal(false);
    fetchFamiliesAutoSearch(selectedItem.id, selectedItem.userId).then(
      (data) => {
        setIsSearch(true);
        console.log(data);
        setItems(data);
      }
    );
  };

  return user.isAuth ? (
    <Container fluid="xxl" className="mt-3">
      <Modal active={modalCreateGed} setActive={setModalCreateGed}>
        <div className="modal-inner">
          {
            <Container fluid>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="modal-inner modal-inner_form"
              >
                <Form.Group className=" modal-row">
                  <Form.Label>Название дерева</Form.Label>
                  <Form.Control
                    required
                    placeholder="Название дерева"
                    value={createItemGed.name}
                    onChange={(e) =>
                      setCreateItemGed((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                        userId: ID ? ID : userData.id,
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
                      checked={createItemGed.public_tree == "true"}
                      name="inlineRadioOptionsF"
                      value={"true"}
                      id="inlineRadioF1"
                      onChange={(e) =>
                        setCreateItemGed((prevState) => ({
                          ...prevState,
                          public_tree: e.target.value,
                        }))
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Приватный"
                      checked={createItemGed.public_tree == "false"}
                      value={"false"}
                      name="inlineRadioOptionsF"
                      id="inlineRadioF2"
                      onChange={(e) =>
                        setCreateItemGed((prevState) => ({
                          ...prevState,
                          public_tree: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group className=" modal-row">
                  <Form.Label>Выберите GEDCOM файл </Form.Label>
                  <Form.Control
                    type="file"
                    required
                    accept=".ged,.gedcom"
                    placeholder="Выбрать файл"
                    onChange={(e) => {
                      setGedFile(e.target.files[0]);
                    }}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="modal-row"
                  onClick={() => {
                    setFormGed({
                      name: createItemGed.name,
                      userId: createItemGed.userId,
                      public_tree: createItemGed.public_tree,
                      file: gedFile,
                    });
                  }}
                >
                  {gedButtonText}
                </Button>
              </Form>
            </Container>
          }
        </div>
      </Modal>

      <Modal active={modalCreate} setActive={setModalCreate}>
        <div className="modal-inner">
          {
            <Container fluid>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
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
                        userId: ID ? ID : userData.id,
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
                  onClick={() => {
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
      <Modal zIndex={"10000"} active={modalChange} setActive={setModalChange}>
        <div>
          {selectedItem && (
            <Container fluid>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="modal-inner modal-inner_form"
              >
                <Form.Label className=" modal-row">
                  Дерево: {selectedItem.name}
                </Form.Label>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Название дерева</Form.Label>
                  <Form.Control
                    required
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
                      label="Публичный"
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
                      label="Приватный"
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
                {user.role == "ADMIN" && (
                  <Form.Group className=" modal-row" controlId="formBasicEmail">
                    <Form.Label>Блокировать дерево</Form.Label>
                    <Form.Group
                      className=" modal-row"
                      controlId="formBasicEmail"
                    >
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
                )}

                <Button
                  type="submit"
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

      <Modal zIndex={"10000"} active={modalDelete} setActive={setModalDelete}>
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

                <Button
                  className="modal-row"
                  onClick={() => setModalDelete(true)}
                >
                  Удалить
                </Button>
                <Button
                  className="modal-row"
                  onClick={() => {
                    console.log(selectedItem);
                    setChangeItem(selectedItem);
                    setModalChange(true);
                  }}
                >
                  Изменить
                </Button>
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
                <Button className="modal-row" onClick={() => searchAuto()}>
                  Возможные родственники
                </Button>
              </Form>
            </Container>
          )}
        </div>
      </Modal>
      {myName && (
        <Row>
          <h3 className="title-text inside-title  ">
            <div
              className="pointer-link "
              onClick={() => {
                window.location.reload();
              }}
            >
              Пользователь: {myName} {mySurname}
            </div>{" "}
            {isSearch && "-> Деревья возможных родственников"}
          </h3>
        </Row>
      )}
      <Row className="button-panel">
        <Button
          variant="primary"
          className="family-create-button modal-row"
          onClick={() => setModalCreate(true)}
        >
          Добавить дерево
        </Button>

        <Button
          variant="primary"
          className="family-create-button modal-row"
          onClick={() => setModalCreateGed(true)}
        >
          Загрузить GEDCOM файл
        </Button>
      </Row>
      <Row>
        {items ? (
          <div className="family-cards-inner">
            {items.map((i) => (
              <Card className="family-tree-card">
                <Card.Body className="card-body-tree">
                  <Card.Title style={{ fontSize: "28px" }}>
                    Дерево: {i.name}
                  </Card.Title>
                  <Card.Title style={{ fontSize: "18px" }}>
                    Тип: {i.public_tree ? "публичное" : "приватное"}
                  </Card.Title>
                  <Card.Title style={{ fontSize: "18px" }}>
                    Заблокированное: {i.blocked ? "да" : "нет"}
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
                    onClick={() => {
                      setSelectedItem(i);
                      setModal(true);
                    }}
                  >
                    Открыть
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
  ) : (
    <div style={{ textAlign: "center" }} className="container modal-row">
      Доступ заблокирован
    </div>
  );
});

export default Family;
