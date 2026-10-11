package com.sms.controller;

import com.sms.dto.AttendanceRequest;
import com.sms.entity.Attendance;
import com.sms.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Create Attendance
    @PostMapping
    public ResponseEntity<Attendance> createAttendance(
            @Valid @RequestBody AttendanceRequest request) {

        Attendance createdAttendance =
                attendanceService.createAttendance(request);

        return new ResponseEntity<>(
                createdAttendance,
                HttpStatus.CREATED
        );
    }

    // Get All Attendance
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }

    // Get Attendance By ID
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceById(id)
        );
    }

    // Get Attendance By Student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudentId(studentId)
        );
    }

    // Update Attendance
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {

        Attendance updatedAttendance =
                attendanceService.updateAttendance(id, request);

        return ResponseEntity.ok(updatedAttendance);
    }

    // Delete Attendance
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<List<Attendance>> getMyAttendance(org.springframework.security.core.Authentication authentication) {return ResponseEntity.ok(attendanceService.getMyAttendance(authentication.getName()));}
}
