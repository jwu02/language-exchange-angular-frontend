import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
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
   * @param user object containing details for the new user to be created in the database
   * @returns the new user created
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
   * Send a HTTP get request to the server to query whether a value already exists
   * in the queryField
   * @param queryField the field in the database to query
   * @param value value to check if exists
   * @returns a boolean indicating whether the value exists in the queryField
   */
  valueExistsValidation(queryField: string, value: string): Observable<boolean> {
    const url = `${this.usersURL}/register/${queryField}-exists?value=${value}`
    return this.http.get<boolean>(url).pipe(
      tap((response: boolean) => 
        console.log(`${queryField} value ${value} exists: ${response}`)),
      catchError(this.handleError<boolean>('emailExistsValidation'))
    )
  }

  /**
   * Make a login POST request to server
   * @param loginDetails HTTP body data to be sent off
   * @returns 
   */
  loginUser(loginDetails: any): Observable<any> {
    const url = `${this.usersURL}/login`;

    return this.http.post<any>(url, loginDetails, this.httpOptions);
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
