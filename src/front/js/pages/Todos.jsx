import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom"

const Todos = () => {
    const { store } = useContext(Context)


    return (
        <>
            {
                store.token ?
                    <h1>Tienes acceso</h1> :
                    <Navigate to={"/login"} />
            }
        </>
    )
}

export default Todos