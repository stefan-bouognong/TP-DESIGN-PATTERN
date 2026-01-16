// HtmlFormRenderer.java (ConcreteImplementor - HTML)
package com.example.drive_deal.domain.bridge;

import org.springframework.stereotype.Component;

@Component
public class HtmlFormRenderer implements FormRenderer {
    
    @Override
    public String renderField(String fieldId, String label, String value) {
        return String.format(
            "<div class=\"form-field\">\n" +
            "  <label for=\"%s\">%s:</label>\n" +
            "  <input type=\"text\" id=\"%s\" name=\"%s\" value=\"%s\" readonly>\n" +
            "</div>\n",
            fieldId, label, fieldId, fieldId, escapeHtml(value)
        );
    }
    
    @Override
    public String renderSection(String title) {
        return String.format(
            "<div class=\"form-section\">\n" +
            "  <h3>%s</h3>\n" +
            "</div>\n",
            escapeHtml(title)
        );
    }
    
    @Override
    public String renderHeader(String formTitle) {
        return String.format(
            "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "  <title>%s</title>\n" +
            "  <style>\n" +
            "    body { font-family: Arial, sans-serif; margin: 20px; }\n" +
            "    .form-container { max-width: 800px; margin: auto; }\n" +
            "    .form-header { background: #f0f0f0; padding: 20px; border-radius: 5px; }\n" +
            "    .form-section { margin: 20px 0; padding: 15px; background: #f9f9f9; }\n" +
            "    .form-field { margin: 10px 0; }\n" +
            "    label { font-weight: bold; display: inline-block; width: 150px; }\n" +
            "    input { padding: 5px; width: 300px; }\n" +
            "    .form-footer { margin-top: 30px; text-align: center; color: #666; }\n" +
            "  </style>\n" +
            "</head>\n" +
            "<body>\n" +
            "  <div class=\"form-container\">\n" +
            "    <div class=\"form-header\">\n" +
            "      <h1>%s</h1>\n" +
            "      <p>Généré par DriveDeal - %s</p>\n" +
            "    </div>\n",
            escapeHtml(formTitle), escapeHtml(formTitle), 
            new java.util.Date().toString()
        );
    }
    
    @Override
    public String renderFooter() {
        return 
            "    <div class=\"form-footer\">\n" +
            "      <p>© 2024 DriveDeal - Tous droits réservés</p>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</body>\n" +
            "</html>";
    }
    
    @Override
    public String getRendererType() {
        return "HTML";
    }
    
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}