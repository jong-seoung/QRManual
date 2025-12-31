package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.ManualRequest;
import com.QRManual.Backend.productInformation.dto.ManualResponse;
import com.QRManual.Backend.productInformation.service.ManualService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/manual")
@RequiredArgsConstructor
public class ManualController {
    private final ManualService manualService;

    @PostMapping("/create")
    public ManualResponse createManual(@RequestBody ManualRequest request){
        return manualService.createManual(request);
    }
}
