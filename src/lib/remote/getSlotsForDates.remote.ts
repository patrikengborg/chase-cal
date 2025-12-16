import { query } from '$app/server'
import { api } from '$lib/api'
import { object, pipe, string, isoDate } from 'valibot'

const schema = object({
	start: pipe(string(), isoDate()),
	end: pipe(string(), isoDate())
})

interface Slot {
	start: string
	end: string
}

export const getSlotsForDates = query(schema, async ({ start, end }) => {
	const res = await api<Slot[]>(`availability?start=${start}&end=${end}`)
	return res
})
