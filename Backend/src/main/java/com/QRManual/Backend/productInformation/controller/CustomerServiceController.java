package com.QRManual.Backend.productInformation.controller;

import com.QRManual.Backend.productInformation.dto.CustomerServiceRequest;
import com.QRManual.Backend.productInformation.dto.CustomerServiceResponse;
import com.QRManual.Backend.productInformation.service.CustomerServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customer-service")
@RequiredArgsConstructor
public class CustomerServiceController {

    private final CustomerServiceService customerServiceService;

    @PostMapping("/create")
    public CustomerServiceResponse createCustomerService(@RequestBody CustomerServiceRequest request){
        return customerServiceService.createCustomerService(request);
    }

    @DeleteMapping("/delete/{customerServiceId}")
    public ResponseEntity<Void> deleteCustomerService(@PathVariable Long customerServiceId){
        customerServiceService.deleteCustomerService(customerServiceId);
        return ResponseEntity.noContent().build();
    }
}
