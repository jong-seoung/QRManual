package com.QRManual.Backend.user.controller;

import com.QRManual.Backend.user.dto.*;
import com.QRManual.Backend.user.service.AuthService;
import com.QRManual.Backend.user.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MailService mailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        boolean response = authService.register(request);
        if (response) {
            return ResponseEntity.ok(Map.of("message", "register success, check email"));
        }
        else{
            return ResponseEntity.ok(Map.of("message", "register failed."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request
    ) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sendEmail")
    @ResponseBody
    public ResponseEntity<?> emailCheck(@RequestBody EmailRequest request) throws MessagingException, UnsupportedEncodingException {
        String Code = mailService.sendSimpleMessage(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "send email is success"));
    }

    @PostMapping("/verifyEmail/{emailCode}")
    public Boolean verifyEmail(@RequestBody EmailRequest emailRequest, @PathVariable String emailCode) {
        return mailService.verifyEmail(emailRequest, emailCode);
    }

    @PostMapping("/findPw/{emailCode}")
    public String findPw(@RequestBody EmailRequest emailRequest, @PathVariable String emailCode) {
        return mailService.findPw(emailRequest, emailCode);
    }

    @PostMapping("/changePw")
    public ResponseEntity<?> changePw(@RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }
}