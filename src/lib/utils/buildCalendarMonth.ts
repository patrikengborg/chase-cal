export function buildCalendarMonth(
	year: number,
	month: number,
	{ locale }: { locale?: string } = {}
) {
	const toLocalIsoDate = (date: Date) => {
		const y = date.getFullYear()
		const m = String(date.getMonth() + 1).padStart(2, '0')
		const d = String(date.getDate()).padStart(2, '0')
		return `${y}-${m}-${d}`
	}

	const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
		new Date(year, month, 1)
	)

	const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
	const dayFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric' })

	// Start on monday
	const first = new Date(year, month, 1)
	const last = new Date(year, month + 1, 0)

	const startOffset = (first.getDay() + 6) % 7
	const start = new Date(first)
	start.setDate(start.getDate() - startOffset)

	const endOffset = 6 - ((last.getDay() + 6) % 7)
	const end = new Date(last)
	end.setDate(end.getDate() + endOffset)

	const weekdays = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(2023, 0, 2 + i) // Monday anchor
		return weekdayFormatter.format(d)
	})

	const daysInMonth = []
	for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
		const date = new Date(d)
		daysInMonth.push({
			date: toLocalIsoDate(date),
			label: dayFormatter.format(date),
			inMonth: date.getMonth() === month
		})
	}

	return { monthTitle, weekdays, daysInMonth }
}
