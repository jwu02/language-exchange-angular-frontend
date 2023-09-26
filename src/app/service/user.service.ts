import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersURL = "http://localhost:8080/api/v1/user";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Make a POST request to add a new user to the server
   * @param user 
   * @returns 
   */
  registerUser(user: User): Observable<User> {
    const url = `${this.usersURL}/register`;

    // pipe() extends the observable result
    // allowing you to catch errors with `catchError`
    // intercepting `Observable`s that failed
    
    // tap() allows you to tap/look into the flow of observable values,
    // doing something with those values, and passing them along
    return this.http.post<User>(url, user, this.httpOptions).pipe(
      tap((newUser: User) => console.log(`Added user with id=${newUser.id}`)),
      catchError(this.handleError<User>('registerUser'))
    );
  }

  /**
   * Handle HTTP operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`Error encountered in ${operation}: ${error}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
