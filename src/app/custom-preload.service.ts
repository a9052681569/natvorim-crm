import { Injectable } from '@angular/core';
import { PreloadAllModules, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable()
export class CustomPreloadService implements PreloadAllModules {

  public preload(route: Route, fn: () => Observable<any>): Observable<any> {
	return of(route)
	  .pipe(
		delay(5000),
		mergeMap((_: Route) => fn())
	  );
  }
}
