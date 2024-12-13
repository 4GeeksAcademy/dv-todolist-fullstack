import React, { useState } from "react"

const initialStateUser = {
    name: "",
    email: "",
    password: ""
}
const Register = () => {
    const [user, setUser] = useState(initialStateUser)


    return (
        <div className="container mt-3">
            <div className="row justify-content-center">
                <h1 className="text-center">Registrarse en el Todo App</h1>
                <div className="col-12 col-md-6">
                    <form className="border p-3 mt-3">
                        <div className="form-group mt-3">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Deimian Vásquez"
                                value={user.name}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Deimian Vásquez"
                                value={user.name}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Deimian Vásquez"
                                value={user.name}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Deimian Vásquez"
                                value={user.name}
                            />
                        </div>
                        <button className="btn btn-primary mt-3 w-100">Registarme</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
