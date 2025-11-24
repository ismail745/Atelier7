import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly employeeForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    salary: [0, [Validators.required, Validators.min(0)]]
  });

  isEditMode = false;
  employeeId?: number;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = Number(id);
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => this.employeeForm.patchValue(employee),
        error: () => (this.errorMessage = 'Unable to load employee')
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: Employee = this.employeeForm.getRawValue();

    const request$ = this.isEditMode && this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.createEmployee(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Unable to save employee';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}

