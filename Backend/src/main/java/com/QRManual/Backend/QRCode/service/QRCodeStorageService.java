package com.QRManual.Backend.QRCode.service;

public interface QRCodeStorageService {
    String save(byte[] data, String fileName);
}
