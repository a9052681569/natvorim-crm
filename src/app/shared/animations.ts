import { trigger, transition, style, animate, sequence } from '@angular/animations';

export const menuToggleAnimation = trigger('menuToggleAnimation', [
	transition(':enter', [
		style({'min-width': 0, width: 0, padding: 0, margin: 0, border: 'none', overflow: 'hidden'}),
		animate('.25s cubic-bezier(0.0, 0.0, 0.2, 1)', style({'min-width': '*', width: '*', padding: '*', margin: '*', border: '*' }))
	]),
	transition(':leave', [
		style({overflow: 'hidden'}),
		animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', style({'min-width': 0, width: 0, padding: 0, margin: 0, border: 'none' }))
	])
]);

export const opacityChangeAnimation = trigger('opacityChangeAnimation', [
	transition(':enter', [
		style({ opacity: 0 }),
		animate('.25s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1 }))
	]),
	transition(':leave', [
		animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 0 }))
	])
]);
