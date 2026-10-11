package com.sms.service;

import com.sms.dto.TeacherRequest;
import com.sms.entity.Teacher;
import com.sms.entity.User;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.TeacherRepository;
import com.sms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public TeacherService(
            TeacherRepository teacherRepository,
            UserRepository userRepository) {

        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    // Create Teacher
    public Teacher createTeacher(TeacherRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (teacherRepository.existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException(
                    "Teacher already exists for this user"
            );
        }

        Teacher teacher = new Teacher();

        teacher.setUser(user);
        teacher.setSubject(request.getSubject());

        return teacherRepository.save(teacher);
    }

    // Get All Teachers
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // Get Teacher By ID
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found"));
    }

    // Update Teacher
    public Teacher updateTeacher(Long id, TeacherRequest request) {

        Teacher existingTeacher = getTeacherById(id);

        existingTeacher.setSubject(request.getSubject());

        return teacherRepository.save(existingTeacher);
    }

    // Delete Teacher
    public void deleteTeacher(Long id) {

        Teacher existingTeacher = getTeacherById(id);

        teacherRepository.delete(existingTeacher);
    }
}