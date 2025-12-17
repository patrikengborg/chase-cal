# Acme Booking Calendar

## Run locally

Make sure you have Bun installed (NPM should work as well).

In your terminal, run:

- `bun install`
- `bun dev`

Then open a browser and go to: [http://localhost:5173/](http://localhost:5173/)

Live demo: [https://acme-cal.vercel.app/](https://acme-cal.vercel.app/)

## Design decisions and trade-offs

Dates and time are always a bit tricky. To keep the solution lean, I avoided third-party date libraries and relied on the native Date object together with Intl.DateTimeFormat for formatting and localization. Temporal would have been a great fit, but it’s not really available in browsers yet.

For the calendar grid, I started with a `<table>`, which feels semantically correct. But I ended up using a div-based layout instead due to the time constraints. With more time I would revisit this for improved semantics and accessibility.

Regarding the UI, I aimed for a clean, usable interface over visual complexity.

It's straightforward to tweak the colors and even get dark mode almost for free - thanks to the design tokens in the @theme block. Size is also easy to change with the `--font-size-base` property.

I also like to work with subtle transitions to communicate UI changes and to make the experience feel smooth. Would have loved to spend a bit more time on that.

## Improvements with more time

- Month navigation, the current calendar only supports the current month.
- Centralized state, and less props between components.
- Improved semantics and accessability for the calendar
- More thorough testing for UTC and timezone support
- Component extraction for common UI elements (buttons, inputs, etc.). Maybe also break up the main components into smaller pieces.
- Dark mode
- Improved form validation
- More robust error handling and API client
- Automated tests
- Mobile refinements and additional UI polish
