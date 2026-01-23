package com.example.drive_deal.domain.adapter;

public interface PdfGenerator {
    byte[] htmlToPdf(String htmlContent) throws PdfConversionException;
}

class PdfConversionException extends RuntimeException {
    public PdfConversionException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public PdfConversionException(String message) {
        super(message);
    }
}