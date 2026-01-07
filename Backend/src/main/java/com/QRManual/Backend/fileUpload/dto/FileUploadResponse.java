package com.QRManual.Backend.fileUpload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadResponse {
    private String path;
    private String originalName;
    private long size;
}
