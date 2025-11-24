import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  isLoading = false;
  errorMessage = '';
  private subscription?: Subscription;

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.subscription = this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load employees.';
        this.isLoading = false;
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

