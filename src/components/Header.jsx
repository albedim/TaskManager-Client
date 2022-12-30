import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Header.css";
import { ENDPOINT } from "../Utils.ts";

export const Header = () => {

  const navigate = useNavigate();

  const [data, setData] = useState({});

  const logout = (e) => {
    window.localStorage.removeItem("id");
    navigate("/");
  }

  const getData = () => {
    axios.get(ENDPOINT + "/user/get?id=" + window.localStorage.getItem("id"))
    .then(response => { setData(response.data) })
    .catch(error => { console.log(error) })
  }

  useEffect(() => {
    isLoggedIn();
    getData();
  }, [])

  const isLoggedIn = () => {
    if (window.localStorage.getItem("id") === null) {
      navigate("/");
    }
  }

  return (
    <div className="header">
      <div onClick={(e) => logout(e)}>
        <ion-icon name="log-out-outline"></ion-icon>
      </div>
      <h2>{data.nickname}</h2>
      <img src={data.image} alt="" />
    </div>
  );
}