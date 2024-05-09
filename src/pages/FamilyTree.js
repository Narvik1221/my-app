import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import bigStar from "../assets/bigStar.png";
import Modal from "../Modal/Modal";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useParams } from "react-router-dom";
import uuid from "react-uuid";
import Table from "react-bootstrap/Table";
import * as d3 from "d3";
import {
  fetchOneTree,
  changePerson,
  changeSpouse,
  createPerson,
  createSpouse,
  deletePerson,
  deleteSpouse,
  createParent,
  fetchSearchFIO,
} from "../http/deviceAPI";
import { useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import UploadAvatar from "../components/UploadAvatar";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import Loader from "../components/Loader/Loader";
import ImageUpload from "../components/ImageUpload";
const TreePage = observer(() => {
  const { user } = useContext(Context);
  const [loading,setLoading]= useState(false);
  const [tree, setTree] = useState(false);
  const { id } = useParams();
  const [svg, setSvg] = useState(false);
  const [data, setData] = useState(false);
  const [h, setH] = useState(false);
  const [w, setW] = useState(false);
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
  const [parent, setParent] = useState(false);
  const [brother, setBrother] = useState(false);
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
  const [form, setForm] = useState(false);
  const [file, setFile] = useState(null);
  const [cloudUrl, setCloudUrl] = useState(false);
  const [scrollCoords, setScrollCoords] = useState(null);
  const [validated, setValidated] = useState(false);
  const [uuid, setUuid] = useState(false);
  const [cImg, setCimg] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchSurname, setSearchSurname] = useState("");
  const [searchPatr, setSearchPatr] = useState("");
  const [searchDataFio, setSearchDataFio] = useState(false);
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
    if (scrollCoords) {
      let person = document.querySelectorAll("#person");

      const ele = document.getElementById("container-drag");

      ele.scrollTo(
        scrollCoords.x.animVal.value * 0.85,
        scrollCoords.y.animVal.value
      );
      let pos = {
        top: 0,
        left: 0,
        x: 0,
        y: 0,
      };

      const mouseDownHandler = function (e) {
        pos = {
          top: ele.scrollTop,
          left: ele.scrollLeft,
          x: e.clientX,
          y: e.clientY,
        };

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
      };

      const mouseUpHandler = function () {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);

        ele.style.cursor = "grab";
        ele.style.removeProperty("user-select");
      };

      ele.addEventListener("mousedown", function (event) {
        ele.style.cursor = "grabbing";
        ele.style.userSelect = "none";
        mouseDownHandler(event);
      });
    }
  }, [scrollCoords]); //стартовая позиция окна
  useEffect(() => {}, [tree]);
  useEffect(() => {
    fetchOneTree(id, user.currentTree, user.spouseId).then((data) => {
      setTree(data);
      localStorage.removeItem("currentTree");
      localStorage.removeItem("spouse");
      localStorage.removeItem("spouseId");
    });
  }, [user.currentTree]);

  useEffect(() => {
    if (tree !== null && tree) {
      if (
        !tree.blocked &&
        (tree.public_tree || tree.userId == user.data || user.role == "ADMIN")
      ) {
        const counts = {};
        tree.people.forEach(function (x) {
          if (x.parent !== "") {
            if (x.spouses[0]) counts[x.parent] = (counts[x.parent] || 0) + 2;
            else counts[x.parent] = (counts[x.parent] || 0) + 1;
          }
        });

        let sum = 0;
        Object.entries(counts).forEach(([key, value]) => {
          if (value > 1) {
            sum += value;
          }
          // "someKey" "some value", "hello" "world", "js javascript foreach object"
        });
        setW(sum);
        setH(Object.keys(counts).length);
      }
    }
  }, [tree]);
  useEffect(() => {
    let myUser = localStorage.getItem("userData");

    if (myUser) {
      setUserData(JSON.parse(myUser));
    }
  }, []);

  useEffect(() => {
    if (
      !tree.blocked &&
      (tree.public_tree || tree.userId == user.data || user.role == "ADMIN")
    ) {
      if (tree) {
        setSvg(
          d3
            .select(".transform-component-module_content__FBWxo ")
            .append("svg")
            .attr(
              "width",
              w * 300 < window.screen.width
                ? window.screen.width + 200
                : w * 300 + 400 // tree.people.length * 300 < 1500 ? 1500 : tree.people.length * 400
            )
            .attr(
              "height",
              h * 300 < window.screen.height
                ? window.screen.height * 1.5
                : h * 350 + 400 // tree.people.length * 300 < 1000 ? 1000 : tree.people.length * 400
            )
            .append("g")
            .attr("transform", "translate(150,150)")
        );
      }
    }
  }, [w]);
  useEffect(() => {
    if (tree !== null && tree) {
      if (
        !tree.blocked &&
        (tree.public_tree || tree.userId == user.data || user.role == "ADMIN")
      ) {
        if (tree) {
          setData(tree.people);
        }
      }
    }
  }, [tree]);
  useEffect(() => {
    if (!modalCreate) {
      setCreateItem((prevState) => ({
        ...prevState,
        name: "",
        surname: "",
        patr: "",
        sex: "",
        dateOfBirthday: "",
        dateOfDeath: "",
        img: "",
      }));
    }
  }, [modalCreate]);

  useEffect(() => {
    if (data) {
      try {
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
        alert("Возникла ошибка при обработке файла");
      }
    }
  }, [data]);
  useEffect(() => {
    if (dataStructure) {
      var treeStructure = d3.tree().size([
        w * 300 < window.screen.width - window.screen.width / 9
          ? window.screen.width - window.screen.width / 9
          : w * 300,
        h * 300 < window.screen.height - window.screen.height / 2
          ? window.screen.height - window.screen.height / 2
          : h * 300,
        //tree.people.length * 300 < 1000 ? 1000 : tree.people.length * 300,
        // tree.people.length * 300 < 1300 ? 800 : tree.people.length * 300,
      ]);
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
            return d.data.img == "i.webp"
              ? "https://res.cloudinary.com/dlmr1ru52/image/upload/" +
                  d.data.img +
                  ".webp"
              : "https://res.cloudinary.com/dlmr1ru52/image/upload/" +
                  d.data.img;
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
            return d.data.spouses[0]?.img == "i.webp"
              ? "https://res.cloudinary.com/dlmr1ru52/image/upload/" +
                  d.data.spouses[0]?.img +
                  ".webp"
              : "https://res.cloudinary.com/dlmr1ru52/image/upload/" +
                  d.data.spouses[0]?.img;
          })
          .classed("img-card", true)
          .classed("hide", function (d) {
            if (d.data.spouses[0]?.name == undefined) {
              return true;
            } else {
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
        .attr("id", function (d) {
          return "person";
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
            return true;
          } else {
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
            return true;
          } else {
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
          return d.x;
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
          return d.data.surname.length > 10
            ? d.data.surname.slice(0, 10) + "..."
            : d.data.surname.slice(0, 10);
        })
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y + 140;
        })
        .classed("bigger", true);

      spouseSurNames
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.spouses[0]?.surname.length > 10
            ? d.data.spouses[0]?.surname.slice(0, 10) + "..."
            : d.data.spouses[0]?.surname.slice(0, 10);
        })
        .attr("x", function (d) {
          return d.x + 170;
        })
        .attr("y", function (d) {
          return d.y + 140;
        })
        .classed("bigger", true);

      let rects = document.querySelectorAll("rect");

      setScrollCoords({
        x: rects[0].x,
        y: rects[0].y,
      });
      rects.forEach((r, index) => {
        r.addEventListener("click", (e) => {
          if (r.id.includes("spouse")) {
            openModal(rects[index].__data__.data.spouses[0]);
          } else openModal(rects[index].__data__.data);
        });
      });
    }
  }, [r]);

  const openModal = (rect) => {
    setSelectedItem(rect);

    setModal(true);
  };

  const changeDevice = (e) => {
    try {
      e.preventDefault()
      const formData = new FormData();
      formData.append("name", changeItem.name);
      formData.append("surname", changeItem.surname);
      formData.append("patr", changeItem.patr);
      formData.append("sex", changeItem.sex);
      formData.append("dateOfBirthday", changeItem.dateOfBirthday);
      if (changeItem.dateOfDeath)
        formData.append("dateOfDeath", changeItem.dateOfDeath);

      if (file && uuid) {
        uploadImage();
        formData.append("img", uuid);
      }
      if (changeItem.hasOwnProperty("personId")) {
        changeSpouse(selectedItem.id, formData).then((data) => {});
      } else {
        changePerson(selectedItem.id, formData).then((data) => {});
      }
      if (!!file==false) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (form) {
      createDevice();
    }
  }, [form]);

  const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }; //уникальный id для создаваемого родителя

  const uploadImage = async () => {
    setLoading(true)
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    data.append("public_id", uuid);

    if (file && uuid) {
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const res = await response.json();
        if(!!res){
          setLoading(false)
          window.location.reload();
        }
        
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createDevice = () => {
    try {
 
      let myFormData = new FormData();
      myFormData.append("familyId", createItem.familyId);
      myFormData.append("spouse", selectedItem.spouse);
      myFormData.append("name", createItem.name);
      myFormData.append("surname", createItem.surname);

      if (createItem.patr) myFormData.append("patr", createItem.patr);

      myFormData.append("sex", createItem.sex);
      myFormData.append("dateOfBirthday", createItem.dateOfBirthday);
      if (createItem.dateOfDeath)
        myFormData.append("dateOfDeath", createItem.dateOfDeath);
      if (file && uuid) {
        uploadImage();
        myFormData.append("img", uuid);
      }

      if (parent) {
        myFormData.append("parent", "");
        myFormData.append("current", uid());
        myFormData.append("currentId", selectedItem.id);
      } else if (brother) {
        if (selectedItem.parent == "") {
          myFormData.append("parent", "");
          myFormData.append("current", uid());
          myFormData.append("currentId", selectedItem.id);
        } else {
          myFormData.append("parent", selectedItem.parent);
        }
      } else {
        myFormData.append("parent", createItem.parent);
      }

      if (myFormData.has("name")) {
        if (
          createItem.dateOfBirthday &&
          createItem.sex &&
          createItem.surname &&
          createItem.name
        ) {
          if (spouse) {
            myFormData.append("personId", selectedItem.id);

            createSpouse(myFormData).then((data) => {
              // window.location.reload();
            });
          } else if (parent && myFormData.has("current")) {
            createParent(myFormData).then((data) => {
              // window.location.reload();
            });
          } else {
            createPerson(myFormData).then((data) => {
              // window.location.reload();
            });
          }
        }
      }
      if (!!file==false) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteDevice = () => {
    try {
      if (selectedItem.hasOwnProperty("personId")) {
        deleteSpouse(selectedItem.id, selectedItem.personId, id).then(
          (data) => {
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
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCheck = () => {
    let check = selectedItem.child;

    if (selectedItem.hasOwnProperty("personId")) {
      check = data.filter((i) => i.id == selectedItem.personId)[0].child;
    }
    let c = data.filter((d) => d.parent == check);

    if (c.length > 0) return true;
    else {
      return false;
    }
  };

  const searchFIO = async () => {
    try {
      let n = searchName;
      let s = searchSurname;
      let p = searchPatr;
      const response = await fetchSearchFIO(id, n, s, p);
      setSearchDataFio(response);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      {tree ? (
        !tree.blocked &&
        (tree.public_tree ||
          tree.userId == user.data ||
          user.role == "ADMIN") ? (
          <Container fluid className="mt-3">
            <Modal
              modalSearchWidth={"70vw"}
              active={modalSearch}
              setActive={setModalSearch}
            >
              <Container className="container-search" fluid>
                <Form className="d-flex" style={{ position: "relative" }}>
                  <Form.Control
                    type="search"
                    placeholder={"Имя"}
                    className="me-2 search-input fio"
                    aria-label="Search"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <Form.Control
                    type="search"
                    placeholder={"Фамилия"}
                    className="me-2 search-input fio"
                    aria-label="Search"
                    value={searchSurname}
                    onChange={(e) => setSearchSurname(e.target.value)}
                  />
                  <Form.Control
                    type="search"
                    placeholder={"Отчество"}
                    className="me-2 search-input fio"
                    aria-label="Search"
                    value={searchPatr}
                    onChange={(e) => setSearchPatr(e.target.value)}
                  />
                  <Button onClick={() => searchFIO()}>Найти</Button>
                </Form>
                <div className="search__result">
                  {searchDataFio.length > 0 ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Имя </th>
                          <th>фамилия</th>
                          <th>Отчество</th>
                          <th>Пол</th>
                          <th>Дата рождения</th>
                          <th>Дата смерти</th>
                        </tr>
                      </thead>

                      <tbody>
                        {searchDataFio.map((d, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{d.name}</td>
                            <td>{d.surname}</td>
                            <td>{d.patr}</td>
                            <td>{d.sex}</td>
                            <td>{d.dateOfBirthday}</td>
                            <td>{d.dateOfDeath}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    searchDataFio && <h3>Ничего не найдено</h3>
                  )}
                </div>
              </Container>
            </Modal>
            <Modal active={modalDelete} setActive={setModalDelete}>
              <div>
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
                        src={
                          selectedItem.img == "i.webp"
                            ? "https://res.cloudinary.com/dlmr1ru52/image/upload/" +
                              selectedItem.img +
                              ".webp"
                            : "https://res.cloudinary.com/dlmr1ru52/image/upload/" +
                              selectedItem.img
                        }
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
                          {selectedItem.hasOwnProperty("parent") && (
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
                          )}
                          {selectedItem.hasOwnProperty("parent") && (
                            <Button>
                              <div
                                className="modal-row"
                                onClick={() => {
                                  setBrother(true);
                                  setModalCreate(true);
                                }}
                              >
                                Добавить брата/сестру
                              </div>
                            </Button>
                          )}
                          {selectedItem.hasOwnProperty("personId") && (
                            <Button>
                              <div
                                className="modal-row"
                                onClick={() => {
                                  if (user.currentTree != -1) {
                                    localStorage.setItem(
                                      "currentTree",
                                      JSON.stringify(-1)
                                    );
                                  } else {
                                    let cur = data.filter(
                                      (i) => i.id == selectedItem.personId
                                    );
                                    console.log(JSON.stringify(cur[0].child));
                                    localStorage.setItem(
                                      "currentTree",
                                      cur[0].child
                                    );
                                    localStorage.setItem(
                                      "spouseId",
                                      JSON.stringify(selectedItem.id)
                                    );
                                    localStorage.setItem(
                                      "spouse",
                                      JSON.stringify({
                                        name: selectedItem.name,
                                        surname: selectedItem.surname,
                                      })
                                    );
                                  }

                                  window.location.reload();
                                }}
                              >
                                Открыть дерево супруга
                              </div>
                            </Button>
                          )}
                          {selectedItem.parent == "" ? (
                            <Button>
                              <div
                                className="modal-row"
                                onClick={() => {
                                  setParent(true);
                                  setModalCreate(true);
                                }}
                              >
                                Добавить мать/отца
                              </div>
                            </Button>
                          ) : (
                            <></>
                          )}
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
                          {!deleteCheck() ? (
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
                          ) : (
                            <></>
                          )}
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
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="modal-inner modal-inner_form"
                    >
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Фото</Form.Label>
                        <UploadAvatar
                          setUuid={setUuid}
                          setFile={setFile}
                        ></UploadAvatar>
                      </Form.Group>
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Пол</Form.Label>
                        <Form.Group
                          className=" modal-row"
                          controlId="formBasicEmail"
                        >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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

                      <Button
                        type="button"
                        className="modal-row"
                        onClick={changeDevice}
                      >
                        {loading?"Загрузка...":"Сохранить"}
                      </Button>
                    </Form>
                  </Container>
                )}
              </div>
            </Modal>

            <Modal active={modalCreate} setActive={setModalCreate}>
              <div>
                {selectedItem && (
                  <Container fluid>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="modal-inner modal-inner_form"
                    >
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Фото</Form.Label>
                        <UploadAvatar
                          setUuid={setUuid}
                          setFile={setFile}
                        ></UploadAvatar>
                      </Form.Group>
                      {/* <ImageUpload uuid={uuid} image1={file}></ImageUpload> */}
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Пол</Form.Label>
                        <Form.Group
                          className=" modal-row"
                          controlId="formBasicEmail"
                        >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                      <Form.Group
                        className=" modal-row"
                        controlId="formBasicEmail"
                      >
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
                          console.log("selectedItem");
                          console.log(selectedItem.id);
                          if (spouse) {
                            console.log(spouse);
                            setForm({
                              personId: selectedItem.id,
                              name: createItem.name,
                              surname: createItem.surname,
                              patr: createItem.patr,
                              sex: createItem.sex,
                              dateOfBirthday: createItem.dateOfBirthday,
                              dateOfDeath: createItem.dateOfDeath,
                              img: file,
                            });
                          } else {
                            setForm({
                              name: createItem.name,
                              surname: createItem.surname,
                              patr: createItem.patr,
                              sex: createItem.sex,
                              dateOfBirthday: createItem.dateOfBirthday,
                              parent: createItem.parent,
                              familyId: createItem.familyId,
                              dateOfDeath: createItem.dateOfDeath,
                              img: file,
                            });
                          }
                        }}
                      >
                          {loading?"Загрузка...":"Создать"}
                      </Button>
                    </Form>
                  </Container>
                )}
              </div>
            </Modal>

            <Container fluid="xxl">
              <Container className="tree-navbar" fluid="xxl">
                {tree && (
                  <>
                    <h3 className="title-text">
                      {" "}
                      <a
                        onClick={() => {
                          localStorage.removeItem("currentTree");
                          localStorage.removeItem("spouse");
                          localStorage.removeItem("spouseId");
                          window.location.reload();
                        }}
                        className="pointer-link"
                      >
                        Дерево:{tree.name}{" "}
                      </a>{" "}
                      {user.spouse &&
                        "->Супруг: " +
                          user.spouse.name +
                          " " +
                          user.spouse.surname}{" "}
                    </h3>

                    <Button onClick={() => setModalSearch(true)}>
                      Поиск по ФИО
                    </Button>
                  </>
                )}
              </Container>
              {/* {cImg && (
          <>
            <AdvancedImage cldImg={cImg} />
          </>
        )} */}
            </Container>
            <div className="container-tree">
              <Row className="my-cont d-flex flex-column m-3">
                <div className="class_b-container">
                  <div id="container-drag" className="container-drag">
                    <TransformWrapper
                      minScale={0.3}
                      maxScale={1.5}
                      initialScale={1}
                      panning={{
                        disabled: true,
                      }}
                    >
                      <TransformComponent></TransformComponent>
                    </TransformWrapper>
                  </div>
                </div>
              </Row>
            </div>
          </Container>
        ) : (
          <div style={{ textAlign: "center" }} className="container modal-row">
            Доступ заблокирован
          </div>
        )
      ) : (
        <Loader></Loader>
      )}
    </>
  );
});

export default TreePage;
