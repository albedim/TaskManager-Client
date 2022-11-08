import axios from "axios";
import { SpinnerCircular } from "spinners-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/SigninBox.css";

export default function SigninBox()
{
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const [data, setData] = useState({
        'email': '',
        'password': '',
        'nickname': '',
        'image': 'assets/albe.png'
    })

    const handle = (e) => {
        const newData = { ...data };
        newData[e.target.id] = e.target.value;
        setData(newData);
    }

    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        await axios.post("http://localhost:8080/api/signin", data)
        .then(response => {
            if(response.data.success){
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

    return(
        <div className="box-signin">
            <div className="signin-box">
                <div className="signin-left-side"></div>
                <div className="signin-right-side">
                    <h2>TaskManager</h2>
                    <form action="" onSubmit={(e) => onSubmit(e)} method="post">
                        <label htmlFor="">E-mail</label>
                        <input type="text" required onChange={(e) => handle(e)} className="email" id="email" value={data.email}/>
                        <label htmlFor="">Password</label>
                        <input type="text" required onChange={(e) => handle(e)} className="password" id="password" value={data.password} />
                        <label htmlFor="">Nickname</label>
                        <input type="text" required onChange={(e) => handle(e)} className="nickname" id="nickname" value={data.nickname} />
                        { !isLoading &&
                            <input type="submit" name="btn" value={"Registrati"} id="btn"/>
                        }
                        { isLoading &&
                            <div>
                                <SpinnerCircular className='loading' size={20} color='#7dd87b' thickness={200} secondaryColor={'white'}/>
                                <input type="submit" name="btn" value={""} id="btn"/>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </div>
    );

}