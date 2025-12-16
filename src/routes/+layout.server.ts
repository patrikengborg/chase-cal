import { getSlotsForDates } from '$lib/remote/getSlotsForDates.remote';

export const load = async () => {
	const slots = await getSlotsForDates({ start: '2025-12-01', end: '2025-12-31' });
	return { slots };
};
