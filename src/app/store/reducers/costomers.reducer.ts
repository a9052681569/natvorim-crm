import { createReducer, on } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { Person } from '../../models/people';
import { CustomersActions, CustomersAddProps, CustomersSearchSuccessProps } from '../actions/costomers.actions';

export interface CustomersState {
	customers: Person[];
	loading: boolean;
	err: boolean;
	patchLoading: boolean;
	patchError: boolean;
}

export const initialState: CustomersState = {
	customers: [],
	loading: false,
	err: false,
	patchLoading: false,
	patchError: false
};

const _customersReducer = createReducer(
	initialState,
	on(CustomersActions.add, (state: CustomersState, { customer }: CustomersAddProps) => {
		const customers = state.customers.slice();
		customers.push(customer);
		return {
			...state,
			customers
		};
	}),
	on(CustomersActions.searchPending, (state: CustomersState) => {
		return {
			...state,
			loading: true
		};
	}),
	on(CustomersActions.searchSuccess, (state: CustomersState, { customers }: CustomersSearchSuccessProps) => {
		return {
			...state,
			customers,
			loading: false
		};
	}),
	on(CustomersActions.searchError, (state: CustomersState) => {
		return {
			...state,
			err: true,
			loading: false
		};
	}),
	on(CustomersActions.patchPending, (state: CustomersState) => {
		return {
			...state,
			patchError: false,
			patchLoading: true
		};
	}),
	on(CustomersActions.patchSuccess, (state: CustomersState, { customer }) => {
		const clonedCustomers = state.customers.slice();
		clonedCustomers[clonedCustomers.findIndex(c => c.id === customer.id)] = customer;
		return {
			...state,
			patchError: false,
			patchLoading: false,
			customers: clonedCustomers
		};
	}),
	on(CustomersActions.patchError, (state: CustomersState) => {
		return {
			...state,
			patchError: true,
			patchLoading: false
		};
	}),
	on(CustomersActions.reset, (state: CustomersState) => {
		return {
			...initialState
		};
	}),
	on(CustomersActions.removeSuccess, (state: CustomersState, { customerId }) => {
		const clonedCustomers = state.customers.slice().filter(c => c.id !== customerId);

		return {
			...state,
			customers: clonedCustomers
		};
	}),
);

export function customersReducer(state: CustomersState = initialState, action: Action): CustomersState {
	return _customersReducer(state, action);
}
