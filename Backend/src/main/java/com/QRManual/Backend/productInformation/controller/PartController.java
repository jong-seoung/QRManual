package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.PartsRequest;
import com.QRManual.Backend.productInformation.dto.PartsResponse;
import com.QRManual.Backend.productInformation.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/part")
@RequiredArgsConstructor
public class PartController {
    private final PartService partService;

    @PostMapping("/create")
    public PartsResponse createPart(@RequestBody PartsRequest request){
        return partService.createPart(request);
    }
}
