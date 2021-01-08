import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { customersReducer, CustomersState } from './reducers/costomers.reducer';
import { authReducer, AuthState } from './reducers/auth.reducer';

export interface RootState {
	customers: CustomersState;
	auth: AuthState;
}

export const reducer: ActionReducerMap<RootState> = {
	customers: customersReducer,
	auth: authReducer
};

export const metaReducers: MetaReducer<RootState>[] = [];


