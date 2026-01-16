// FormRenderer.java
package com.example.drive_deal.domain.bridge;

public interface FormRenderer {
    String renderField(String fieldId, String label, String value);
    String renderSection(String title);
    String renderHeader(String formTitle);
    String renderFooter();
    String getRendererType();
}