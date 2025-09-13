import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeService } from '../../services/fee.service';
import { Fee } from '../../models/fee.model';

@Component({
  selector: 'app-fee-history',
  standalone: true,
  imports: [CommonModule], // ✅ CommonModule imported here
  templateUrl: './fee-history.component.html',
  styleUrls: ['./fee-history.component.css']
})
export class FeeHistoryComponent implements OnInit {
  @Input() studentId!: number;
  
  fees: Fee[] = [];
  totalPaid = 0;
  isLoading = false;
  errorMessage = '';

  constructor(private feeService: FeeService) {}

  ngOnInit() {
    this.loadFees();
    this.loadTotalPaid();
  }

  loadFees() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.feeService.getByStudent(this.studentId).subscribe({
      next: (data) => {
        this.fees = data.sort((a, b) => 
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error;
        this.isLoading = false;
      }
    });
  }

  loadTotalPaid() {
    this.feeService.getTotalPaidByStudent(this.studentId).subscribe({
      next: (data) => {
        this.totalPaid = data.totalPaid;
      },
      error: (error) => {
        console.error('Error loading total paid amount:', error);
      }
    });
  }

  deleteFee(fee: Fee) {
    if (confirm('Are you sure you want to delete this payment record?')) {
      this.feeService.delete(fee.id!).subscribe({
        next: () => {
          alert('Payment record deleted successfully!');
          this.loadFees();
          this.loadTotalPaid();
        },
        error: (error) => {
          alert('Error deleting payment record: ' + error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
