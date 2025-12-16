export function toIsoFromLocal(isoDate: string, timeHHMM: string) {
	const [y, m, d] = isoDate.split('-').map(Number)
	const [h, min] = timeHHMM.split(':').map(Number)

	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const guess = new Date(Date.UTC(y, m - 1, d, h, min))
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).formatToParts(guess)

	const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)

	const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))

	return new Date(guess.getTime() - (asUTC - guess.getTime())).toISOString()
}
