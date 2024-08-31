package com.jotform.endrnce.squareclient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/square/oauth")
public class SquareOAuthController {

    @Autowired
    private SquareOAuthService squareOAuthService;

    @GetMapping("/initiateauth")
    public ResponseEntity<String> initiateAuth() {
        String nextUrl = squareOAuthService.initiateAuth();
        if (nextUrl != null) {
            return ResponseEntity.ok(nextUrl);
        } else {
            return ResponseEntity.status(500).body("Failed to initiate auth");
        }
    }


    @GetMapping("/completeauth")
    public ResponseEntity<String> completeAuth(@RequestBody String nextUrl) {
        String token = squareOAuthService.completeAuth(nextUrl);
        if (token != null) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(500).body("Failed to complete auth");
        }
    }

    @GetMapping("/callback")
    public String handleCallback(@RequestParam("code") String authCode, @RequestParam("state") String state) {
    
        return "Authorization code: " + authCode;
    }

}
