package com.QRManual.Backend.QRCode.service;

import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class LocalQRCodeStorageService implements QRCodeStorageService{

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${backend.url}")
    private String backendUrl;

    @Override
    public String save(byte[] data, String fileName) {
        try {
            Path dirPath = Paths.get(uploadDir);
            Files.createDirectories(dirPath);

            Path filePath = dirPath.resolve(fileName);
            Files.write(filePath, data);

            // 프론트에서 접근할 경로
            return backendUrl + "/uploads/QRCode/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }
}
