export const environment = {
	production: true,
	apiEndpoints: {
		customersForAutocomplete: '/people/autocomplete',
		postOrders: '/orders/post',
		postCustomer: '/people/post',
		getCustomers: '/people/get',
		getOrdersById: '/orders/by/personid',
		patchOrder: '/orders/patch',
		removeOrder: '/orders/remove',
		patchOrderSended: '/orders/patch/sended',
		patchOrderTrack: '/orders/patch/track',
		patchCustomer: '/people/patch',
		removeCustomer: '/people/remove',
		auth: '/auth/main',
		prepairingOrders: '/orders/for/prepaire'
	}
};
