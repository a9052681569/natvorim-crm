import { Action, createAction, props } from '@ngrx/store';
import { type } from 'os';
import { Paging } from 'src/app/models/paging';
import { Person } from 'src/app/models/people';
import { CustomersState } from '../reducers/costomers.reducer';

export interface CustomersAddProps {
	customer: Person;
}

export interface CustomersSetSuccessProps {
	customers: Person[];
}



export enum CustomersActionsNames {
	ADD = '[Customers] ADD',
	SET_СUSTOMERS_PENDING = '[Customers] SET_СUSTOMERS_PENDING',
	SET_СUSTOMERS_SUCCESS = '[Customers] SET_СUSTOMERS_SUCCESS',
	SET_СUSTOMERS_ERROR = '[Customers] SET_СUSTOMERS_ERROR',
}

export const CustomersActions = {
	add: createAction('[Customers] ADD', props<CustomersAddProps>()),
	setPending: createAction(CustomersActionsNames.SET_СUSTOMERS_PENDING, props<Paging>()),
	setSuccess: createAction(CustomersActionsNames.SET_СUSTOMERS_SUCCESS, props<CustomersSetSuccessProps>()),
	setError: createAction(CustomersActionsNames.SET_СUSTOMERS_ERROR),
};

