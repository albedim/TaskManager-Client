import { useState } from "react";
import "./styles/LoginBox.css";

export default function LoginBox()
{

    const [data, setData] = useState({
        'email': '',
        'password': ''
    })

    const handle = (e) => {
        const newData = { ...data };
        newData[e.target.id] = e.target.value;
        setData(newData);
    }


    const onSubmit = (e) => {
        e.preventDefault();
        console.log(data)
    }

    return(
        <div className="box-login">
            <div className="login-box">
                <div className="left-side"></div>
                <div className="right-side">
                    <h2>TaskManager</h2>
                    <form action="" onSubmit={(e) => onSubmit(e)} method="post">
                        <label htmlFor="">E-mail</label>
                        <input type="text" onChange={(e) => handle(e)} className="email" id="email" value={data.email}/>
                        <label htmlFor="">Password</label>
                        <input type="text" onChange={(e) => handle(e)} className="password" id="password" value={data.password} />
                        <input type="submit" name="btn" id="btn"/>
                    </form>
                </div>
            </div>
        </div>
    );

}