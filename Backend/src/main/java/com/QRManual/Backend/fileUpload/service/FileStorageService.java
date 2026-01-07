package com.QRManual.Backend.fileUpload.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * 파일 저장
     * @return 저장된 파일 접근 경로(URL 또는 상대 경로)
     */
    String upload(MultipartFile file, String dirName);

    /**
     * 파일 삭제
     */
    void delete(String filePath);
}
