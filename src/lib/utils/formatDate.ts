export function formatDate(
	isoDate: string,
	{
		locale = 'en-GB',
		timeZone = 'UTC'
	}: {
		locale?: string;
		timeZone?: string;
	} = {}
) {
	const [y, m, d] = isoDate.split('-').map(Number);

	// UTC noon avoids DST edge weirdness
	const date = new Date(Date.UTC(y, m - 1, d, 12));

	return new Intl.DateTimeFormat(locale, {
		timeZone,
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
}
