import { createReducer, on } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { Person } from '../../models/people';
import { CustomersActions, CustomersAddProps, CustomersSetSuccessProps } from '../actions/costomers.actions';

export interface CustomersState {
	customers: Person[];
	loading: boolean;
	err: boolean;
}

export const initialState: CustomersState = {
	customers: [],
	loading: false,
	err: false
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
	on(CustomersActions.setPending, (state: CustomersState) => {
		return {
			...state,
			loading: true
		};
	}),
	on(CustomersActions.setSuccess, (state: CustomersState, { customers }: CustomersSetSuccessProps) => {
		const clonedCustomers = state.customers.slice();
		clonedCustomers.push(...customers);
		return {
			...state,
			customers: clonedCustomers,
			loading: false
		};
	}),
	on(CustomersActions.setError, (state: CustomersState) => {
		return {
			...state,
			err: true,
			loading: false
		};
	}),
);

export function customersReducer(state: CustomersState = initialState, action: Action): CustomersState {
	return _customersReducer(state, action);
}
