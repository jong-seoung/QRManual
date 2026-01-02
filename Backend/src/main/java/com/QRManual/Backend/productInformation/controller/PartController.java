package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.PartsRequest;
import com.QRManual.Backend.productInformation.dto.PartsResponse;
import com.QRManual.Backend.productInformation.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/part")
@RequiredArgsConstructor
public class PartController {
    private final PartService partService;

    @PostMapping("/create")
    public PartsResponse createPart(@RequestBody PartsRequest request){
        return partService.createPart(request);
    }

    @PutMapping("/edit/{partId}")
    public PartsResponse editPart(@PathVariable Long partId, @RequestBody PartsRequest request){
        return partService.editPart(partId, request);
    }

    @DeleteMapping("/delete/{partId}")
    public ResponseEntity<Void> deletePart(@PathVariable Long partId){
        partService.deletePart(partId);
        return ResponseEntity.noContent().build();
    }
}
