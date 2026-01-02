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
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class CustomerServiceService {
    private final AuthenticationService authenticationService;
    private final CustomerServiceRepository customerServiceRepository;
    private final ProductInformationRepository productInformationRepository;

    public CustomerServiceResponse createCustomerService(CustomerServiceRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(request.getProductInformation_id())
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

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

    @Transactional
    public CustomerServiceResponse editCustomerService(Long customerServiceId, CustomerServiceRequest request){
        User user = authenticationService.checkCompany();

        CustomerService customerService = customerServiceRepository.findById(customerServiceId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        ProductInformation productInformation = customerService.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        customerService.setEmail(request.getEmail());
        customerService.setPhone(request.getPhone());
        customerService.setChatLink(request.getChatLink());
        customerService.setOperationTime(request.getOperationTime());

        return CustomerServiceResponse.builder()
                .id(customerService.getId())
                .build();
    }

    @Transactional
    public void deleteCustomerService(Long customerServiceId){
        User user = authenticationService.checkCompany();

        CustomerService customerService = customerServiceRepository.findById(customerServiceId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        ProductInformation productInformation = customerService.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.removeCustomerService();

        customerServiceRepository.delete(customerService);
    }
}
