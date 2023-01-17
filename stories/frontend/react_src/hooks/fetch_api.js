/** @format */

const fetchApi = ({ data = {}, dir = '', method = 'POST' }) =>
	fetch(dir, {
		method: method,
		headers: { 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },
		body: JSON.stringify(data),
	})
		.then(response =>
			response.status == 200
				? response.json()
				: { message: 'hubó un problema para procesar la solicitud' }
		)
		.then(r => r)

export default fetchApi
