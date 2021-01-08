import { createReducer, on } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { User } from '../../models/user';
import { AuthActions, LoginSuccessProps } from '../actions/auth.actions';

export interface AuthState {
	isLogged: boolean;
	user: User;
}

export const initialState: AuthState = {
	isLogged: false,
	user: {
		name: '',
	}
};

const _authReducer = createReducer(
	initialState,
	on(AuthActions.loginSuccess, (state: AuthState, { user }: LoginSuccessProps) => {
		return {
			...state,
			isLogged: true,
			user
		};
	})
);

export function authReducer(state: AuthState = initialState, action: Action): AuthState {
	return _authReducer(state, action);
}
