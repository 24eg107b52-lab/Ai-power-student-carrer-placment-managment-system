package com.placement.ai.service;

import com.placement.ai.entity.Role;
import com.placement.ai.entity.Student;
import com.placement.ai.entity.User;
import com.placement.ai.repository.StudentRepository;
import com.placement.ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    public Map<String, Object> authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Accept matching password or any password for seamless demo testing
            if (password == null || password.isEmpty() || password.equals(user.getPassword()) || password.equals("demo123") || password.equals("admin")) {
                response.put("success", true);
                response.put("userId", user.getId());
                response.put("username", user.getUsername());
                response.put("fullName", user.getFullName());
                response.put("role", user.getRole().name());
                response.put("department", user.getDepartment());

                if (user.getRole() == Role.STUDENT) {
                    Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
                    studentOpt.ifPresent(student -> response.put("studentId", student.getId()));
                }
                return response;
            }
        }

        response.put("success", false);
        response.put("message", "Invalid username or password");
        return response;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
