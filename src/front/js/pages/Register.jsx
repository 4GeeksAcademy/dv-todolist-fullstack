import React, { useState, useContext } from "react"
import { Context } from "../store/appContext"

const initialStateUser = {
    name: "",
    email: "",
    password: "",
    avatar: ""
}
const Register = () => {
    const [user, setUser] = useState(initialStateUser)

    const { actions } = useContext(Context)

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const response = await actions.registerUser(user)
        if (response == 201) {
            setUser(initialStateUser)
            alert("Registro exitosamente")
        } else {
            alert("problemas con el registro")
        }
    }

    return (
        <div className="container mt-3">
            <div className="row justify-content-center">
                <h1 className="text-center">Registrarse en el Todo App</h1>
                <div className="col-12 col-md-6">
                    <form onSubmit={handleSubmit} className="border p-3 mt-3">
                        <div className="form-group mt-3">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Deimian Vásquez"
                                name="name"
                                value={user.name}
                                onChange={handleChange}

                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Correo electronico</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="correo@email.com"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="123456"
                                name="password"
                                value={user.password}
                                onChange={handleChange}

                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Imagen de perfil</label>
                            <input
                                type="file"
                                className="form-control"
                                placeholder="Deimian Vásquez"
                                value={user.file}
                            // onChange={handleChange}
                            />
                        </div>
                        <button className="btn btn-primary mt-3 w-100">Registarme</button>
                    </form>
                    <div className="border border-danger">
                        s
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
