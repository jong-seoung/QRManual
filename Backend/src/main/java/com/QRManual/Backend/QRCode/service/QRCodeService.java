package com.QRManual.Backend.QRCode.service;

import com.QRManual.Backend.QRCode.dto.QRCodeRequest;
import com.QRManual.Backend.QRCode.entity.QRCode;
import com.QRManual.Backend.QRCode.entity.QrTargetType;
import com.QRManual.Backend.QRCode.repository.QRCodeRepository;
import com.QRManual.Backend.fileUpload.service.FileStorageService;
import com.QRManual.Backend.productInformation.entity.ProductInformation;
import com.QRManual.Backend.user.entity.User;
import com.QRManual.Backend.user.service.AuthenticationService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QRCodeService {

    private final AuthenticationService authenticationService;
    private final QRCodeStorageService qrCodeStorageService;
    private final QRCodeRepository qrCodeRepository;

    public String create(String url, QRCodeRequest request) {
        User user = authenticationService.checkCompany();

        byte[] qrBytes = generateQrCode(url, 300, 300);

        String fileName = UUID.randomUUID() + ".png";
        String path = qrCodeStorageService.save(qrBytes, fileName);

        QRCode qrCode = new QRCode(url, path, request.getTargetType(), request.getTargetId());
        qrCodeRepository.save(qrCode);
        return qrCode.getImagePath();
    }

    private byte[] generateQrCode(String url, int width, int height) {
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    url,
                    BarcodeFormat.QR_CODE,
                    width,
                    height
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String read(String url, QRCodeRequest request) {
        QRCode qrCode = qrCodeRepository.findById(request.getTargetId())
                .orElseThrow(()-> new IllegalArgumentException("요청한 리소스를 찾을 수 없습니다"));

        return qrCode.getImagePath();
    }
}
