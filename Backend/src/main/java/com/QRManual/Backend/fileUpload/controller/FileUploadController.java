package com.QRManual.Backend.fileUpload.controller;

import com.QRManual.Backend.fileUpload.dto.FileUploadResponse;
import com.QRManual.Backend.fileUpload.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping(
            value = "/upload-file/{name}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<FileUploadResponse> upload(
            @RequestPart("file") MultipartFile file,
            @PathVariable String name
    ) {
        String path = fileUploadService.uploadFile(file, name);

        return ResponseEntity.ok(
                new FileUploadResponse(
                        path,
                        file.getOriginalFilename(),
                        file.getSize()
                )
        );
    }
}