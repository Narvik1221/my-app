import React, {useContext,useEffect, useState} from 'react';
import {fetchBasketDevice} from "../http/deviceAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import DeviceItem from "../components/DeviceItem";
import {Row} from "react-bootstrap";
const Basket = observer(() => {
    const [items, setItems] = useState( [])
    const {device} = useContext(Context)
    useEffect(() => {
        let myUser= JSON.parse(localStorage.getItem('user'))
        if(myUser.id){
        fetchBasketDevice(myUser.id).then(data => {
            console.log(data)
            device.setBaskets(data)
        })
        }
    }, [])
    return (
      <>
         <Row className="d-flex justify-content-center" >
            <h1>Корзина</h1>
     </Row>
         <Row className="d-flex justify-content-center" >
         {device.baskets.map(device =>
             <DeviceItem deleteButton={true} key={device.id} device={device}/>
         )}
     </Row>
      </>
     
    );
});

export default Basket;
