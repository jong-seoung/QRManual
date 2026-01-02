package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.FaqRequest;
import com.QRManual.Backend.productInformation.dto.FaqResponse;
import com.QRManual.Backend.productInformation.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/faq")
@RequiredArgsConstructor
public class FaqsController {

    private final FaqService faqService;

    @PostMapping("/create")
    public FaqResponse createFaq(@RequestBody FaqRequest request){
        return faqService.createFaq(request);
    }

    @PutMapping("/edit/{faqId}")
    public FaqResponse editFaq(@PathVariable Long faqId, @RequestBody FaqRequest request){
        return faqService.editFaq(faqId, request);
    }

    @DeleteMapping("/delete/{faqId}")
    public ResponseEntity<Void> deleteFaq(@PathVariable Long faqId){
        faqService.deleteFaq(faqId);
        return ResponseEntity.noContent().build();
    }
}
