import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";


const Login = () => {


    return (
        <>
            <h1>Hacer login</h1>
            si no tiene cuenta <Link to="/register">Registrarse aquí</Link>
        </>
    )
}

export default Login;