import { createReducer, on } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { Order } from '../../models/order';
import { CustomersActions, CustomersAddProps, CustomersSetSuccessProps } from '../actions/costomers.actions';
import { AddOrdersPendingProps, OrdersActions } from '../actions/orders.actions';

export interface OrdersState {
	orders: Order[];
	loading: boolean;
	err: boolean;
}

export const initialState: OrdersState = {
	orders: [],
	loading: false,
	err: false
};

const _ordersReducer = createReducer(
	initialState,
	on(OrdersActions.addOrdersPending, (state: OrdersState) => {
		return {
			...state,
			loading: true
		};
	}),
	on(OrdersActions.addOrdersSuccess, (state: OrdersState, { orders }) => {
		const clonedOrders = state.orders.slice();
		clonedOrders.push(...orders);
		return {
			...state,
			orders: clonedOrders,
			loading: false
		};
	}),
	on(OrdersActions.addOrdersError, (state: OrdersState) => {
		return {
			...state,
			err: true,
			loading: false
		};
	}),
);

export function ordersReducer(state: OrdersState = initialState, action: Action): OrdersState {
	return _ordersReducer(state, action);
}
