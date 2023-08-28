import React, { useEffect, useState, useRef } from "react";
export default function MyPrice({children, month, setMonth, events, deleteEvent }) {
  const [total, setTotal] = useState(45000);
  const [current, setCurrent] = useState(0);
  const [bonusHours,setBonusHours]=useState(0)
  const [workedDays, setWorkedDays] = useState(null);
  const [weekendDays, setweekendDays] = useState(null);
  const [priceForDay, setPriceForDay] = useState();
  const [searchValue, setSearchValue] = useState("");


  const url = new URL(
    "https://64dc9bc5e64a8525a0f6ccaa.mockapi.io/api/v1/calendare/2"
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
  
          console.log("total");
          console.log(json);
          for (var key of Object.keys(json)) {
            const myTotal=+json[key]
            console.log(myTotal);

            setTotal(myTotal)
            }
         
      });
  }, []);

  const changeTotal=(searchValue)=>{
    const myTotal={"total":searchValue}
      let requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
        },
       
        body: JSON.stringify(myTotal),
      };
      fetch(url , requestOptions)
        .then((res) => res.json())
        .then((result) => {
          console.log(result)
        });
  }
  useEffect(() => {
    setPriceForDay(Math.round(total / workedDays / 8))
  }, [total,workedDays]);
  useEffect(() => {
    console.log('workedDays')
    console.log(workedDays)
    currentPrices()
  }, [events,workedDays]);

  const currentPrices=()=>{
    console.log("curPR")
    const myMonth=document.querySelector(".react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from")
    //console.log(events)
    let prices=0
    let bonus=0
    events.forEach((e) => {
      if(e.month==myMonth.textContent)
      {
        console.log(events)
        if(e.selected.indexOf("react-calendar__month-view__days__day--weekend") >= 0)
        {
          prices+=2
          if(e.bonus>=0){
            for(let i=1;i<=e.bonus;i++){
                //console.log('priceForDay')
                //console.log(Math.round(total / workedDays / 8))
              //console.log(total,workedDays)
              if(i>2){
                bonus+=4*Math.round(total / workedDays / 8)
              }
              else{
                bonus+=3*Math.round(total / workedDays / 8)
              }
            }
          }
        }
        else{
          prices+=1
          if(e.bonus>=0){
            for( let i=1;i<=e.bonus;i++){
                //console.log('priceForDay')
              console.log(Math.round(total / workedDays / 8))
              if(i>2){
                bonus+=2*Math.round(total / workedDays / 8)
              }
              else{
                bonus+=1.5*Math.round(total / workedDays / 8)
              }
            }
          }
          
          
        }
      
      }

    }
    );
    //console.log(events)
    //console.log(prices)
    //console.log(bonus)
    setCurrent(prices)
    setBonusHours(bonus)
  }

  useEffect(() => {
    const neighboringDays = document.querySelectorAll(
      ".react-calendar__month-view__days__day--neighboringMonth"
    );
    const allDays = document.querySelector(".react-calendar__month-view__days");
    const weekendDays = document.querySelectorAll(
      ".react-calendar__month-view__days__day--weekend"
    );
    const doubleDays = document.querySelectorAll(
      ".react-calendar__month-view__days__day--neighboringMonth.react-calendar__month-view__days__day--weekend"
    );
      
    setweekendDays([...weekendDays].length - [...doubleDays].length);
    setWorkedDays(
      allDays.children.length -
        [...neighboringDays].length -
        
        [...weekendDays].length +
        [...doubleDays].length
    );
  }, [,month]);
  return (
    <div className="total-inner">
      <div className="total-top current">
      <h4 className="total-price ">
        {" "}
        ЗП текущая :<br></br><span id="X">{current*Math.round(total / workedDays)+bonusHours} $</span> 
      </h4>
        {children}
      </div>
        <div className="total-top">
        <h4 className="total-price">
        {" "}
        ЗП за месяц:<br></br><span id="X">{total} $</span> 
      </h4>
        <form className="search">
        <input
          className="search-input"
          type="text"
          name="name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Изменить ЗП "
        />
        <button
          className="search-button"
          onClick={(e) => {
            e.preventDefault();
            setTotal(searchValue);
            setSearchValue("");
            changeTotal(searchValue)
          }}
        >
          Cохранить
        </button>
      </form>
        </div>
    
      

      
      <p className="total-count top">
        Рабочие дни: <span id="X" >{workedDays}</span>{" "}
      </p>
      <p className="price-for-day">
        Ставка за день: <span id="X">{Math.round(total / workedDays)} $</span>
      </p>
      <p className="price-for-day">
        Ставка за час:{" "}
        <span id="X">{Math.round(total / workedDays / 8)} $ </span>
      </p>
      <br></br>
      <p className="total-count top">
        Выходные дни: <span id="X" className="top">{weekendDays}</span>{" "}
      </p>
      <p className="price-for-day">
        Ставка за день{" "}
        <span id="X">X2: {Math.round((total / workedDays) * 2)} $ </span>
      </p>
      <p className="price-for-day">
        Ставка за час{" "}
        <span id="X">X2: {Math.round(total / workedDays / 4)} $</span>
      </p>
      <br></br>
      <p className="total-count top">Подработка:</p>
      <p className="price-for-day">
        Ставка за 1-2 часа{" "}
        <span id="X">X1,5: {Math.round((total / workedDays / 8) * 1.5)} $</span>
      </p>
      <p className="price-for-day">
        Ставка за 3 часа{" "}
        <span id="X">X2 : {Math.round(total / workedDays / 4)} $</span>
      </p>
      <br></br>
      <p className="total-count top">Подработка в выходные:</p>
      <p className="price-for-day">
        Ставка за 1-2 часа{" "}
        <span id="X">X3: {Math.round((total / workedDays / 8) * 3)} $</span>
      </p>
      <p className="price-for-day">
        Ставка за 3 часа{" "}
        <span id="X">X4 : {Math.round(total / workedDays / 2)} $</span>
      </p>
    </div>
  );
}
