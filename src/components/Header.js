import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Header.css";

export default function Home()
{

    const navigate = useNavigate();

    const [data, setData] = useState({});

    const logout = (e) => {
        window.localStorage.removeItem("id");
        navigate("/");
    }

    const getData = () => {
        axios.get("http://localhost:8080/api/user?id=" + window.localStorage.getItem("id"))
        .then(response => { setData(response.data) })
        .catch(error => { console.log(error) })
    }

    useEffect(() => {
        getData();
    },[])

    const isLoggedIn = () => {
        if(window.localStorage.getItem("id") === null){
            navigate("/");
        }
    }

    useEffect(() => {
        isLoggedIn();
    })

    return(
        <div className="header">
            <div onClick={(e) => logout(e)}>
                <ion-icon name="log-out-outline"></ion-icon>
            </div>
            <h2>{data.nickname}</h2>
            <img src={data.image} alt="" />
        </div>
    );
}