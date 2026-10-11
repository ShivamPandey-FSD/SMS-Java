package com.sms.service;

import com.sms.entity.Student;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import com.sms.dto.StudentRequest;
import com.sms.entity.Course;
import com.sms.entity.User;
import com.sms.repository.CourseRepository;
import com.sms.repository.UserRepository;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
	private final UserRepository userRepository;
	private final CourseRepository courseRepository;

    public StudentService(
        StudentRepository studentRepository,
        UserRepository userRepository,
        CourseRepository courseRepository) {

		this.studentRepository = studentRepository;
		this.userRepository = userRepository;
		this.courseRepository = courseRepository;
	}

    // Create Student
    public Student createStudent(StudentRequest request) {

		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() ->
						new ResourceNotFoundException("User not found"));
		
		if (studentRepository.existsByUserId(request.getUserId())) {
			throw new IllegalArgumentException(
					"Student already exists for this user"
			);
		}

		Course course = courseRepository.findById(request.getCourseId())
				.orElseThrow(() ->
						new ResourceNotFoundException("Course not found"));

		Student student = new Student();

		student.setUser(user);
		student.setCourse(course);
		student.setPhone(request.getPhone());
		student.setGender(request.getGender());
		student.setDateOfBirth(request.getDateOfBirth());

		return studentRepository.save(student);
	}

    // Get All Students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get Student By ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    // Update Student
    public Student updateStudent(Long id, StudentRequest request) {

		Student existingStudent = getStudentById(id);

		Course course = courseRepository.findById(request.getCourseId())
				.orElseThrow(() ->
						new ResourceNotFoundException("Course not found"));

		existingStudent.setCourse(course);
		existingStudent.setPhone(request.getPhone());
		existingStudent.setGender(request.getGender());
		existingStudent.setDateOfBirth(request.getDateOfBirth());

		return studentRepository.save(existingStudent);
	}

    // Delete Student
    public void deleteStudent(Long id) {
        Student existingStudent = getStudentById(id);
        studentRepository.delete(existingStudent);
    }
    public Student getMyProfile(String email) {return studentRepository.findByUserEmail(email).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));}
}
