<script lang="ts">
	import type { HttpError } from '@sveltejs/kit'

	import { formatDate } from '$lib/utils/dateFormatting'
	import { twMerge } from 'tailwind-merge'
	import { bookSlot } from '$lib/remote/bookSlot.remote'
	import { toIsoFromLocal } from '$lib/utils/dateFormatting'

	interface Props {
		selectedDate: string | null
		selectedTime: string | null
		class?: string
	}

	export function reset() {
		success = false
		isSubmitting = false
		errorMsg = ''
	}

	let { selectedDate, selectedTime, class: classes }: Props = $props()

	let success = $state(false)
	let isSubmitting = $state(false)
	let errorMsg = $state('')

	let nameInput = $state<HTMLInputElement>()

	$effect(() => {
		// Focus the name input when the time is selected
		if (selectedTime) {
			nameInput?.focus()
			errorMsg = ''
		}
	})

	const formattedDate = $derived.by(() => {
		if (!selectedDate || !selectedTime) return null
		return `${formatDate(selectedDate)}, <span class="tabular-nums">${selectedTime}</span>`
	})

	const start = $derived.by(() => {
		if (!selectedDate || !selectedTime) return null
		return toIsoFromLocal(selectedDate, selectedTime)
	})

	const end = $derived.by(() => {
		if (!start) return null
		const d = new Date(start)
		d.setMinutes(d.getMinutes() + 30)
		return d.toISOString()
	})
</script>

<div class={twMerge('card grid', classes)}>
	{#if success}
		<p class="starting-fade-in my-auto text-center text-sm leading-loose">
			Your slot has been successfully booked at<br />
			<strong>{@html formattedDate}</strong><br />
			Thank you and see you there 👋
		</p>
	{:else}
		<form
			{...bookSlot.enhance(async ({ form, data, submit }) => {
				isSubmitting = true
				try {
					await submit()
					if (bookSlot.result) {
						success = true
					}
					form.reset()
				} catch (error) {
					errorMsg = (error as HttpError).body.message
				} finally {
					isSubmitting = false
				}
			})}
			class="grid gap-2"
		>
			<header>
				{#if selectedDate}
					<h2 class="mb-4 text-center text-sm font-medium">Book your meeting</h2>
				{/if}

				<p class="rounded-sm border border-accent/20 bg-accent/10 p-2 text-center text-xs">
					&nbsp;
					{#if formattedDate}
						<strong>Your slot:</strong>
						{@html formattedDate}
					{/if}
				</p>

				{#if errorMsg}
					<p class="border border-warning/20 bg-warning/10 p-2 text-center text-xs text-warning">
						{errorMsg}
					</p>
				{/if}
			</header>

			<label>
				<span>Full name</span>
				<input {...bookSlot.fields.name.as('text')} bind:this={nameInput} required />
			</label>

			<label>
				<span>Email</span>
				<input {...bookSlot.fields.email.as('email')} required />
			</label>

			<div class="mt-4">
				<input type="hidden" name="start" value={start} />
				<input type="hidden" name="end" value={end} />

				<button
					disabled={isSubmitting}
					type="submit"
					class=" w-full cursor-pointer rounded-sm bg-accent px-4 py-2 text-sm font-medium text-neutral hover:bg-accent/90"
				>
					Book meeting
				</button>
			</div>
		</form>
	{/if}
</div>
