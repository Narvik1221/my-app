import React, { useEffect, useState, useRef } from "react";
export default function MyPrice({children, month, setMonth, events, deleteEvent }) {
  const [total, setTotal] = useState(45000);
  const [current, setCurrent] = useState(0);
  const [bonusHours,setBonusHours]=useState(0)
  const [workedDays, setWorkedDays] = useState(null);
  const [weekendDays, setweekendDays] = useState(null);
  const [priceForDay, setPriceForDay] = useState();
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {

    currentPrices()
  }, [events,workedDays,weekendDays]);

  const currentPrices=()=>{
  
    const myMonth=document.querySelector(".react-calendar__navigation__label__labelText.react-calendar__navigation__label__labelText--from")
    //console.log(events)
    let prices=0
    let bonus=0
    events.forEach((e) => {
      if(e.month==myMonth.textContent)
      {
       
        if(e.selected.indexOf("react-calendar__month-view__days__day--weekend") >= 0)
        {
          prices+=2
          if(e.bonus>=0){
            for(let i=1;i<=e.bonus*2;i++){
   
              if(i>2){
                bonus+=2*Math.round(total / workedDays / 16)
              }
              else{
                bonus+=1.5*Math.round(total / workedDays / 16)
              }
            }
          }
        }
        else{
          prices+=1
          if(e.bonus>=0){
            for( let i=1;i<=e.bonus*2;i++){
                //console.log('priceForDay')
              console.log(Math.round(total / workedDays / 16))
              if(i>2){
                bonus+=2*Math.round(total / workedDays / 16)
              }
              else{
                bonus+=1.5*Math.round(total / workedDays / 16)
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
  }, [events,month]);
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
        {}
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
      
    </div>
  );
}
