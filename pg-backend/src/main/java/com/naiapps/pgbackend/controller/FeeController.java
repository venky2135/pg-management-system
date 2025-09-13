package com.naiapps.pgbackend.controller;

import com.naiapps.pgbackend.entity.Fee;
import com.naiapps.pgbackend.entity.Student;
import com.naiapps.pgbackend.repository.FeeRepository;
import com.naiapps.pgbackend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeRepository feeRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        try {
            List<Fee> fees = feeRepository.findAll();
            return ResponseEntity.ok(fees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable Long id) {
        try {
            Optional<Fee> fee = feeRepository.findById(id);
            return fee.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createFee(@RequestBody Map<String, Object> feeData) {
        try {
            Long studentId = Long.valueOf(feeData.get("studentId").toString());
            Double amount = Double.valueOf(feeData.get("amount").toString());
            String paymentDateStr = feeData.get("paymentDate").toString();
            String mode = feeData.get("mode").toString();

            Optional<Student> studentOpt = studentRepository.findById(studentId);
            if (!studentOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Student not found with ID: " + studentId);
                return ResponseEntity.badRequest().body(error);
            }

            Fee fee = Fee.builder()
                    .student(studentOpt.get())
                    .amount(amount)
                    .paymentDate(LocalDate.parse(paymentDateStr))
                    .mode(mode)
                    .status("PAID")
                    .build();

            Fee savedFee = feeRepository.save(fee);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFee);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error creating fee: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFee(@PathVariable Long id, @RequestBody Map<String, Object> feeData) {
        try {
            Optional<Fee> feeOpt = feeRepository.findById(id);
            if (!feeOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Fee fee = feeOpt.get();
            
            if (feeData.containsKey("amount")) {
                fee.setAmount(Double.valueOf(feeData.get("amount").toString()));
            }
            if (feeData.containsKey("paymentDate")) {
                fee.setPaymentDate(LocalDate.parse(feeData.get("paymentDate").toString()));
            }
            if (feeData.containsKey("mode")) {
                fee.setMode(feeData.get("mode").toString());
            }
            if (feeData.containsKey("status")) {
                fee.setStatus(feeData.get("status").toString());
            }

            Fee updatedFee = feeRepository.save(fee);
            return ResponseEntity.ok(updatedFee);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error updating fee: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFee(@PathVariable Long id) {
        try {
            if (!feeRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            feeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error deleting fee: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ✅ FIXED: Use the corrected repository method to avoid lazy loading issues
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Fee>> getFeesByStudent(@PathVariable Long studentId) {
        try {
            // Use the method that doesn't trigger lazy loading
            List<Fee> fees = feeRepository.findByStudent_IdOrderByPaymentDateDesc(studentId);
            return ResponseEntity.ok(fees);
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/student/{studentId}/total")
    public ResponseEntity<Map<String, Double>> getTotalPaidByStudent(@PathVariable Long studentId) {
        try {
            Double total = feeRepository.getTotalPaidAmountByStudent(studentId);
            Map<String, Double> response = new HashMap<>();
            response.put("totalPaid", total != null ? total : 0.0);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
