import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom"

const Todos = () => {
    const { store } = useContext(Context)


    return (
        <>
            <h1>todos</h1>
        </>
    )
}

export default Todos