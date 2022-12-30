import axios from "axios";
import { SpinnerCircular } from "spinners-react";
import { useEffect, useState } from "react";
import "./styles/EditTask.css";
import "./styles/AddTask.css";
import "./styles/TodoTasks.css";
import "./styles/DoingTasks.css";
import "./styles/DoneTasks.css";
import { AT, CREATED_BY, CREATED_BY_AT, DOING_TITLE, DONE_TITLE, EDIT_FINISH_DATE, EDIT_STATUS, ENDPOINT, NEXT, TODO_TITLE, TO_FINISH_ON } from "../Utils.ts";


export const Tasks = () => {
  const [data, setData] = useState({
    'userId': window.localStorage.getItem("id"),
    'name': '',
    'completedDate': ''
  })

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingContrs, setIsLoadingContrs] = useState(false);

  const [isLoadingDoing, setIsLoadingDoing] = useState(false);

  const [isLoadingDone, setIsLoadingDone] = useState(false);

  const [todoTasks, setTodoTasks] = useState([]);

  const [doingTasks, setDoingTasks] = useState([]);

  const [doneTasks, setDoneTasks] = useState([]);

  const [contributorToAdd, setContributorToAdd] = useState("");

  const [contributors, setContributors] = useState([]);

  const [taskToChange, setTaskToChange] = useState({
    'id': '',
    'completedDate': '',
    'status': ''
  })


  const getDoingTasks = async () => {
    setIsLoadingDoing(true);
    await axios.get(ENDPOINT + "/task/get?id=" + window.localStorage.getItem("id") + "&status=doing")
      .then(response => { setDoingTasks(response.data) })
      .catch(error => { console.log(error) })
    await sleep(400);
    setIsLoadingDoing(false);
  }

  const getDoneTasks = async () => {
    setIsLoadingDone(true);
    await axios.get(ENDPOINT + "/task/get?id=" + window.localStorage.getItem("id") + "&status=done")
      .then(response => { setDoneTasks(response.data) })
      .catch(error => { console.log(error) })
    await sleep(400);
    setIsLoadingDone(false);
  }

  const getTodoTasks = async () => {
    setIsLoading(true);
    await axios.get(ENDPOINT + "/task/get?id=" + window.localStorage.getItem("id") + "&status=todo")
      .then(response => { setTodoTasks(response.data) })
      .catch(error => { console.log(error) })
    await sleep(400);
    setIsLoading(false);
  }

  const deleteTask = async (id) => {
    await axios.delete(ENDPOINT + "/task/delete?id=" + id)
      .then(response => { console.log(response.data) })
      .catch(error => { console.log(error) })
    getTodoTasks()
  }

  useEffect(() => {
    getTodoTasks();
    getDoingTasks();
    getDoneTasks();
  }, [])

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // click on the add task button

  const onClick = (e) => {
    if (document.querySelector(".addTask").style.display == "block") {
      document.querySelector(".addTask").style.display = "none";
    } else document.querySelector(".addTask").style.display = "block";
  }

  const getContributors = async (taskId) => {
    setIsLoadingContrs(true)
    await axios.get(ENDPOINT + "/contribution/get?taskId=" + taskId)
      .then(response => { setContributors(response.data) })
      .catch(error => { console.log(error) })
    await sleep(400);
    setIsLoadingContrs(false);
  }

  // it gets all the information about the clicked task and
  // save them in a const

  const onClickToEdit = async (id, completedDate, status) => {
    if (document.querySelector(".editTask").style.display == "block") {
      document.querySelector(".editTask").style.display = "none";
    } else {
      await setTaskToChange({
        'id': id,
        'completedDate': completedDate,
        'status': status,
      })
      document.querySelector("#edit-completedDate").value = fixDate(taskToChange.completedDate);
      document.querySelector("#choice").value = taskToChange.status;
      document.querySelector(".editTask").style.display = "block";
    }
    getContributors(id);
  }

  function fixDate(date) {
    let newDate = date[0] + "-" + date[1] + "-" + date[2];
    if (date[1] < 10 && date[2] < 10)
      newDate = date[0] + "-" + "0" + date[1] + "-" + "0" + date[2];
    else if (date[1] < 10)
      newDate = date[0] + "-" + "0" + date[1] + "-" + date[2];
    else if (date[2] < 10)
      newDate = date[0] + "-" + date[1] + "-" + "0" + date[2];
    return newDate;
  }

  const handle = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  const handleContribution = (e) => {
    setContributorToAdd(e.target.value);
  }

  const onSubmit = async () => {
    await axios.post(ENDPOINT + "/task/add", data)
      .then(response => { /*console.log(response.data)*/ })
      .catch(error => { console.log(error) })
    getTodoTasks();
  }

  const deleteContribution = async (userId, taskId = taskToChange.id) => {
    await axios.delete(ENDPOINT + "/contribution/delete?userId=" + userId + "&taskId=" + taskId)
      .then(response => { /*console.log(response.data)*/ })
      .catch(error => { console.log(error) })
    getContributors(taskToChange.id);
  }

  const changeData = async () => {
    if (typeof (taskToChange.completedDate) == "object")
      await axios.put(ENDPOINT + "/task/change", {
        'id': taskToChange.id,
        'completedDate': fixDate(taskToChange.completedDate),
        'status': taskToChange.status
      })
        .then(response => { /*console.log(response.data)*/ })
        .catch(error => { console.log(error) })
    else await axios.put(ENDPOINT + "/task/change", {
      'id': taskToChange.id,
      'completedDate': taskToChange.completedDate,
      'status': taskToChange.status
    })
      .then(response => { /*console.log(response.data)*/ })
      .catch(error => { console.log(error) })
    getTodoTasks()
    getDoingTasks()
    getDoneTasks()
  }

  const addContribution = async () => {
    await axios.post(ENDPOINT + "/contribution/add", {
      'userNickname': contributorToAdd,
      'taskId': taskToChange.id
    })
      .then(response => { console.log(response.data) })
      .catch(error => console.log(error))
    getContributors(taskToChange.id);
  }

  const handleEditData = async (e) => {
    const newEditData = { ...taskToChange };
    newEditData[e.target.className] = e.target.value;
    await setTaskToChange(newEditData);
  }

  return (
    <div>
      <div className="tasks">
        <div className="top">
          <h2>{TODO_TITLE}</h2>
        </div>
        <div className="tasksContent">
          {isLoading ? (
            <SpinnerCircular className='loading' size={40} color='#7dd87b' thickness={200} secondaryColor={'white'} />
          ) : (
            todoTasks.map(todoTask => (
              <div className="task">
                <h2>{todoTask.name}</h2>
                {todoTask.ownerId === parseInt(window.localStorage.getItem("id")) &&
                  <h3>{CREATED_BY_AT + todoTask.createdAt[2].toString() + "/" + todoTask.createdAt[1].toString() + "/" + todoTask.createdAt[0].toString()}</h3>
                }
                {todoTask.ownerId !== parseInt(window.localStorage.getItem("id")) &&
                  <h3>{CREATED_BY + todoTask.ownerNickname + AT + todoTask.createdAt[2].toString() + "/" + todoTask.createdAt[1].toString() + "/" + todoTask.createdAt[0].toString()}</h3>
                }
                <h4>{TO_FINISH_ON + todoTask.completedDate[2].toString() + "/" + todoTask.completedDate[1].toString() + "/" + todoTask.completedDate[0].toString()}</h4>
                <div onClick={() => deleteTask(todoTask.id)} ><ion-icon name="trash-outline"></ion-icon></div>
                <div onClick={() => onClickToEdit(todoTask.id, todoTask.completedDate, todoTask.status)} className="edit"><ion-icon name="create-outline"></ion-icon></div>
              </div>
            ))
          )}
        </div>
        <div className="bottom">
          <div onClick={(e) => onClick(e)} ><ion-icon name="add-outline"></ion-icon></div>
        </div>
      </div>
      <div className="doingTasks">
        <div className="top">
          <h2>{DOING_TITLE}</h2>
        </div>
        <div className="tasksContent">
          {isLoadingDoing ? (

            <SpinnerCircular className='loading' size={40} color='#7dd87b' thickness={200} secondaryColor={'white'} />
          ) : (
            doingTasks.map(doingTask => (
              <div className="task">
                <h2>{doingTask.name}</h2>
                {doingTask.ownerId === parseInt(window.localStorage.getItem("id")) &&
                  <h3>{CREATED_BY_AT + doingTask.createdAt[2].toString() + "/" + doingTask.createdAt[1].toString() + "/" + doingTask.createdAt[0].toString()}</h3>
                }
                {doingTask.ownerId !== parseInt(window.localStorage.getItem("id")) &&
                  <h3>{CREATED_BY + doingTask.ownerNickname + AT + doingTask.createdAt[2].toString() + "/" + doingTask.createdAt[1].toString() + "/" + doingTask.createdAt[0].toString()}</h3>
                }
                <h4>{TO_FINISH_ON + doingTask.completedDate[2].toString() + "/" + doingTask.completedDate[1].toString() + "/" + doingTask.completedDate[0].toString()}</h4>
                <div onClick={() => onClickToEdit(doingTask.id, doingTask.completedDate, doingTask.status)} className="edit"><ion-icon name="create-outline"></ion-icon></div>
              </div>
            ))
          )}
        </div>
        <div className="bottom"></div>
      </div>
      <div className="doneTasks">
        <div className="top">
          <h2>{DONE_TITLE}</h2>
        </div>
        <div className="tasksContent">
          {isLoadingDone ? (

            <SpinnerCircular className='loading' size={40} color='#7dd87b' thickness={200} secondaryColor={'white'} />
          ) : (
            doneTasks.map(doneTask => (
              <div className="task">
                <h2>{doneTask.name}</h2>
                {doneTask.ownerId === parseInt(window.localStorage.getItem("id")) &&
                  <h3>{CREATED_BY_AT + doneTask.createdAt[2].toString() + "/" + doneTask.createdAt[1].toString() + "/" + doneTask.createdAt[0].toString()}</h3>
                }
                {doneTask.ownerId !== parseInt(window.localStorage.getItem("id")) &&
                  <h3>{CREATED_BY + doneTask.ownerNickname + AT + doneTask.createdAt[2].toString() + "/" + doneTask.createdAt[1].toString() + "/" + doneTask.createdAt[0].toString()}</h3>
                }
                <h4>{TO_FINISH_ON + doneTask.completedDate[2].toString() + "/" + doneTask.completedDate[1].toString() + "/" + doneTask.completedDate[0].toString()}</h4>
              </div>
            ))
          )}
        </div>
        <div className="bottom"></div>
      </div>
      <div className="addTask">
        <input onChange={(e) => handle(e)} type="text" id="name" placeholder="Nome" value={data.name} />
        <input onChange={(e) => handle(e)} type="date" id="completedDate" placeholder="Da finire entro" />
        <button onClick={() => onSubmit()} >{NEXT}</button>
      </div>
      <div className="editTask">
        <div className="edit-left-side">
          <label htmlFor="">{EDIT_FINISH_DATE}</label>
          <input onChange={(e) => handleEditData(e)} required type="date" className="completedDate" id="edit-completedDate" placeholder="Da finire entro" />
          <label htmlFor="">{EDIT_STATUS}</label>
          <select name="" required onChange={(e) => handleEditData(e)} id="choice" className="status">
            <option value="todo">{TODO_TITLE}</option>
            <option value="doing">{DOING_TITLE}</option>
            <option value="done">{DONE_TITLE}</option>
          </select>
          <button onClick={() => changeData()}>{NEXT}</button>
        </div>
        <div className="edit-right-side">
          <input onChange={(e) => handleContribution(e)} type="text" placeholder="Aggiungi un utente" value={contributorToAdd} />
          <button onClick={() => addContribution()} >{NEXT}</button>
          <div className="contributors">
            {isLoadingContrs ? (
              <SpinnerCircular className='loading-contributors' size={20} color='#7dd87b' thickness={200} secondaryColor={'white'} />
            ) : (
              contributors.map(contributor => (
                <div className="contributor">
                  <img src={contributor.image} alt="" />
                  <h2>{contributor.nickname}</h2>
                  <h3>{contributor.email}</h3>
                  {console.log(window.localStorage.getItem("id") + " " + contributor.id)}
                  {contributor.id != window.localStorage.getItem("id") &&
                    <div onClick={() => deleteContribution(contributor.id)} ><ion-icon name="trash-outline"></ion-icon></div>
                  }
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}