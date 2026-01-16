// PdfDocument.java (Target Interface)
package com.example.drive_deal.domain.adapter;

public interface PdfDocument {
    byte[] generatePdf();
    String getFileName();
    String getContentType();
    long getFileSize();
}