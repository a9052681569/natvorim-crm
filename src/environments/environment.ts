// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	apiEndpoints: {
		customersForAutocomplete: '/cors/people/autocomplete',
		postOrders: '/cors/orders/post',
		postCustomer: '/cors/people/post',
		searchCustomer: '/cors/people/search',
		removeCustomer: '/cors/people/remove',
		getCustomers: '/cors/people/get',
		getOrdersById: '/cors/orders/by/personid',
		patchOrder: '/cors/orders/patch',
		removeOrder: '/cors/orders/remove',
		patchOrderSended: '/cors/orders/patch/sended',
		patchOrderTrack: '/cors/orders/patch/track',
		patchCustomer: '/cors/people/patch',
		auth: '/cors/auth/main',
		prepairingOrders: '/cors/orders/for/prepaire',
		actualShipment: '/cors/orders/for/actual-shipment',
		actualShipmentPatchSended: '/cors/orders/patch/actual-shipment-sended',
		getConversion: '/cors/widgets/conversion/get',
		getReminders: '/cors/people/reminders/get',
		markReminderSended: '/cors/people/reminders/sended',
		getCourierSheet: '/cors/orders/couriersheet',
	}
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
