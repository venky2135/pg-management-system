import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}`, student)
      .pipe(catchError(this.handleError));
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  searchByEmail(email: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/search?email=${email}`)
      .pipe(catchError(this.handleError));
  }

  searchByRoom(roomNo: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/search?roomNo=${roomNo}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
