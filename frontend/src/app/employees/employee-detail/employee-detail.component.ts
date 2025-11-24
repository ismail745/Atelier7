import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  employee?: Employee;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/employees']);
      return;
    }
    this.loadEmployee(id);
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading employee:', err);
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = 'Employee not found.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Authentication failed. Please login again.';
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Is the backend running?';
        } else {
          this.errorMessage = 'Unable to load employee details.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  backToList(): void {
    this.router.navigate(['/employees']);
  }

  editEmployee(): void {
    if (this.employee?.id) {
      this.router.navigate(['/employees', this.employee.id, 'edit']);
    }
  }

  deleteEmployee(): void {
    if (!this.employee?.id) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${this.employee.firstName} ${this.employee.lastName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.errorMessage = 'Failed to delete employee. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}

