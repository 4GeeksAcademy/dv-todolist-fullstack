import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { actions, store } = useContext(Context)
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{
						store.token == null ?
							<>
								<Link
									className="btn btn-primary mx-3"
									to={"/login"}
								>Entrar</Link>
								<Link
									className="btn btn-primary"
									to={"/register"}
								>Registrar</Link>
							</> :
							<button
								className="btn btn-primary"
								onClick={() => actions.logout()}
							>Salir</button>
					}


				</div>
			</div>
		</nav>
	);
};
