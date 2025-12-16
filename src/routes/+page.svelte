<script lang="ts">
	import BookingForm from '$lib/components/BookingForm.svelte'
	import Calendar from '$lib/components/Calendar.svelte'
	import Slots from '$lib/components/Slots.svelte'

	let { data } = $props()

	let selectedDate = $state<string | null>(null)
	let selectedTime = $state<string | null>(null)

	const datesWithSlots = $derived.by(() => {
		return new Set(data.slots.map((slot) => slot.start.slice(0, 10)))
	})

	const selectedDateSlots = $derived.by(() => {
		return data.slots.filter((slot) => slot.start.slice(0, 10) === selectedDate)
	})

	const hasSelectedDateAndTime = $derived(!!(selectedDate && selectedTime))
</script>

<div class="grid min-h-dvh grid-rows-[auto_1fr] place-items-center">
	<header class="py-6">
		<h1 class="text-center text-xl font-medium">Acme booking calendar</h1>
	</header>

	<main>
		<div
			class={[
				'grid grid-cols-[1fr_1fr] gap-4 transition-all duration-500 ease-(--easing-default)',
				hasSelectedDateAndTime ? '-translate-x-40' : 'translate-x-0'
			]}
		>
			<Calendar class="relative z-10 col-start-1 row-start-1" bind:selectedDate {datesWithSlots} />

			<Slots
				class="relative z-10 col-start-2 row-start-1"
				date={selectedDate}
				slots={selectedDateSlots}
				bind:selectedTime
			/>

			<BookingForm
				{selectedDate}
				{selectedTime}
				class={`col-start-2 row-start-1 transition-transform duration-500 ease-(--easing-default) ${hasSelectedDateAndTime ? `translate-x-[calc(100%+1rem)]` : `translate-x-0`}`}
			/>
		</div>
	</main>
</div>
