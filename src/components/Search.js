import { Button, Col, Container, Form, Row } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import {
  FAMILIES_ROUTE,FAMILY,USERS
} from "../utils/consts";
const Search =observer( () => {
    const [searchType,setSearchtype]=useState("Поиск по пользователям")
    const [searchTable,setSearchTable]=useState("User")
    const [value,setValue]=useState("")
    const { user} = useContext(Context);
    const history = useNavigate();
    const setSearch=()=>{
        try {
          user.setSearchTable(searchTable)
          user.setSearchValue(value)
          if(searchTable=="User")
          history(USERS)
        else{
          history(FAMILIES_ROUTE)
        }
          } catch (e) {
            console.error(e);
          }
    }
  return (
    
      
        <Form className="d-flex" style={{position:"relative"}}>
          <Form.Control
            type="search"
            placeholder={searchType}
            className="me-2 search-input"
            aria-label="Search"
            value={value}
            onChange={e=>setValue(e.target.value)}
          />
          <Form.Select className="search-select"  aria-label="Default select example"
          onChange={e=>{
            setValue("")
            setSearchTable(e.target.id)
            setSearchtype(e.target.value)}}>
            <option className="search-option" id="User" value="Поиск по пользователям">Поиск по пользователям</option>
            <option className="search-option" id="Family" value="Поиск по деревьям">Поиск по деревьям</option>

          </Form.Select>
          <Button
          onClick={()=>setSearch()}>Найти</Button>
        </Form>
      
   
  );
});

export default Search;
