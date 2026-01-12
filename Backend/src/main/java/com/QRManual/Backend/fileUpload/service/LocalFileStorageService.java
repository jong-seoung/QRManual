package com.QRManual.Backend.fileUpload.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
@Profile({"local", "dev"})
public class LocalFileStorageService implements FileStorageService{

    @Value("${file.upload.path}")
    private String uploadPath;

    @Value("${backend.url}")
    private String backendUrl;

    @Override
    public String upload(MultipartFile file, String dirName) {
        try {
            String originalFilename = file.getOriginalFilename();
            String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            String savedFileName = UUID.randomUUID() + ext;

            Path dirPath = Paths.get(uploadPath, dirName);
            Files.createDirectories(dirPath);

            Path filePath = dirPath.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath);

            // DB에 저장할 경로
            return backendUrl + "/uploads/" + dirName + "/" + savedFileName;

        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    @Override
    public void delete(String filePath, String dirName) {
        try {
            String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

            log.info(fileName);
            Path path = Paths.get(uploadPath, dirName, fileName);
            Files.deleteIfExists(path);
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }
}