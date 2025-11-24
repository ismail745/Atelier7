package com.example.employees.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employees.entity.Employee;
import com.example.employees.exception.ResourceNotFoundException;
import com.example.employees.repository.EmployeeRepository;
import com.example.employees.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id));
    }

    @Override
    @Transactional
    public Employee createEmployee(Employee employee) {
        employeeRepository.findByEmail(employee.getEmail()).ifPresent(e -> {
            throw new IllegalArgumentException("Email already in use");
        });
        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public Employee updateEmployee(Long id, Employee employee) {
        Employee existing = getEmployeeById(id);
        if (!existing.getEmail().equals(employee.getEmail())
                && employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        existing.setFirstName(employee.getFirstName());
        existing.setLastName(employee.getLastName());
        existing.setEmail(employee.getEmail());
        existing.setSalary(employee.getSalary());
        return employeeRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}

