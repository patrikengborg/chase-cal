<script lang="ts">
	import { formatDate, zonedDateTimeToUtcMs } from '$lib/utils/dateFormatting'
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
