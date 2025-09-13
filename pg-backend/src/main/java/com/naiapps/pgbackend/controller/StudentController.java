package com.naiapps.pgbackend.controller;

import com.naiapps.pgbackend.entity.Student;
import com.naiapps.pgbackend.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        try {
            List<Student> students = studentRepository.findAll();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        try {
            Optional<Student> student = studentRepository.findById(id);
            return student.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody Student student, BindingResult result) {
        try {
            if (result.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                result.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(errors);
            }

            // Check if email already exists
            if (studentRepository.existsByEmail(student.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("email", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if room number already exists
            if (studentRepository.existsByRoomNo(student.getRoomNo())) {
                Map<String, String> error = new HashMap<>();
                error.put("roomNo", "Room number already assigned");
                return ResponseEntity.badRequest().body(error);
            }

            Student savedStudent = studentRepository.save(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error creating student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student studentDetails, BindingResult result) {
        try {
            if (result.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                result.getFieldErrors().forEach(error -> 
                    errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(errors);
            }

            Optional<Student> studentOpt = studentRepository.findById(id);
            if (!studentOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Student student = studentOpt.get();
            
            // Check if email is being changed and if new email already exists
            if (!student.getEmail().equals(studentDetails.getEmail()) && 
                studentRepository.existsByEmail(studentDetails.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("email", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if room number is being changed and if new room number already exists
            if (!student.getRoomNo().equals(studentDetails.getRoomNo()) && 
                studentRepository.existsByRoomNo(studentDetails.getRoomNo())) {
                Map<String, String> error = new HashMap<>();
                error.put("roomNo", "Room number already assigned");
                return ResponseEntity.badRequest().body(error);
            }

            // Update student details
            student.setName(studentDetails.getName());
            student.setEmail(studentDetails.getEmail());
            student.setPhone(studentDetails.getPhone());
            student.setRoomNo(studentDetails.getRoomNo());

            Student updatedStudent = studentRepository.save(student);
            return ResponseEntity.ok(updatedStudent);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error updating student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            if (!studentRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            studentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error deleting student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam(required = false) String email, 
                                                       @RequestParam(required = false) String roomNo) {
        try {
            if (email != null && !email.isEmpty()) {
                Optional<Student> student = studentRepository.findByEmail(email);
                return ResponseEntity.ok(student.map(List::of).orElse(List.of()));
            }
            
            if (roomNo != null && !roomNo.isEmpty()) {
                Optional<Student> student = studentRepository.findByRoomNo(roomNo);
                return ResponseEntity.ok(student.map(List::of).orElse(List.of()));
            }
            
            return ResponseEntity.ok(studentRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
