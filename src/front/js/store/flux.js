const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null
		},
		actions: {
			registerUser: async (user) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/register`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(user)
					})

					return response.status


				} catch (err) {
					console.log(err)
				}
			}
		}
	};
};

export default getState;
