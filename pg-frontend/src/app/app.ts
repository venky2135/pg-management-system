import { Component } from '@angular/core';
import { StudentListComponent } from './components/student-list/student-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentListComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🏠 PG Student Management System</h1>
        <p>Manage students, rooms, and fee payments efficiently</p>
      </header>
      
      <main class="app-main">
        <app-student-list></app-student-list>
      </main>

      <footer class="app-footer">
        <p>&copy; 2025 PG Management System. Built with Angular & Spring Boot.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 40px 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .app-header p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .app-main {
      flex: 1;
      padding: 0;
    }

    .app-footer {
      background-color: #343a40;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .app-header h1 {
        font-size: 2rem;
      }
      
      .app-header p {
        font-size: 1rem;
      }
    }
  `]
})
export class App {
  protected title = 'PG Management System';
}
