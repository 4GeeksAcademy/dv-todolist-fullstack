import React, { useEffect, useState } from "react";
import "./Todos.css"


const initialTask = {
    label: "",
    is_done: false
}

const urlBase = "https://playground.4geeks.com/todo"


const Todos = () => {
    const [task, setTask] = useState(initialTask)
    const [taskList, setTaskList] = useState([])


    // funcion que agrega lo que se escribe en el input y lo coloca en el useState (task)
    const handleChange = ({ target }) => { // objeto event

        setTask({
            ...task,
            [target.name]: target.value
        })
    }


    // necesito todas mis tareas, en caso de tener
    const getAllTask = async () => {
        try {
            // fetching de datos
            const responde = await fetch(`${urlBase}/users/deimian`)
            const data = await responde.json()

            if (responde.ok) {
                setTaskList(data.todos)
            } else {
                createNewUser()
            }


        } catch (error) {
            console.log(error)
        }
    }


    // funcion que crea un usuario nuevo
    const createNewUser = async () => {
        try {
            const response = await fetch(`${urlBase}/users/deimian`, {
                method: "POST"
            })

        } catch (error) {
            console.log(error)
        }
    }


    const addTask = async (event) => {
        if (event.key == "Enter") {
            try {
                const response = await fetch(`${urlBase}/todos/deimian`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(task)
                })
                if (response.ok) {
                    getAllTask()
                    setTask(initialTask)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const deleteTask = async (id) => {
        try {
            const responde = await fetch(`${urlBase}/todos/${id}`, {
                method: "DELETE"
            })
            if (responde.ok) {
                getAllTask()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const editTask = async (item) => {
        try {
            const response = await fetch(`${urlBase}/todos/${item.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: item.label,
                    is_done: !item.is_done
                })
            })
            if (response.ok) {
                getAllTask()
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getAllTask()
    }, [])


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-7">
                    <h1 className="text-center mt-4">Lista de tareas</h1>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <input
                            type="text"
                            placeholder="Agrega la tarea"
                            className="form-control"
                            name="label"
                            value={task.label}
                            onChange={handleChange}
                            onKeyDown={addTask}
                        />
                    </form>
                    {
                        taskList.length <= 0 ? <div> no tiene tareas</div> :

                            taskList.map((item) => (
                                <div key={item.id} className="task-list">
                                    {item.label}
                                    <span>
                                        <button onClick={() => deleteTask(item.id)}>X</button>
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            aria-label="Checkbox for following text input"
                                            checked={item.is_done}
                                            value={item.is_done}
                                            onChange={() => editTask(item)}

                                        />
                                    </span>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    );
}


export default Todos;