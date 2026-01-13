package com.QRManual.Backend.QRCode.controller;

import com.QRManual.Backend.QRCode.dto.QRCodeRequest;
import com.QRManual.Backend.QRCode.entity.QRCode;
import com.QRManual.Backend.QRCode.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/qrcode")
@RequiredArgsConstructor
public class QRCodeController {

    private final QRCodeService qrCodeService;

    @PostMapping
    public String create(@RequestParam String url, @RequestBody QRCodeRequest request) {
        return qrCodeService.create(url, request);
    }

    @GetMapping("/read")
    public String read(@PathVariable Long qrCodeId, @RequestParam String url, @RequestBody QRCodeRequest request) {
        return qrCodeService.read(url, request);
    }
}