package com.sms.controller;

import com.sms.dto.TeacherRequest;
import com.sms.entity.Teacher;
import com.sms.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    // Create Teacher
    @PostMapping
    public ResponseEntity<Teacher> createTeacher(
            @Valid @RequestBody TeacherRequest request) {

        Teacher createdTeacher =
                teacherService.createTeacher(request);

        return new ResponseEntity<>(
                createdTeacher,
                HttpStatus.CREATED
        );
    }

    // Get All Teachers
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {

        return ResponseEntity.ok(
                teacherService.getAllTeachers()
        );
    }

    // Get Teacher By ID
    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                teacherService.getTeacherById(id)
        );
    }

    // Update Teacher
    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request) {

        Teacher updatedTeacher =
                teacherService.updateTeacher(id, request);

        return ResponseEntity.ok(updatedTeacher);
    }

    // Delete Teacher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(
            @PathVariable Long id) {

        teacherService.deleteTeacher(id);

        return ResponseEntity.noContent().build();
    }
}