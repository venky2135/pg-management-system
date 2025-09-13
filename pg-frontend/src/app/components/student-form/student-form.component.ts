import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="student-form">
      <h3>{{isEdit ? 'Edit Student' : 'Add New Student'}}</h3>
      
      <form (ngSubmit)="save()" #studentForm="ngForm" class="form">
        <div class="form-group">
          <label for="name">Full Name*:</label>
          <input 
            type="text" 
            id="name"
            [(ngModel)]="student.name" 
            name="name" 
            required 
            minlength="2"
            class="form-control"
            placeholder="Enter full name">
        </div>

        <div class="form-group">
          <label for="email">Email*:</label>
          <input 
            type="email" 
            id="email"
            [(ngModel)]="student.email" 
            name="email" 
            required 
            email
            class="form-control"
            placeholder="Enter email address">
        </div>

        <div class="form-group">
          <label for="phone">Phone*:</label>
          <input 
            type="tel" 
            id="phone"
            [(ngModel)]="student.phone" 
            name="phone" 
            required 
            pattern="[0-9]{10}"
            class="form-control"
            placeholder="Enter 10-digit phone number">
        </div>

        <div class="form-group">
          <label for="roomNo">Room Number*:</label>
          <input 
            type="text" 
            id="roomNo"
            [(ngModel)]="student.roomNo" 
            name="roomNo" 
            required 
            class="form-control"
            placeholder="e.g., A101, B202">
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            [disabled]="!studentForm.form.valid || isLoading"
            class="btn btn-primary">
            {{isLoading ? 'Saving...' : (isEdit ? 'Update' : 'Add Student')}}
          </button>
          
          <button 
            type="button" 
            (click)="cancel()" 
            class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>

      <div *ngIf="errorMessage" class="error-message">
        {{errorMessage}}
      </div>
    </div>
  `,
  styles: [`
    .student-form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .error-message {
      color: #dc3545;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 10px;
      margin-top: 10px;
    }
  `]
})
export class StudentFormComponent implements OnInit {
  @Input() studentData?: Student;
  @Input() showForm = false;
  @Output() studentSaved = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  student: Student = {
    name: '',
    email: '',
    phone: '',
    roomNo: ''
  };

  isEdit = false;
  isLoading = false;
  errorMessage = '';

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    if (this.studentData) {
      this.student = { ...this.studentData };
      this.isEdit = true;
    }
  }

  save() {
    this.isLoading = true;
    this.errorMessage = '';

    const operation = this.isEdit 
      ? this.studentService.update(this.student.id!, this.student)
      : this.studentService.create(this.student);

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        alert(this.isEdit ? 'Student updated successfully!' : 'Student added successfully!');
        this.resetForm();
        this.studentSaved.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
      }
    });
  }

  cancel() {
    this.resetForm();
    this.formCancelled.emit();
  }

  private resetForm() {
    this.student = {
      name: '',
      email: '',
      phone: '',
      roomNo: ''
    };
    this.isEdit = false;
    this.errorMessage = '';
  }
}
