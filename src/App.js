import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import "./reset.css";
import MyPrice from "./components/MyPrice";
const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(0);
  const [deleteEvent, setDeleteEvent] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const options = [
    "0",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "4.5",
    "5",
  ];
  const url = new URL(
    "https://64dc9bc5e64a8525a0f6ccaa.mockapi.io/api/v1/calendare"
  );
  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json) {
          let myData = "";
          json.map((i, index) => {
            if (index == 0) myData = i;
          });

          let myArray = [];
          for (var key of Object.keys(myData)) {
            if (typeof myData[key] == "object") {
              myArray = [...myArray, myData[key]];

              myArray = myArray.filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t.date == value.date)
              );

              setEvents(myArray);
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (multiple) Create_Event_Fun();
  }, [selectedDate]);


 useEffect(() => {
  console.log(', month')
    const allDays = document.querySelectorAll(
      ".react-calendar__month-view__days__day"
    );
    const allDate = [...allDays].map((i) => i.children[0]);
    events.map((event,index) => {
      if (event.bonus > 0) {
        if (localStorage.hasOwnProperty(`${event.id}`)) {
          let date= JSON.parse(localStorage.getItem(`${event.id}`))
          console.log(event.id)
          console.log(date)
          allDate.forEach((i,index) => {
            if(date==i.ariaLabel){
              let elem = document.createElement("span");
              elem.textContent = event.bonus+''
              if(i.lastChild.nodeName!='SPAN'){
                i.appendChild(elem)
              }
            }
          
         });
        }
      }
    });
   
  }, [events, month]);



  useEffect(() => {
    console.log("events ffect");
    console.log(events)
    if (events.length > 0) {
      let requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
        },
        body: JSON.stringify(events),
      };

      fetch(url + "/1", requestOptions)
        .then((res) => res.json())
        .then((result) => {})
        .catch((err) => console.log(err));
    }
  }, [events]);
  
  function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }

  const prevMonth = () => {
    setMonth(month - 1);
    const arrow = document.querySelector(
      ".react-calendar__navigation__prev-button"
    );
    setSelectedDate(null);
    arrow.click();
  };

  const nextMonth = () => {
    setMonth(month + 1);
    const arrow = document.querySelector(
      ".react-calendar__navigation__next-button"
    );
    setSelectedDate(null);
    arrow.click();
  };

  const Date_Click_Fun = (date) => {
    setSearchParams(0);
    const selected = document.querySelector(".selected");

    setSelectedDate(date.toDateString());
  };


  const Create_Event_Fun = () => {
    const myMonth = document.querySelector(
      ".react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from"
    );
    let selected = document.querySelector(".selected");
    if (selectedDate) {
      const newEvent = {
        id: new Date().getTime(),
        date: selectedDate,
        bonus: 0,
        month: myMonth.textContent,
        selected: selected.className,
      };
      if (!events.some((i) => i.date == selectedDate)) {
        setDeleteEvent(false);
        setEvents([...events, newEvent]);
        setSelectedDate(null);
        setSelectedDate(newEvent.date);
      }
    }
  };

  const Update_Event_Fun = (eventId) => {
    const selected = document.querySelector(".selected");
    const child = selected.querySelector("abbr");

    let hours =roundUp(+searchParams, 1) 
    let elem = document.createElement("span");
    searchParams=='0'? elem.textContent='': elem.textContent = searchParams
    console.log(elem);

    const updated_Events = events.map((event) => {
      if (event.id === eventId ) {
        let spanText = child.querySelector("span");
        console.log(spanText !== null);
        if (spanText !== null) {
          console.log("spanText");
          spanText.textContent = elem.textContent;
          console.log(spanText);
        } else {
          console.log("else");
          child.appendChild(elem);
        }
        localStorage.setItem(`${event.id}`, JSON.stringify(child.ariaLabel));

        return {
          ...event,
          bonus: hours,
        };
      }

      return event;
    });
    setEvents(updated_Events);
  };

  function selectChange(e) {
    console.log(e.target.value);
    setSearchParams(e.target.value);
  }

  const Delete_Event_Fun = (eventId) => {
    setDeleteEvent(true);
    const updated_Events = events.filter((event) => event.id !== eventId);
    setEvents(updated_Events);

    const selected = document.querySelector(".selected");
    const child = selected.querySelector("abbr");
    let spanText = child.querySelector("span");
    events.forEach((event) => {
      if (event.id === eventId) {
        if (spanText !== null) {
          child.removeChild(spanText);
        } 
      }
    });
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">
          {" "}
          Именной календарь Юрия Владимировича Пономарёва{" "}
        </h1>
        <div className="calendar-container">
          <div className="buttons">
            <button className="prev" onClick={prevMonth}>
              <div className="left-arrow"></div>
            </button>
            <button className="next" onClick={nextMonth}>
              <div className="right-arrow"></div>
            </button>
          </div>
          <Calendar
            value={selectedDate}
            onClickDay={Date_Click_Fun}
            tileClassName={({ date }) =>
              selectedDate && date.toDateString() === selectedDate
                ? "selected"
                : events.some((event) => {
                    return event.date === date.toDateString();
                  })
                ? "event-marked"
                : ""
            }
          />{" "}
        </div>
        <div className="event-container">
          {selectedDate && (
            <div className="event-form">
              <button
                className="create-btn"
                onClick={(event) => {
                  event.target.classList.toggle("active");
                  setMultiple(!multiple);
                }}
              >
                Быстрый режим {multiple ? "вкл." : "выкл."}
              </button>{" "}
              <button
                className="create-btn"
                onClick={(event) => Create_Event_Fun(selectedDate)}
              >
                Добавить смену{" "}
              </button>{" "}
            </div>
          )}
          {events.length > 0 && selectedDate && (
            <div className="event-list">
              <div className="event-cards">
                {events.map((event) => {
                  if (event) {
                    return event.date === selectedDate ? (
                      <div key={event.id} className="event-card">
                        <div className="event-card-header">
                          <span className="event-date"> {event.date} </span>{" "}
                          <div className="event-actions">
                            <button
                              className="delete-btn"
                              onClick={() => Delete_Event_Fun(event.id)}
                            >
                              Удалить смену{" "}
                            </button>{" "}
                            <form className="search">
                              <select
                                className="search-input"
                                onChange={selectChange}
                              >
                                {options.map((option, index) => (
                                  <option key={index} id={index} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="delete-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  Update_Event_Fun(event.id, searchParams);
                                }}
                              >
                                  + доп часы
                              </button>
                            </form>{" "}
                             {/* <button
                              className="delete-btn"
                              onClick={() => {
                                Update_Event_Fun(event.id, 1);
                              }}
                            >
                              + час подработки{" "}
                            </button>{" "}
                            <button
                              className="delete-btn"
                              onClick={() => {
                                Update_Event_Fun(event.id, -1);
                              }}
                            >
                              - час подработки{" "}
                            </button>{" "}  */}
                          </div>{" "}
                        </div>{" "}
                        <div className="event-card-body">
                          <p className="event-title"> {event.title} </p>{" "}
                        </div>{" "}
                      </div>
                    ) : null;
                  }
                })}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <MyPrice
          month={month}
          setMonth={setMonth}
          events={events}
          deleteEvent={deleteEvent}
        >
          {" "}
        </MyPrice>
      </div>{" "}
    </div>
  );
};

export default App;
