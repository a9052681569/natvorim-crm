import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { IAuthState } from 'src/app/store/reducers/auth.reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TestColdObservable } from 'jasmine-marbles/src/test-observables';
import { cold } from 'jasmine-marbles';

describe('AuthGuard', () => {

  let guard: AuthGuard;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let store: MockStore<{ auth: IAuthState}>;
  let routerSpy: jasmine.Spy;

  const initialState: { auth: IAuthState} = {
    auth: { isLogged: false}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, provideMockStore({initialState})],
      imports: [RouterTestingModule]
    });

    guard = TestBed.get(AuthGuard);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    routerSpy = spyOn(router, 'navigate').and.stub();
  });

  it('should open login/signup when no token', () => {
    const expected: TestColdObservable = cold('(a|)', {a: true});

    expect(guard.canActivate(activatedRoute.snapshot, {
      url: '/login',
      root: activatedRoute.snapshot
    })).toBeObservable(expected);

    expect(guard.canActivate(activatedRoute.snapshot, {
      url: '/signup',
      root: activatedRoute.snapshot
    })).toBeObservable(expected);
  });


  it('should redirect to login, not backoffice', () => {
    const expected: TestColdObservable = cold('(a|)', {a: false});

    expect(guard.canActivate(activatedRoute.snapshot, {
      url: '/backoffice',
      root: activatedRoute.snapshot
    })).toBeObservable(expected);

    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should go to backoffice', () => {

    store.setState({auth: {isLogged: true}});
    const expected: TestColdObservable = cold('(a|)', {a: true});

    expect(guard.canActivate(activatedRoute.snapshot, {
      url: '/backoffice',
      root: activatedRoute.snapshot
    })).toBeObservable(expected);

    expect(routerSpy).not.toHaveBeenCalled();
  });
});
