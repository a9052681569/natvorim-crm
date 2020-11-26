import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { customersReducer, CustomersState } from './reducers/costomers.reducer';
import { ordersReducer, OrdersState } from './reducers/orders.reducer';

export interface RootState {
	customers: CustomersState;
	orders: OrdersState;
}

export const reducer: ActionReducerMap<RootState> = {
	customers: customersReducer,
	orders: ordersReducer
};

export const metaReducers: MetaReducer<RootState>[] = [];


