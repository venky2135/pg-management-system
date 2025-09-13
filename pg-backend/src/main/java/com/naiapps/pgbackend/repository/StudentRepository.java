package com.naiapps.pgbackend.repository;

import com.naiapps.pgbackend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Find student by email
    Optional<Student> findByEmail(String email);
    
    // Find student by room number
    Optional<Student> findByRoomNo(String roomNo);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Check if room number exists
    boolean existsByRoomNo(String roomNo);
}
