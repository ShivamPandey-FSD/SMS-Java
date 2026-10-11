package com.sms.controller;

import com.sms.entity.Student;
import com.sms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sms.dto.StudentRequest;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Create Student
    @PostMapping
	public ResponseEntity<Student> createStudent(
			@Valid @RequestBody StudentRequest request) {

		Student createdStudent = studentService.createStudent(request);

		return new ResponseEntity<>(
				createdStudent,
				HttpStatus.CREATED
		);
	}

    // Get All Students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get Student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    // Update Student
    @PutMapping("/{id}")
	public ResponseEntity<Student> updateStudent(
			@PathVariable Long id,
			@Valid @RequestBody StudentRequest request) {

		Student updatedStudent =
				studentService.updateStudent(id, request);

		return ResponseEntity.ok(updatedStudent);
	}

    // Delete Student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(org.springframework.security.core.Authentication authentication) {return ResponseEntity.ok(studentService.getMyProfile(authentication.getName()));}
}
