package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.CustomerServiceRequest;
import com.QRManual.Backend.productInformation.dto.CustomerServiceResponse;
import com.QRManual.Backend.productInformation.entity.CustomerService;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.CustomerServiceRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomerServiceService {
    private final AuthenticationService authenticationService;
    private final CustomerServiceRepository customerServiceRepository;
    private final ProductInformationRepository productInformationRepository;

    public CustomerServiceResponse createCustomerService(CustomerServiceRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findById(request.getProductInformation_id())
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        CustomerService customerService = new CustomerService();
        customerService.setProductInformation(productInformation);
        customerService.setEmail(request.getEmail());
        customerService.setPhone(request.getPhone());
        customerService.setChatLink(request.getChatLink());
        customerService.setOperationTime(request.getOperationTime());

        CustomerService saved = customerServiceRepository.save(customerService);

        return CustomerServiceResponse.builder()
                .id(saved.getId())
                .build();
    }
}
