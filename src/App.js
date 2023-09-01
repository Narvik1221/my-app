import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import "./reset.css";
import MyPrice from "./components/MyPrice";
const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(0);
  const [deleteEvent, setDeleteEvent] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const url = new URL(
    "https://64dc9bc5e64a8525a0f6ccaa.mockapi.io/api/v1/calendare"
  );
  useEffect(() => {
    console.log("emptyeffect");
    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json) {
          console.log("json");
          console.log(json);
          console.log(json[0]);
          let myData = "";
          json.map((i,index) => {
              if(index==0)
            myData = i;
          });
          console.log("myData)");
          console.log(myData);
          let myArray = [];
          for (var key of Object.keys(myData)) {
            if (typeof myData[key] == "object") {
              myArray = [...myArray, myData[key]];

              myArray = myArray.filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t.date == value.date)
              );
              console.log(myData[key]);
              setEvents(myArray);
              console.log("myArray");
              console.log(myArray);
            }
          }
        }
      }).catch(err => console.log(err)) ;
  }, []);

  
  useEffect(() => {
    if(multiple)
   Create_Event_Fun()
  }, [selectedDate]);



  useEffect(() => {
    console.log("events ffect");
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
      console.log("events");
      console.log(events);
      fetch(url + "/1", requestOptions)
        .then((res) => res.json())
        .then((result) => {
          console.log("result");
          console.log(result);
        }).catch(err => console.log(err)) ;
    }
  }, [events]);

  useEffect(() => {
    const allDays = document.querySelectorAll(
      ".react-calendar__month-view__days__day"
    );
    const allDate = [...allDays].map((i) => i.children[0]);
    events.map((event) => {
      if (event.bonus > 0) {
        
        if (localStorage.hasOwnProperty(`${event.id}`)) {
          const date = JSON.parse(localStorage.getItem(`${event.id}`));
          allDate.forEach((i) => {
            if (i.ariaLabel == date) {
              if(event.bonus>2){
                i.classList.add(`hour2`);
              }
            
              i.classList.add(`hour${event.bonus - 1}`);
            }
          });
        }
      }
    });
  }, [events, month]);

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
    const selected = document.querySelector(".selected");
    console.log('date')
    console.log(date)
    setSelectedDate(date.toDateString());

  };
  useEffect(()=>{
      const allDays = document.querySelectorAll(".react-calendar__month-view__days__day");
      [...allDays].forEach(i=>{

      if(i.className=="react-calendar__tile react-calendar__month-view__days__day"){
        const child = i.querySelector("abbr");
        i.click()
        
      }

      })
  
  },[,month])

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

  const Update_Event_Fun = (eventId, hours) => {
    const selected = document.querySelector(".selected");
    const child = selected.querySelector("abbr");

    const updated_Events = events.map((event) => {
      if (event.id === eventId) {
        if (event.bonus + hours >= 0 && event.bonus + hours < 6) {
          if (hours <= 0) {
            child.classList.remove(`hour${event.bonus - 1}`);
          } else {
            child.classList.add(`hour${event.bonus-1}`);
            localStorage.setItem(
              `${event.id}`,
              JSON.stringify(child.ariaLabel)
            );
          }
          return {
            ...event,
            bonus: event.bonus + hours,
          };
        }
      }

      return event;
    });
    setEvents(updated_Events);
  };

  const Delete_Event_Fun = (eventId) => {
    setDeleteEvent(true);
    const updated_Events = events.filter((event) => event.id !== eventId);
    setEvents(updated_Events);

    const selected = document.querySelector(".selected");
    const child = selected.querySelector("abbr");

    events.forEach((event) => {
      if (event.id === eventId) {
        for (let i = 0; i < event.bonus; i++) {
          child.classList.remove(`hour${ i}`);
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
                onClick={(event)=>{
                  event.target.classList.toggle('active')
                  setMultiple(!multiple)}}
              >
                Быстрый режим {multiple?'вкл.':"выкл."}
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
                            <button
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
                            </button>{" "}
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
        >  </MyPrice>
       
       
        
      </div>{" "}
    </div>
  );
};

export default App;
