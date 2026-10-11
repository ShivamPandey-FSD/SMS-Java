package com.sms.service;

import com.sms.dto.AttendanceRequest;
import com.sms.entity.Attendance;
import com.sms.entity.Student;
import com.sms.entity.Teacher;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.AttendanceRepository;
import com.sms.repository.StudentRepository;
import com.sms.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    // Create Attendance
    public Attendance createAttendance(AttendanceRequest request) {

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        Teacher teacher = teacherRepository
                .findById(request.getTeacherId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found"));

        if (attendanceRepository.existsByStudentIdAndDate(
                request.getStudentId(),
                request.getDate())) {

            throw new IllegalArgumentException(
                    "Attendance already exists for this student on this date"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setMarkedBy(teacher);
        attendance.setDate(request.getDate());
        attendance.setStatus(request.getStatus());

        return attendanceRepository.save(attendance);
    }

    // Get All Attendance
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get Attendance By ID
    public Attendance getAttendanceById(Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance record not found"
                        ));
    }

    // Get Attendance By Student ID
    public List<Attendance> getAttendanceByStudentId(Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found");
        }

        return attendanceRepository.findByStudentId(studentId);
    }

    // Update Attendance
    public Attendance updateAttendance(
            Long id,
            AttendanceRequest request) {

        Attendance existingAttendance =
                getAttendanceById(id);

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        Teacher teacher = teacherRepository
                .findById(request.getTeacherId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found"));

        existingAttendance.setStudent(student);
        existingAttendance.setMarkedBy(teacher);
        existingAttendance.setDate(request.getDate());
        existingAttendance.setStatus(request.getStatus());

        return attendanceRepository.save(existingAttendance);
    }

    // Delete Attendance
    public void deleteAttendance(Long id) {

        Attendance existingAttendance =
                getAttendanceById(id);

        attendanceRepository.delete(existingAttendance);
    }
    public List<Attendance> getMyAttendance(String email) {Student student=studentRepository.findByUserEmail(email).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));return attendanceRepository.findByStudentId(student.getId());}
}
