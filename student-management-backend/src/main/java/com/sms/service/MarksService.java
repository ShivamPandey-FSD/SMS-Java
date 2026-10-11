package com.sms.service;

import com.sms.dto.MarksRequest;
import com.sms.entity.Marks;
import com.sms.entity.Student;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.MarksRepository;
import com.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;

    public MarksService(
            MarksRepository marksRepository,
            StudentRepository studentRepository) {

        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
    }

    // Create Marks
    public Marks createMarks(MarksRequest request) {

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        if (marksRepository.existsByStudentIdAndSubject(
                request.getStudentId(),
                request.getSubject())) {

            throw new IllegalArgumentException(
                    "Marks already exist for this student and subject"
            );
        }

        Marks marks = new Marks();

        marks.setStudent(student);
        marks.setSubject(request.getSubject());
        marks.setMarks(request.getMarks());

        return marksRepository.save(marks);
    }

    // Get All Marks
    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }

    // Get Marks By ID
    public Marks getMarksById(Long id) {

        return marksRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Marks record not found"
                        ));
    }

    // Get Marks By Student ID
    public List<Marks> getMarksByStudentId(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found");
        }

        return marksRepository.findByStudentId(studentId);
    }

    // Update Marks
    public Marks updateMarks(
            Long id,
            MarksRequest request) {

        Marks existingMarks = getMarksById(id);

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        existingMarks.setStudent(student);
        existingMarks.setSubject(request.getSubject());
        existingMarks.setMarks(request.getMarks());

        return marksRepository.save(existingMarks);
    }

    // Delete Marks
    public void deleteMarks(Long id) {

        Marks existingMarks = getMarksById(id);

        marksRepository.delete(existingMarks);
    }
    public List<Marks> getMyMarks(String email) {Student student=studentRepository.findByUserEmail(email).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));return marksRepository.findByStudentId(student.getId());}
}
