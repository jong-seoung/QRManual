package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.ManualRequest;
import com.QRManual.Backend.productInformation.dto.ManualResponse;
import com.QRManual.Backend.productInformation.service.ManualService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/manual")
@RequiredArgsConstructor
public class ManualController {
    private final ManualService manualService;

    @PostMapping("/create")
    public ManualResponse createManual(@RequestBody ManualRequest request){
        return manualService.createManual(request);
    }

    @PutMapping("/edit/{manualId}")
    public ManualResponse editManual(@PathVariable Long manualId, @RequestBody ManualRequest request){
        return manualService.editManual(manualId, request);
    }

    @DeleteMapping("/delete/{manualId}")
    public ResponseEntity<Void> deleteManual(@PathVariable Long manualId){
        manualService.deleteManual(manualId);
        return ResponseEntity.noContent().build();
    }
}
