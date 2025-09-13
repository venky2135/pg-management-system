import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Fee } from '../models/fee.model';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private baseUrl = 'http://localhost:8080/api/fees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fee[]> {
    return this.http.get<Fee[]>(`${this.baseUrl}`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Fee> {
    return this.http.get<Fee>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(fee: Fee): Observable<Fee> {
    return this.http.post<Fee>(`${this.baseUrl}`, fee)
      .pipe(catchError(this.handleError));
  }

  update(id: number, fee: Fee): Observable<Fee> {
    return this.http.put<Fee>(`${this.baseUrl}/${id}`, fee)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByStudent(studentId: number): Observable<Fee[]> {
    return this.http.get<Fee[]>(`${this.baseUrl}/student/${studentId}`)
      .pipe(catchError(this.handleError));
  }

  getTotalPaidByStudent(studentId: number): Observable<{totalPaid: number}> {
    return this.http.get<{totalPaid: number}>(`${this.baseUrl}/student/${studentId}/total`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && typeof error.error === 'object') {
        if (error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
