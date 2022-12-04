import { useState } from "react";
import { SpinnerCircular } from 'spinners-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/LoginBox.css";

export default function LoginBox() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    'email': '',
    'password': ''
  })

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    await axios.post('http://127.0.0.1:8080/api/login', data)
      .then(response => {
        if (response.data.success) {
          window.localStorage.setItem("id", parseInt(response.data.param))
          navigate("/home");
        }
        //console.log(response.data)
      })
      .catch(error => console.log(error))
    await sleep(400);
    setIsLoading(false);
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <div className="box-login">
      <div className="login-box">
        <div className="left-side"></div>
        <div className="right-side">
          <h2>TaskManager</h2>
          <form action="" onSubmit={(e) => onSubmit(e)} method="post">
            <label htmlFor="">E-mail</label>
            <input type="text" required onChange={(e) => handle(e)} className="email" id="email" value={data.email} />
            <label htmlFor="">Password</label>
            <input type="text" required onChange={(e) => handle(e)} className="password" id="password" value={data.password} />
            {isLoading ? (
              <div>
                <SpinnerCircular className='loading' size={20} color='#7dd87b' thickness={200} secondaryColor={'white'} />
                <input type="submit" name="btn" id="btn" value={""} />
              </div>
            ) : (
              <input type="submit" name="btn" id="btn" value={"Entra"} />
            )}
          </form>
        </div>
      </div>
    </div>
  );

}