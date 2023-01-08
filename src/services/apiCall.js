const api = {
	fetchUsers: () => {
		const url = 'https://run.mocky.io/v3/936840b7-f7a7-4c6a-a931-a3ce26a1e58a';
		return fetch(url)
			.then(res => res.json())
			.catch(err => err);
	},
};

export default api;
