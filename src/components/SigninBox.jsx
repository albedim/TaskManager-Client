import axios from "axios";
import { SpinnerCircular } from "spinners-react";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import "./styles/SigninBox.css";

export const SigninBox = () => {
  const [image, setImage] = useState('')

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState({
    'email': '',
    'password': '',
    'nickname': '',
    'image': ''
  })

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  /*

  const submitImage = async () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result.toString())
    }
    reader.readAsDataURL(document.querySelector("#image").files[0])
    console.log(image)
    await axios.post("http://localhost:8080/api/v_1_0_0/user/saveImage", image)
      .then(response => { console.log(response.data) })
      .catch(error => { console.log(error) })
  }

  */

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    submitImage();
    await axios.post("/user/signin", data)
      .then(response => {
        if (response.data.success) {
          navigate("/");
        }
      })
      .catch(error => { console.log(error) })
    await sleep(400);
    setIsLoading(false);
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <div className="box-signin">
      <div className="signin-box">
        <div className="signin-left-side"></div>
        <div className="signin-right-side">
          <h2>TaskManager</h2>
          <form action="" onSubmit={(e) => onSubmit(e)} method="post">
            <label htmlFor="">E-mail</label>
            <input type="text" required onChange={(e) => handle(e)} className="email" id="email" value={data.email} />
            <label htmlFor="">Password</label>
            <input type="text" required onChange={(e) => handle(e)} className="password" id="password" value={data.password} />
            <label htmlFor="">Nickname</label>
            <input type="text" required onChange={(e) => handle(e)} className="nickname" id="nickname" value={data.nickname} />
            <input type="file" required onChange={(e) => handle(e)} className="image" id="image" value={data.image} />
            {!isLoading ? (
              <input type="submit" name="btn" value={"Registrati"} id="btn" />
            ) : (
              <div>
                <SpinnerCircular className='loading' size={20} color='#7dd87b' thickness={200} secondaryColor={'white'} />
                <input type="submit" name="btn" value={""} id="btn" />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );

}