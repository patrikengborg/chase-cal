<script lang="ts">
	import { buildCalendarMonth } from '$lib/utils/buildCalendarMonth'
	import SelectButton from './SelectButton.svelte'
	import { twMerge } from 'tailwind-merge'

	interface Props {
		selectedDate: string | null // ISO date
		datesWithSlots: Set<string>
		class?: string
	}

	let { selectedDate = $bindable(), datesWithSlots, class: classes }: Props = $props()

	const year = 2025
	const month = new Date().getMonth()
	const todayIsoUTC = new Date().toISOString().slice(0, 10)

	const { monthTitle, weekdays, daysInMonth } = buildCalendarMonth(year, month)
</script>

<div class={twMerge('card grid grid-cols-7 gap-1 text-sm', classes)}>
	<header class="contents">
		<h2 class="col-span-7 mb-2 text-center font-medium">{monthTitle}</h2>

		{#each weekdays as weekday}
			<div class="px-1.5 py-3 text-center text-xs font-medium uppercase">{weekday}</div>
		{/each}
	</header>

	<div class="contents">
		{#each daysInMonth as day}
			{@const isoDate = day.date}
			{@const hasSlots = datesWithSlots.has(isoDate)}
			{@const isSelected = selectedDate === isoDate}

			<div class={isoDate === todayIsoUTC ? 'rounded-sm bg-main/5' : ''}>
				{#if day.inMonth}
					<SelectButton
						isActive={hasSlots}
						{isSelected}
						label={day.label}
						onclick={() => {
							selectedDate = isSelected ? null : isoDate
						}}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>
