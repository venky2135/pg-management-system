import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeeService } from '../../services/fee.service';
import { Fee } from '../../models/fee.model';

@Component({
  selector: 'app-fee-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ CommonModule imported here too
  templateUrl: './fee-form.component.html',
  styleUrls: ['./fee-form.component.css']
})
export class FeeFormComponent implements OnInit {
  @Input() studentId!: number;
  @Output() feeSaved = new EventEmitter<void>();

  fee: Fee = { 
    studentId: 0, 
    amount: 0, 
    paymentDate: '', 
    mode: 'Cash' 
  };

  isLoading = false;
  errorMessage = '';

  paymentModes = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

  constructor(private feeService: FeeService) {}

  ngOnInit() {
    this.fee.studentId = this.studentId;
    // Set today's date as default
    const today = new Date();
    this.fee.paymentDate = today.toISOString().split('T')[0];
  }

  save() {
    if (!this.isValidFee()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.feeService.create(this.fee).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Fee payment recorded successfully!');
        this.resetForm();
        this.feeSaved.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
      }
    });
  }

  private isValidFee(): boolean {
    if (!this.fee.amount || this.fee.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount greater than 0';
      return false;
    }
    if (!this.fee.paymentDate) {
      this.errorMessage = 'Please select a payment date';
      return false;
    }
    if (!this.fee.mode) {
      this.errorMessage = 'Please select a payment mode';
      return false;
    }
    return true;
  }

  private resetForm() {
    this.fee = { 
      studentId: this.studentId, 
      amount: 0, 
      paymentDate: new Date().toISOString().split('T')[0], 
      mode: 'Cash' 
    };
    this.errorMessage = '';
  }
}
