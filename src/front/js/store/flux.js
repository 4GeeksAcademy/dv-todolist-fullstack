const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") ?? null,
			todos: null,
			current_user: null,
			todos: []
		},
		actions: {
			registerUser: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/register`, {
						method: "POST",
						body: user
					})

					return response.status


				} catch (err) {
					console.log(err)
				}
			},
			login: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(user)
					})
					const data = await response.json()

					if (response.ok) {
						setStore({
							token: data.token,
							current_user: data.user
						})
						localStorage.setItem("token", data.token)
						localStorage.setItem("current_user", JSON.stringify(data.user))
						getActions().getTodos()
						return true
					}
					return false

				} catch (err) {
					console.log(err)
				}
			},
			logout: () => {
				setStore({
					token: null,
					current_user: null
				})
				localStorage.removeItem("token")
				localStorage.removeItem("current_user")
			},
			getTodos: async () => {
				try {
					const store = getStore()

					const response = await fetch(`${process.env.BACKEND_URL}/todos`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					})
					const data = await response.json()
					if (response.ok) {
						setStore({
							todos: data
						})
					}
					console.log(response)

				} catch (err) {
					console.log(err)
				}
			},
			resetPassword: async (email) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/reset-password`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify(email)

						}
					)

					console.log(response)

				} catch (error) {
					console.log(error)
				}
			},
		}
	};
};

export default getState;
