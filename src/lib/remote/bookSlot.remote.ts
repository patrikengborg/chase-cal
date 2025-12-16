import { form } from '$app/server'
import { api } from '$lib/api'
import { error } from '@sveltejs/kit'
import { email, nonEmpty, isoTimestamp, object, pipe, string } from 'valibot'

const schema = object({
	start: pipe(string(), isoTimestamp()),
	email: pipe(string(), email()),
	end: pipe(string(), isoTimestamp()),
	name: pipe(string(), nonEmpty())
})

export const bookSlot = form(schema, async ({ start, end, name, email }) => {
	const payload = {
		start,
		end,
		attendees: [
			{
				name,
				email
			}
		]
	}

	try {
		const res = await api('meetings', {
			method: 'POST',
			body: JSON.stringify(payload)
		})
		console.log(res)
		return true
	} catch (err) {
		console.error(err)
		error(400, err instanceof Error ? err.message : 'Failed to book slot')
	}
})
