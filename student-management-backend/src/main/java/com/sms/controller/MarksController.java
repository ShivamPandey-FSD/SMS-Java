package com.sms.controller;

import com.sms.dto.MarksRequest;
import com.sms.entity.Marks;
import com.sms.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    // Create Marks
    @PostMapping
    public ResponseEntity<Marks> createMarks(
            @Valid @RequestBody MarksRequest request) {

        Marks createdMarks =
                marksService.createMarks(request);

        return new ResponseEntity<>(
                createdMarks,
                HttpStatus.CREATED
        );
    }

    // Get All Marks
    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {

        return ResponseEntity.ok(
                marksService.getAllMarks()
        );
    }

    // Get Marks By ID
    @GetMapping("/{id}")
    public ResponseEntity<Marks> getMarksById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                marksService.getMarksById(id)
        );
    }

    // Get Marks By Student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                marksService.getMarksByStudentId(studentId)
        );
    }

    // Update Marks
    @PutMapping("/{id}")
    public ResponseEntity<Marks> updateMarks(
            @PathVariable Long id,
            @Valid @RequestBody MarksRequest request) {

        Marks updatedMarks =
                marksService.updateMarks(id, request);

        return ResponseEntity.ok(updatedMarks);
    }

    // Delete Marks
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarks(
            @PathVariable Long id) {

        marksService.deleteMarks(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/me")
    public ResponseEntity<List<Marks>> getMyMarks(org.springframework.security.core.Authentication authentication) {return ResponseEntity.ok(marksService.getMyMarks(authentication.getName()));}
}
