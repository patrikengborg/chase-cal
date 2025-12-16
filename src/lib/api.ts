export async function api<T = unknown>(path: string, options?: RequestInit): Promise<T> {
	const baseUrl = `https://calendar.meetchase.ai`
	const url = new URL(`/api/${path}`, baseUrl)

	let res

	try {
		res = await fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			},
			...options
		})
	} catch (err) {
		console.error(err)
		throw new Error('Network response failed, you may be offline')
	}

	if (!res.ok) {
		const result = await res.json()
		throw new Error(result.detail)
	}

	return res.json() as Promise<T>
}
