import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Language } from '../models/language';
import { LanguageProficiency } from '../models/language-proficiency';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languagesURL = "http://localhost:8080/api/v1/language";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getExchangeableLanguages(): Observable<Language[]> {
    const url = `${this.languagesURL}/exchangeable-languages`;

    return this.http.get<Language[]>(url).pipe(
      tap((response: Language[]) => 
        console.log(response)),
      catchError(this.handleError<Language[]>('getExchangeableLanguages'))
    )
  }

  getLanguageProficiencies(): Observable<LanguageProficiency[]> {
    const url = `${this.languagesURL}/language-proficiencies`;

    return this.http.get<LanguageProficiency[]>(url).pipe(
      tap((response: LanguageProficiency[]) => 
        console.log(response)),
      catchError(this.handleError<LanguageProficiency[]>('getLanguageProficiencies'))
    )
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
