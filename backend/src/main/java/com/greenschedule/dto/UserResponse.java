package com.greenschedule.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String employeeNumber;
    private String role;
}