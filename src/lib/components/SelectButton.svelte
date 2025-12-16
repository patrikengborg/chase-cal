<script lang="ts">
	interface Props {
		isActive: boolean
		isSelected: boolean
		label: string
		onclick: () => void
		useStrikeThrough?: boolean
	}

	let { isActive, isSelected, label, onclick, useStrikeThrough = false }: Props = $props()
</script>

<button
	disabled={!isActive}
	{onclick}
	class={[
		'w-full rounded-sm px-1 py-2 text-center text-main/65 transition-opacity duration-200 ease-(--easing-default)',
		isSelected
			? 'cursor-pointer bg-accent text-neutral'
			: isActive
				? 'cursor-pointer hover:bg-accent/10'
				: 'cursor-not-allowed  opacity-25'
	]}
>
	{label}
</button>
