/** @format */

const use_page_context = (page_context = 'page-context') => (
	JSON.parse(
		document.getElementById(page_context).textContent
	)
)

export default use_page_context
