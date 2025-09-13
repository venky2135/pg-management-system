import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { StudentFormComponent } from '../student-form/student-form.component';
import { FeeFormComponent } from '../fee-form/fee-form.component';
import { FeeHistoryComponent } from '../fee-history/fee-history.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentFormComponent, FeeFormComponent, FeeHistoryComponent],
  template: `
    <div class="student-management">
      <div class="header">
        <h2>Student Management</h2>
        <button (click)="toggleAddForm()" class="btn btn-primary">
          {{showAddForm ? 'Cancel' : 'Add New Student'}}
        </button>
      </div>

      <!-- Add Student Form -->
      <app-student-form
        *ngIf="showAddForm"
        [showForm]="showAddForm"
        (studentSaved)="onStudentSaved()"
        (formCancelled)="onFormCancelled()">
      </app-student-form>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-group">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            placeholder="Search by name, email, or room number..."
            class="search-input">
          <button (click)="searchStudents()" class="btn btn-search">Search</button>
          <button (click)="clearSearch()" class="btn btn-secondary">Clear</button>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="loading">Loading students...</div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="error-message">{{errorMessage}}</div>

      <!-- Students List -->
      <div *ngIf="!isLoading && students.length > 0" class="students-grid">
        <div *ngFor="let student of filteredStudents" class="student-card">
          <div class="student-header">
            <h3>{{student.name}}</h3>
            <div class="student-actions">
              <button (click)="editStudent(student)" class="btn btn-sm btn-edit">Edit</button>
              <button (click)="deleteStudent(student)" class="btn btn-sm btn-delete">Delete</button>
            </div>
          </div>
          
          <div class="student-details">
            <p><strong>Email:</strong> {{student.email}}</p>
            <p><strong>Phone:</strong> {{student.phone}}</p>
            <p><strong>Room:</strong> {{student.roomNo}}</p>
          </div>

          <!-- Fee Management Section -->
          <div class="fee-section">
            <h4>Fee Management</h4>
            
            <!-- Fee Form -->
            <app-fee-form 
              [studentId]="student.id!"
              (feeSaved)="onFeeSaved()">
            </app-fee-form>

            <!-- Fee History -->
            <app-fee-history 
              [studentId]="student.id!">
            </app-fee-history>
          </div>
        </div>
      </div>

      <!-- No Students Message -->
      <div *ngIf="!isLoading && students.length === 0" class="no-students">
        <p>No students found. <a (click)="toggleAddForm()">Add the first student</a></p>
      </div>

      <!-- Edit Student Modal -->
      <div *ngIf="showEditForm" class="modal-overlay">
        <div class="modal-content">
          <app-student-form
            [studentData]="selectedStudent"
            [showForm]="showEditForm"
            (studentSaved)="onStudentSaved()"
            (formCancelled)="onEditCancelled()">
          </app-student-form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-management {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      color: #333;
      margin: 0;
    }

    .search-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .search-group {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .search-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .students-grid {
      display: grid;
      gap: 20px;
    }

    .student-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .student-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .student-header h3 {
      margin: 0;
      color: #333;
    }

    .student-actions {
      display: flex;
      gap: 8px;
    }

    .student-details {
      margin-bottom: 20px;
    }

    .student-details p {
      margin: 5px 0;
      color: #666;
    }

    .fee-section {
      border-top: 1px solid #eee;
      padding-top: 15px;
    }

    .fee-section h4 {
      color: #333;
      margin-bottom: 15px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-search {
      background-color: #28a745;
      color: white;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .btn-edit {
      background-color: #ffc107;
      color: #212529;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .loading {
      text-align: center;
      padding: 20px;
      font-style: italic;
      color: #666;
    }

    .error-message {
      color: #dc3545;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 20px;
    }

    .no-students {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-students a {
      color: #007bff;
      cursor: pointer;
      text-decoration: underline;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 500px;
      width: 90%;
      max-height: 90%;
      overflow-y: auto;
    }
  `]
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  selectedStudent?: Student;
  searchTerm = '';
  showAddForm = false;
  showEditForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = students;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  searchStudents() {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = this.students;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.roomNo.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredStudents = this.students;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  editStudent(student: Student) {
    this.selectedStudent = { ...student };
    this.showEditForm = true;
  }

  deleteStudent(student: Student) {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      this.studentService.delete(student.id!).subscribe({
        next: () => {
          alert('Student deleted successfully!');
          this.loadStudents();
        },
        error: (error) => {
          alert('Error deleting student: ' + error);
        }
      });
    }
  }

  onStudentSaved() {
    this.showAddForm = false;
    this.showEditForm = false;
    this.selectedStudent = undefined;
    this.loadStudents();
  }

  onFormCancelled() {
    this.showAddForm = false;
  }

  onEditCancelled() {
    this.showEditForm = false;
    this.selectedStudent = undefined;
  }

  onFeeSaved() {
    // Refresh fee data if needed
    console.log('Fee saved - refreshing data if necessary');
  }
}
