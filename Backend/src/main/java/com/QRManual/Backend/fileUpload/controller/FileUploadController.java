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
            value = "/upload-file/{dirName}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<FileUploadResponse> upload(
            @RequestPart("file") MultipartFile file,
            @PathVariable String dirName
    ) {
        String path = fileUploadService.uploadFile(file, dirName);

        return ResponseEntity.ok(
                new FileUploadResponse(
                        path,
                        file.getOriginalFilename(),
                        file.getSize()
                )
        );
    }

    @DeleteMapping("/delete-file/{dirName}")
    public ResponseEntity<Void> delete(@RequestParam String path, @PathVariable String dirName) {
        fileUploadService.deleteFile(path, dirName);
        return ResponseEntity.noContent().build();
    }
}