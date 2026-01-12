package com.QRManual.Backend.productInformation.service;

import com.QRManual.Backend.productInformation.dto.PartsRequest;
import com.QRManual.Backend.productInformation.dto.PartsResponse;
import com.QRManual.Backend.productInformation.entity.Manual;
import com.QRManual.Backend.productInformation.entity.Parts;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.productInformation.repository.PartRepository;
import com.QRManual.Backend.productInformation.repository.ProductInformationRepository;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class PartService {
    private final AuthenticationService authenticationService;
    private final PartRepository partRepository;
    private final ProductInformationRepository productInformationRepository;

    @Transactional
    public PartsResponse createPart(Long productInformationId, PartsRequest request){
        User user = authenticationService.checkCompany();

        ProductInformation productInformation = productInformationRepository.findByIdAndDeletedFalse(productInformationId)
                .orElseThrow(()-> new IllegalArgumentException("제품 정보를 찾을 수 없습니다."));

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        Parts parts = Parts.builder()
                .productInformation(productInformation)
                .name(request.getName())
                .storeLink(request.getStoreLink())
                .imageUrl(request.getImageUrl())
                .build();

        parts = partRepository.save(parts);

        return PartsResponse.fromEntity(parts);
    }

    @Transactional
    public PartsResponse updatePart(Long partId, PartsRequest request){
        User user = authenticationService.checkCompany();

        Parts parts = partRepository.findById(partId)
                .orElseThrow(()->new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다"));

        ProductInformation productInformation = parts.getProductInformation();

        authenticationService.checkProductOwnership(user.getId(), productInformation.getUser().getId());

        parts.update(request);

        return PartsResponse.fromEntity(parts);
    }

    @Transactional
    public void syncParts(ProductInformation product, List<PartsRequest> incoming) {
        List<Parts> existing = product.getPartsList();

        List<Parts> toDelete = existing.stream()
                .filter(p -> incoming.stream()
                        .noneMatch(i -> i.getId() != null && i.getId().equals(p.getId())))
                .toList();

        toDelete.forEach(product::removePart);

        for (PartsRequest pr : incoming) {
            if (pr.getId() == null) {
                createPart(product.getId(), pr);
            } else {
                updatePart(pr.getId(), pr);
            }
        }
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
