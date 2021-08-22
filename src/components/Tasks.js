import React, {useState} from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import addDays from 'date-fns/addDays'
import isToday from 'date-fns/isToday'
import {FaTrash} from 'react-icons/fa'

const FORMAT = "dd/MM/yyyy"

const AddTask = ({onCancel,onAddTask}) =>{
    const[task,setTask] = useState("")
    const [date,setDate] = useState(null)

    function formatDate(date, format, locale) {
        return dateFnsFormat(date, format, { locale });
    }
      
    return(
        <div className="dialog">
                <input value={task}
                onChange = {(e)=>setTask(e.target.value)} />
                <div className="actions">
                    <div className="btns">
                        <button className="addbtn"
                        disabled = {!task}
                        onClick = {()=> {
                        onAddTask(task, date);
                        onCancel();
                        setTask("");
                        }}>
                        Add Task
                        </button>
                        <button className="cancelbtn" onClick={()=> {onCancel();
                        setTask("");
                        }}>
                        Cancel
                        </button>
                    </div>

                    <div className="date">
                        <DayPickerInput onDayChange = {(day)=> setDate(day)}
                            formatDate={formatDate}
                            format={FORMAT}
                            dayPickerProps = {{
                                modifiers:{
                                    disabled : [{before : new Date()}]
                                }
                            }}
                            placeholder = {`${dateFnsFormat(new Date(), FORMAT)}`}
                        />
                    </div>
                </div>
            </div>
    )
}

const TASKS_MAPPING = {
    INBOX : "Inbox",
    TODAY : "Today",
    NEXT_7 : "Next 7 Days"
}

const TaskItems = ({selectedTab,tasks,setTasks}) =>{

    function dele(index){
        const x = tasks.filter((e)=> index!==e.id)
        setTasks(x)
    }

    let tasksToRender = [...tasks]  

    if(selectedTab==="NEXT_7"){
       tasksToRender = tasksToRender
       .filter(task=>isAfter(task.date,new Date()) && 
       isBefore(task.date, addDays(new Date(),7)))
       
    }

    if(selectedTab==="TODAY"){
        tasksToRender = tasksToRender
        .filter(task=> isToday(task.date))   
    }

    return(
        <div className="taskItemContainer">
            {tasksToRender.map((task)=> (
                <div className = "task-item" key={task.id}>
                <p>{task.text}</p> 
                <p>{dateFnsFormat(new Date(task.date), FORMAT)}<em onClick={()=>dele(task.id)}><FaTrash/></em></p>
                </div>))}
        </div>
    )

}

const Tasks = ({selectedTab}) =>{
    const [showAddTask, setShowAddTask] = useState(false)

    const [tasks,setTasks] = useState([]);
    
    const addNewTask = (text,date) =>{
        const item = {id:tasks.length,text : text, date:date || new Date()}
        setTasks(prevState => [...prevState, item])
    }

    return(
        <div className="tasks">
            <h1>{TASKS_MAPPING[selectedTab]}</h1>
            {selectedTab === "INBOX" ?
            <div className="add" onClick = {()=>setShowAddTask((prevState)=>!prevState )}>
                <span className="plus">+</span>
                <span className="addtask">Add Task</span>
            </div>
            : null}
            {showAddTask && (<AddTask onAddTask = {addNewTask} onCancel = {()=> setShowAddTask(false)}/>)}
            {tasks.length>0 ? <TaskItems selectedTab ={selectedTab} tasks={tasks} setTasks={setTasks}/>: <p>No tasks yet</p>}
        </div>
    )
}

export default Tasks;