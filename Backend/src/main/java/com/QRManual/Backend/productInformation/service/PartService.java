package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.PartsRequest;
import com.QRManual.Backend.productInformation.dto.PartsResponse;
import com.QRManual.Backend.productInformation.entity.Parts;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.PartRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class PartService {
    private final AuthenticationService authenticationService;
    private final PartRepository partRepository;
    private final ProductInformationRepository productInformationRepository;

    public PartsResponse createPart(PartsRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findById(request.getProductInformation_id())
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        Parts parts = new Parts();
        parts.setProductInformation(productInformation);
        parts.setName(request.getName());
        parts.setStoreLink(request.getStoreLink());

        Parts saved = partRepository.save(parts);

        return PartsResponse.builder()
                .id(saved.getId())
                .build();
    }

    @Transactional
    public void deletePart(Long partId){
        User user = authenticationService.checkCompany();

        Parts parts = partRepository.findById(partId)
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다."));

        ProductInformation productInformation = parts.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        productInformation.removePart(parts);

        partRepository.delete(parts);
    }
}
