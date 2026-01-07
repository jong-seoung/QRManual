package com.QRManual.Backend.fileUpload.service;

import com.QRManual.Backend.productInformation.entity.Manual;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final FileStorageService fileStorageService;

    public String uploadFile(MultipartFile file, String dirName) {
        return fileStorageService.upload(file, dirName);
    }
}
