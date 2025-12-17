<script lang="ts">
	import BookingForm from '$lib/components/BookingForm.svelte'
	import Calendar from '$lib/components/Calendar.svelte'
	import Slots from '$lib/components/Slots.svelte'

	let { data } = $props()

	let selectedDate = $state<string | null>(null)
	let selectedTime = $state<string | null>(null)

	let bookingForm = $state<BookingForm>()

	const datesWithSlots = $derived.by(() => {
		return new Set(data.slots.map((slot) => slot.start.slice(0, 10)))
	})

	const selectedDateSlots = $derived.by(() => {
		return data.slots.filter((slot) => slot.start.slice(0, 10) === selectedDate)
	})

	const hasSelectedDateAndTime = $derived(!!(selectedDate && selectedTime))
</script>

<div class="grid min-h-dvh grid-rows-[auto_1fr] place-items-center">
	<header class="py-5">
		<h1 class="text-center text-xl font-medium">Acme Booking Calendar</h1>
	</header>

	<main class="p-5">
		<div
			class={[
				'grid gap-4 transition-all duration-500 ease-(--easing-default) lg:grid-cols-[1fr_1fr]',
				hasSelectedDateAndTime ? 'lg:-translate-x-40' : 'lg:translate-x-0'
			]}
		>
			<Calendar
				class="relative z-10 col-start-1 row-start-1"
				bind:selectedDate
				{datesWithSlots}
				onSelect={() => {
					bookingForm?.reset()
				}}
			/>

			<Slots
				class="relative z-10 lg:col-start-2 lg:row-start-1"
				date={selectedDate}
				slots={selectedDateSlots}
				bind:selectedTime
				onSelect={() => {
					bookingForm?.reset()
				}}
			/>

			<BookingForm
				bind:this={bookingForm}
				{selectedDate}
				{selectedTime}
				class={`transition-transform duration-500 ease-(--easing-default) lg:col-start-2 lg:row-start-1 ${hasSelectedDateAndTime ? `grid lg:translate-x-[calc(100%+1rem)]` : `hidden lg:grid lg:translate-x-0`}`}
			/>
		</div>
	</main>
</div>
