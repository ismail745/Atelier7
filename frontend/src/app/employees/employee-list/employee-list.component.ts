import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, timeout } from 'rxjs';

import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  isLoading = true;
  errorMessage = '';
  private subscription?: Subscription;

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // S'assurer que le chargement démarre immédiatement
    this.isLoading = true;
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading employees...');
    
    this.subscription = this.employeeService.getEmployees()
      .pipe(
        timeout(10000)
      )
      .subscribe({
        next: (employees) => {
          console.log('Employees loaded:', employees);
          this.employees = employees || [];
          this.isLoading = false;
          console.log('isLoading set to false, employees.length:', this.employees.length);
          this.cdr.detectChanges(); // Forcer la détection de changement
        },
        error: (err) => {
          console.error('Error loading employees:', err);
          this.isLoading = false;
          this.employees = [];
          if (err.name === 'TimeoutError') {
            this.errorMessage = 'Request timeout. Please check your connection.';
          } else if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'Authentication failed. Please login again.';
          } else if (err.status === 0) {
            this.errorMessage = 'Cannot connect to server. Is the backend running?';
          } else {
            this.errorMessage = `Unable to load employees: ${err.message || 'Unknown error'}`;
          }
          this.cdr.detectChanges(); // Forcer la détection de changement
        }
      });
  }

  goToCreate(): void {
    this.router.navigate(['/employees/new']);
  }

  viewDetails(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  deleteEmployee(employee: Employee): void {
    if (!employee.id) {
      return;
    }
    const confirmed = confirm(`Delete ${employee.firstName} ${employee.lastName}?`);
    if (!confirmed) {
      return;
    }
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => this.loadEmployees(),
      error: () => (this.errorMessage = 'Failed to delete employee')
    });
  }
}

