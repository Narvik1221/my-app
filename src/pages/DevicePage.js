import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import bigStar from "../assets/bigStar.png";
import Modal from "../Modal/Modal";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import {
  fetchOneTree,
  changePerson,
  changeSpouse,
  createPerson,
  createSpouse,
  deletePerson,
  deleteSpouse,
} from "../http/deviceAPI";
import Form from "react-bootstrap/Form";
import UploadAvatar from "../components/UploadAvatar";

const TreePage = observer(() => {
  const { user } = useContext(Context);
  const [tree, setTree] = useState(false);
  const { id } = useParams();
  const [svg, setSvg] = useState(false);
  const [data, setData] = useState(false);
  const [changeItem, setChangeItem] = useState({});
  const [createItem, setCreateItem] = useState({});
  const [connections, setConnections] = useState(false);
  const [connectionsSpouse, setConnectionsSpouse] = useState(false);
  const [spouseRectangles2, setSpouseRectangles2] = useState(false);
  const [dataStructure, setDataStructure] = useState(false);
  const [rectangles, setRectangles] = useState(false);
  const [spouseRectangles, setSpouseRectangles] = useState(false);
  const [information, setInformation] = useState(false);
  const [names, setNames] = useState(false);
  const [spouse, setSpouse] = useState(false);
  const [img, setImg] = useState(false);
  const [imgSpouse, setSpouseImg] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [spouseNames, setSpouseNames] = useState(false);
  const [surnames, setSurNames] = useState(false);
  const [spouseSurNames, setSpouseSurNames] = useState(false);
  const [r, setR] = useState(false);
  const [c, setC] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalChange, setModalChange] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [userData, setUserData] = useState(false);
  const [file, setFile] = useState(null);
  useEffect(() => {
    fetchOneTree(id).then((data) => setTree(data));
  }, []);

  useEffect(() => {
    let myUser = localStorage.getItem("userData");
    console.log(myUser);
    if (myUser) {
      setUserData(JSON.parse(myUser));
    }
  }, []);
  useEffect(() => {
    console.log(
      userData.role == "ADMIN"
        ? true
        : user.isAuth && tree.userId == userData.id
    );
  }, [userData]);
  useEffect(() => {
    if(tree){
   
        console.log(tree.people.length)
      
      setSvg(
        d3
          .select(".class_b")
          .append("svg")
          .attr("width", tree.people.length*300<1500?1500:tree.people.length*400)
          .attr("height", tree.people.length*300<1000?1000:tree.people.length*400)
          .append("g")
          .attr("transform", "translate(50,50)")
      );
    }
   
  }, [tree]);
  useEffect(() => {
    if (tree) {
      setData(tree.people);
    }
  }, [tree]);

  useEffect(() => {
    if (data) {
      try {
        console.log(data);

        setDataStructure(
          d3
            .stratify()
            .id(function (d) {
              return d.child;
            })
            .parentId(function (d) {
              return d.parent;
            })(data)
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, [data]);
  useEffect(() => {
    if (dataStructure) {
      var treeStructure = d3.tree().size([tree.people.length*300<1000?1000:tree.people.length*300, tree.people.length*300<1300?800:tree.people.length*300]);
      setInformation(treeStructure(dataStructure));
    }
  }, [dataStructure]);
  useEffect(() => {
    if (information) {
      setConnections(
        svg.append("g").selectAll("path").data(information.links())
      );
      setConnectionsSpouse(
        svg.append("g").selectAll("path").data(information.links())
      );
    }
  }, [information]);

  useEffect(() => {
    if (connections) {
      connections
        .enter()
        .append("path")
        .attr("d", function (d) {
          return (
            "M" +
            d.source.x +
            "," +
            d.source.y +
            "v 200 H" +
            d.target.x +
            " V" +
            d.target.y
          );
        });

      setC(true);
    }
  }, [connections]);

  useEffect(() => {
    if (c) {
      setRectangles(
        svg.append("g").selectAll("rect").data(information.descendants())
      );
      setSpouseRectangles(
        svg.append("g").selectAll("rect").data(information.descendants())
      );
      setSpouseRectangles2(
        svg.append("g").selectAll("rect").data(information.descendants())
      );
      setR(true);
      setNames(
        svg.append("g").selectAll("text").data(information.descendants())
      );
      setImg(
        svg
          .append("g")
          .selectAll("image")
          .data(information.descendants())
          .enter()
          .append("image")
          .attr("width", 130)
          .attr("height", 130)
          .attr("x", function (d) {
            return d.x - 65;
          })
          .attr("y", function (d) {
            return d.y - 25;
          })
          .attr("xlink:href", function (d) {
            return process.env.REACT_APP_API_URL +"/"+ d.data.img;
          })
          .classed("img-card", true)
      );
      setSpouseImg(
        svg
          .append("g")
          .selectAll("image")
          .data(information.descendants())
          .enter()
          .append("image")
          .attr("width", 130)
          .attr("height", 130)
          .attr("x", function (d) {
            return d.x + 105;
          })
          .attr("y", function (d) {
            return d.y - 25;
          })
          .attr("xlink:href", function (d) {
            return process.env.REACT_APP_API_URL +'/'+ d.data.spouses[0]?.img;
          })
          .classed("img-card", true)
          .classed("hide", function (d) {
            if (d.data.spouses[0]?.name == undefined) {
              console.log(true);
              return true;
            } else {
              console.log(false);
              return false;
            }
          })
      );
      setSpouseNames(
        svg.append("g").selectAll("text").data(information.descendants())
      );
      setSurNames(
        svg.append("g").selectAll("text").data(information.descendants())
      );
      setSpouseSurNames(
        svg.append("g").selectAll("text").data(information.descendants())
      );
    }
  }, [c]);
  useEffect(() => {
    if (r) {
      rectangles
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return d.x - 70;
        })
        .attr("y", function (d) {
          return d.y - 30;
        })
        .attr("id", function (d) {
          return d.data.id;
        })

        .classed("tree-card", true)
        .attr("rx", "20")
        .attr("ry", "20");

      spouseRectangles
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return d.x + 100;
        })
        .attr("y", function (d) {
          return d.y - 30;
        })
        .attr("id", function (d) {
          return d.data.spouses[0]?.id + "spouse";
        })
        .classed("tree-card", true)
        .attr("rx", "20")
        .attr("ry", "20")
        .classed("hide", function (d) {
          if (d.data.spouses[0]?.name == undefined) {
            console.log(true);
            return true;
          } else {
            console.log(false);
            return false;
          }
        });
      spouseRectangles2
        .enter()
        .append("line")

        .attr("x1", function (d) {
          return d.x + 70;
        })
        .attr("y1", function (d) {
          return d.y + 70;
        })
        .attr("x2", function (d) {
          return d.x + 100;
        })
        .attr("y2", function (d) {
          return d.y + 70;
        })
        .classed("hide", function (d) {
          if (d.data.spouses[0]?.name == undefined) {
            console.log(true);
            return true;
          } else {
            console.log(false);
            return false;
          }
        });

      names
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.name;
        })
        .attr("x", function (d) {
          return d.x ;
        })
        .attr("y", function (d) {
          return d.y + 120;
        })
        .classed("bigger", true);

      spouseNames
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.spouses[0]?.name;
        })
        .attr("x", function (d) {
          return d.x + 170;
        })
        .attr("y", function (d) {
          return d.y + 120;
        })
        .classed("bigger", true);

      surnames
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.surname;
        })
        .attr("x", function (d) {
          return d.x ;
        })
        .attr("y", function (d) {
          return d.y + 140;
        })
        .classed("bigger", true);

      spouseSurNames
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.spouses[0]?.surname;
        })
        .attr("x", function (d) {
          return d.x + 170;
        })
        .attr("y", function (d) {
          return d.y + 140;
        })
        .classed("bigger", true);

      let rects = document.querySelectorAll("rect");
      console.log(rects);
      rects.forEach((r, index) => {
        r.addEventListener("click", (e) => {
          if (r.id.includes("spouse")) {
            openModal(rects[index].__data__.data.spouses[0]);
          } else openModal(rects[index].__data__.data);
        });
      });
    }
  }, [r]);

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const openModal = (rect) => {
    setSelectedItem(rect);
    console.log(rect);
    setModal(true);
  };

  const changeDevice = () => {
    try {
      const formData = new FormData();
      formData.append("name", changeItem.name);
      formData.append("surname", changeItem.surname);
      formData.append("patr", changeItem.patr);
      formData.append("sex", changeItem.sex);
      formData.append("dateOfBirthday", changeItem.dateOfBirthday);
      if (changeItem.dateOfDeath)
        formData.append("dateOfDeath", changeItem.dateOfDeath);
      console.log(file);
      if (file) {
        console.log(file);
        formData.append("img", file);
      }

      if (changeItem.hasOwnProperty("personId")) {
        console.log(selectedItem.id);

        changeSpouse(selectedItem.id, formData).then((data) => {
          console.log(data);
          window.location.reload();
        });
      } else {
        changePerson(selectedItem.id, formData).then((data) => {
          console.log(data);
          window.location.reload();
          //window.location.reload()
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const createDevice = () => {
    try {
      const formData = new FormData();
      formData.append("name", createItem.name);
      formData.append("surname", createItem.surname);
      formData.append("patr", createItem.patr);
      formData.append("sex", createItem.sex);
      formData.append("dateOfBirthday", createItem.dateOfBirthday);
      if (createItem.dateOfDeath)
        formData.append("dateOfDeath", createItem.dateOfDeath);
      formData.append("img", file);
      console.log(formData);
      console.log(createItem);
      console.log(selectedItem.id);
      if (
        createItem.dateOfBirthday &&
        createItem.sex &&
        createItem.surname &&
        createItem.name
      ) {
        if (spouse) {
          formData.append("personId", selectedItem.id);
          createSpouse(formData).then((data) => {
            console.log(data);
            window.location.reload();
          });
        } else {
          formData.append("parent", createItem.parent);
          formData.append("familyId", createItem.familyId);
          createPerson(formData).then((data) => {
            console.log(data);
            window.location.reload();
            //window.location.reload()
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  const deleteDevice = () => {
    try {
      console.log(selectedItem);
      if (selectedItem.hasOwnProperty("personId")) {
        deleteSpouse(selectedItem.id, selectedItem.personId, id).then(
          (data) => {
            console.log(data);
            window.location.reload();
          }
        );
      } else {
        deletePerson(selectedItem.id, id).then((data) => {
          if (data != "1") {
            if (data.includes("нельзя")) {
              alert(data);
            }
          } else {
            window.location.reload();
          }

          //window.location.reload()
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Container fluid className="mt-3">
      <Modal active={modalDelete} setActive={setModalDelete}>
        <div >
          {selectedItem && (
            <Container fluid>
              <div className="modal-inner">
                <div className="modal-row">
                  <br></br>
                  <span>Вы действительно хотите удалить? </span>
                  <br></br>
                  {selectedItem.name + " "}
                  {selectedItem.surname}
                </div>
                <Button>
                  <div className="modal-row" onClick={deleteDevice}>
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
              <div className="modal-inner">
                <Image
                  className="image-modal"
                  width={300}
                  height={300}
                  src={process.env.REACT_APP_API_URL +'/'+ selectedItem.img}
                />
                <div className="modal-row">
                  <span>Имя: </span>
                  {selectedItem.name}
                </div>
                <div className="modal-row">
                  <span>Фамилия: </span>
                  {selectedItem.surname}
                </div>
                <div className="modal-row">
                  <span>Отчество: </span>
                  {selectedItem.patr}
                </div>
                <div className="modal-row">
                  <span>Пол: </span>
                  {selectedItem.sex}
                </div>
                <div className="modal-row">
                  <span>Дата рождения: </span>
                  {selectedItem.dateOfBirthday}
                </div>
                <div className="modal-row">
                  <span>Дата смерти: </span>
                  {selectedItem.dateOfDeath}
                </div>
                {(userData.role == "ADMIN" ||
                  (user.isAuth && tree.userId == userData.id)) && (
                  <>
                    <Button>
                      <div
                        className="modal-row"
                        onClick={() => {
                          setChangeItem(selectedItem);
                          setModalChange(true);
                        }}
                      >
                        Изменить
                      </div>
                    </Button>
                    <Button>
                      <div
                        className="modal-row"
                        onClick={() => {
                          setModalCreate(true);
                        }}
                      >
                        Добавить ребенка
                      </div>
                    </Button>

                    {selectedItem.hasOwnProperty("spouses") ? (
                      !selectedItem.spouses[0] && (
                        <Button>
                          <div
                            className="modal-row"
                            onClick={() => {
                              setSpouse(true);
                              setModalCreate(true);
                            }}
                          >
                            Добавить супруга
                          </div>
                        </Button>
                      )
                    ) : (
                      <></>
                    )}
                    <Button>
                      <div
                        className="modal-row"
                        onClick={() => {
                          setModal(false);
                          setModalDelete(true);
                        }}
                      >
                        Удалить
                      </div>
                    </Button>
                  </>
                )}
              </div>
            </Container>
          )}
        </div>
      </Modal>
      <Modal active={modalChange} setActive={setModalChange}>
        <div>
          {selectedItem && (
            <Container fluid>
              <Form className="modal-inner modal-inner_form">
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Фото</Form.Label>
                  <UploadAvatar setFile={setFile}></UploadAvatar>
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    placeholder="Имя"
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
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    placeholder="Фамилия"
                    value={changeItem.surname}
                    onChange={(e) =>
                      setChangeItem((prevState) => ({
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
                    value={changeItem.patr}
                    onChange={(e) =>
                      setChangeItem((prevState) => ({
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
                      inline
                      type="radio"
                      label="М"
                      checked={changeItem.sex == "М"}
                      name="inlineRadioOptions"
                      value={"М"}
                      id="inlineRadio1"
                      onChange={(e) =>
                        setChangeItem((prevState) => ({
                          ...prevState,
                          sex: e.target.value,
                        }))
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Ж"
                      checked={changeItem.sex == "Ж"}
                      value={"Ж"}
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      onChange={(e) =>
                        setChangeItem((prevState) => ({
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
                    type="date"
                    placeholder="Дата рождения"
                    value={changeItem.dateOfBirthday}
                    onChange={(e) =>
                      setChangeItem((prevState) => ({
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
                    value={changeItem.dateOfDeath}
                    onChange={(e) =>
                      setChangeItem((prevState) => ({
                        ...prevState,
                        dateOfDeath: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

                <Button className="modal-row" onClick={changeDevice}>
                  Сохранить
                </Button>
              </Form>
            </Container>
          )}
        </div>
      </Modal>

      <Modal
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        active={modalCreate}
        setActive={setModalCreate}
      >
        <div>
          {selectedItem && (
            <Container fluid>
              <Form className="modal-inner modal-inner_form">
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Фото</Form.Label>
                  <UploadAvatar setFile={setFile}></UploadAvatar>
                </Form.Group>
                <Form.Group className=" modal-row" controlId="formBasicEmail">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    required
                    placeholder="Имя"
                    value={createItem.name}
                    onChange={(e) =>
                      setCreateItem((prevState) => ({
                        ...prevState,
                        name: e.target.value,
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
                        parent: selectedItem.child,
                        familyId: id,
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
                  onClick={createDevice}
                >
                  Создать
                </Button>
              </Form>
            </Container>
          )}
        </div>
      </Modal>

      <Container fluid="xxl">
        <Row>
          {tree&&<h1>Дерево:{tree.name}</h1>}
        </Row>
      </Container>
      <Row className="d-flex flex-column m-3">
        <div className="class_b">
          <div id="details"></div>
        </div>
      </Row>
    </Container>
  );
});

export default TreePage;
