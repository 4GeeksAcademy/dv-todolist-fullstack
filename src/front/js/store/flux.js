const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") ?? null,
			todos: null
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
					console.log(data)
					if (response.ok) {
						setStore({
							token: data.token
						})
						localStorage.setItem("token", data.token)
						return true
					}
					return false

				} catch (err) {
					console.log(err)
				}
			},
			logout: () => {
				setStore({
					token: null
				})
				localStorage.removeItem("token")
			},
			getTodos: async () => {
				try {
					const store = getStore()
					const { token } = store
					const response = await fetch(`${process.env.BACKEND_URL}/todos`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					})
					console.log(response)

				} catch (err) {
					console.log(err)
				}
			}
		}
	};
};

export default getState;
