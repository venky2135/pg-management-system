export interface Fee {
  id?: number;
  studentId: number;
  studentName?: string;
  amount: number;
  paymentDate: string;
  mode: string;
  status?: string;
}
