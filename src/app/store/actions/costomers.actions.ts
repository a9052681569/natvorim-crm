import { createAction, props } from '@ngrx/store';
import { Paging } from 'src/app/models/paging';
import { Person } from 'src/app/models/people';

export interface CustomersAddProps {
	customer: Person;
}

export interface CustomersSearchSuccessProps {
	customers: Person[];
}

export interface CustomersSearchPendingProps {
	name: string;
}

export interface CustomerPatchSuccessProps {
	customer: Person;
}



export enum CustomersActionsNames {
	ADD = '[Customers] ADD',
	SEARCH_СUSTOMERS_PENDING = '[Customers] SEARCH_СUSTOMERS_PENDING',
	SEARCH_СUSTOMERS_SUCCESS = '[Customers] SEARCH_СUSTOMERS_SUCCESS',
	SEARCH_СUSTOMERS_ERROR = '[Customers] SEARCH_СUSTOMERS_ERROR',
	PATCH_СUSTOMER_PENDING = '[Customers] PATCH_СUSTOMER_PENDING',
	PATCH_СUSTOMER_SUCCESS = '[Customers] PATCH_СUSTOMER_SUCCESS',
	PATCH_СUSTOMER_ERROR = '[Customers] PATCH_СUSTOMER_ERROR',
	RESET_CUSTOMERS = '[Customers] RESET',
}

export const CustomersActions = {
	add: createAction('[Customers] ADD', props<CustomersAddProps>()),
	searchPending: createAction(CustomersActionsNames.SEARCH_СUSTOMERS_PENDING, props<CustomersSearchPendingProps>()),
	searchSuccess: createAction(CustomersActionsNames.SEARCH_СUSTOMERS_SUCCESS, props<CustomersSearchSuccessProps>()),
	searchError: createAction(CustomersActionsNames.SEARCH_СUSTOMERS_ERROR),
	patchPending: createAction(CustomersActionsNames.PATCH_СUSTOMER_PENDING, props<CustomerPatchSuccessProps>()),
	patchSuccess: createAction(CustomersActionsNames.PATCH_СUSTOMER_SUCCESS, props<CustomerPatchSuccessProps>()),
	patchError: createAction(CustomersActionsNames.PATCH_СUSTOMER_ERROR),
	reset: createAction(CustomersActionsNames.RESET_CUSTOMERS),
};

