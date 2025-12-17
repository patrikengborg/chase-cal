export function formatDate(
	isoDate: string,
	{
		locale = 'en-GB',
		timeZone = 'UTC'
	}: {
		locale?: string
		timeZone?: string
	} = {}
) {
	const [y, m, d] = isoDate.split('-').map(Number)

	// UTC noon avoids DST edge weirdness
	const date = new Date(Date.UTC(y, m - 1, d, 12))

	return new Intl.DateTimeFormat(locale, {
		timeZone,
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date)
}

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

export function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
	// offset = (time in tz) - (time in UTC), in minutes, for this instant
	const dtf = new Intl.DateTimeFormat('en-US', {
		timeZone,
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	const parts = dtf.formatToParts(date)
	const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)

	const asUTC = Date.UTC(
		get('year'),
		get('month') - 1,
		get('day'),
		get('hour'),
		get('minute'),
		get('second')
	)

	return (asUTC - date.getTime()) / 60000
}

export function zonedDateTimeToUtcMs(isoDate: string, timeHHMM: string, timeZone: string) {
	const [Y, M, D] = isoDate.split('-').map(Number)
	const [h, m] = timeHHMM.split(':').map(Number)

	// Start with a naive UTC guess for the same wall time
	const guessUtc = new Date(Date.UTC(Y, M - 1, D, h, m, 0))

	// Compute the offset of that instant in the target timezone
	const offsetMin = getTimeZoneOffsetMinutes(guessUtc, timeZone)

	// Correct the guess: wall time in TZ -> UTC
	return guessUtc.getTime() - offsetMin * 60000
}
