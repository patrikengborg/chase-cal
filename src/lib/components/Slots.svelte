<script lang="ts">
	import { formatDate } from '$lib/utils/formatDate'
	import SelectButton from './SelectButton.svelte'
	import { twMerge } from 'tailwind-merge'

	interface Props {
		date: string | null // ISO date
		slots: { start: string; end: string }[]
		selectedTime: string | null
		class?: string
	}

	let { date, slots, selectedTime = $bindable(), class: classes }: Props = $props()

	function getHalfHourSlots(startHour: number, endHour: number) {
		const slots = []
		for (let h = startHour; h < endHour; h++) {
			const hour = `${h < 10 ? `0${h}` : h}`
			slots.push({ hour, minute: '00' })
			slots.push({ hour, minute: '30' })
		}
		return slots
	}

	function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
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

	function zonedDateTimeToUtcMs(isoDate: string, timeHHMM: string, timeZone: string) {
		const [Y, M, D] = isoDate.split('-').map(Number)
		const [h, m] = timeHHMM.split(':').map(Number)

		// Start with a naive UTC guess for the same wall time
		const guessUtc = new Date(Date.UTC(Y, M - 1, D, h, m, 0))

		// Compute the offset of that instant in the target timezone
		const offsetMin = getTimeZoneOffsetMinutes(guessUtc, timeZone)

		// Correct the guess: wall time in TZ -> UTC
		return guessUtc.getTime() - offsetMin * 60000
	}

	function isAvailableAt(
		slots: { start: string; end: string }[],
		isoDate: string,
		timeHHMM: string,
		timeZone: string
	) {
		const t = zonedDateTimeToUtcMs(isoDate, timeHHMM, timeZone)

		return slots.some(({ start, end }) => {
			const s = Date.parse(start)
			const e = Date.parse(end)
			return t >= s && t < e
		})
	}

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const halfHourSlots = getHalfHourSlots(9, 17)
</script>

<div class={twMerge('card grid text-sm', classes)}>
	{#if date}
		<div class="starting-fade-in grid grid-rows-[auto_1fr] items-center">
			<h2 class="mb-4 text-center font-medium">
				<span class="">Open slots for</span>
				<span class="opacity-65">{formatDate(date)}</span>
			</h2>

			<ul class="grid grid-cols-4 gap-2">
				{#each halfHourSlots as { hour, minute }}
					{@const datetime = `${hour}:${minute}`}
					{@const isAvailable = isAvailableAt(slots, date, datetime, userTimeZone)}
					{@const isSelected = selectedTime === datetime}
					<li>
						<SelectButton
							useStrikeThrough={true}
							isActive={isAvailable}
							{isSelected}
							label={`${hour}:${minute}`}
							onclick={() => {
								selectedTime = isSelected ? null : datetime
							}}
						/>
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<div class="starting-fade-in my-auto text-xs opacity-100">
			<p class="mb-1 text-center text-sm font-medium">Book a meeting with Acme</p>
			<p class="text-center text-main/65">Please select a date to view available slots</p>
		</div>
	{/if}
</div>
