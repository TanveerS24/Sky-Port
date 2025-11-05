package com.tanveer.authservice.auth_service;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @GetMapping("/login")
    public String test(){
        return "Auth Service is working!";
    }
    
}
