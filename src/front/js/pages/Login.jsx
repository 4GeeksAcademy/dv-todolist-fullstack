import React, { use, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate } from "react-router-dom";


const initialLoginState = {
    email: "",
    password: ""
}

const Login = () => {
    const [user, setUser] = useState(initialLoginState)

    const { actions } = useContext(Context)

    const navigate = useNavigate()

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const response = await actions.login(user)

        if (response) {
            navigate("/")
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <h1 className="text-center my-5">Iniciar Sesión Todo App</h1>
                    <div className="col-12 col-md-6">
                        <form
                            className="border p-3"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label htmlFor="">Correo Elecronico</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="nombre@email.com"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="">Contraseña</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="contraseña"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-primary w-100">Iniciar Sesión</button>
                            </div>
                        </form>
                        <div className="border border-danger text-center">
                            <p className="m-0">
                                ¿No tienes una cuenta? <Link to={"/register"}>Regístrate</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Login;