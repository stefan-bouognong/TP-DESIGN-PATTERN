// WidgetFormRenderer.java (ConcreteImplementor - Widgets UI)
package com.example.drive_deal.domain.bridge;

import org.springframework.stereotype.Component;

@Component
public class WidgetFormRenderer implements FormRenderer {
    
    @Override
    public String renderField(String fieldId, String label, String value) {
        return String.format(
            "{\n" +
            "  \"type\": \"text_field\",\n" +
            "  \"id\": \"%s\",\n" +
            "  \"label\": \"%s\",\n" +
            "  \"value\": \"%s\",\n" +
            "  \"editable\": false,\n" +
            "  \"style\": {\n" +
            "    \"margin\": \"10px\",\n" +
            "    \"padding\": \"8px\",\n" +
            "    \"border\": \"1px solid #ddd\",\n" +
            "    \"borderRadius\": \"4px\"\n" +
            "  }\n" +
            "},\n",
            fieldId, escapeJson(label), escapeJson(value)
        );
    }
    
    @Override
    public String renderSection(String title) {
        return String.format(
            "{\n" +
            "  \"type\": \"section\",\n" +
            "  \"title\": \"%s\",\n" +
            "  \"style\": {\n" +
            "    \"backgroundColor\": \"#f5f5f5\",\n" +
            "    \"padding\": \"15px\",\n" +
            "    \"margin\": \"20px 0\",\n" +
            "    \"borderRadius\": \"6px\"\n" +
            "  }\n" +
            "},\n",
            escapeJson(title)
        );
    }
    
    @Override
    public String renderHeader(String formTitle) {
        return String.format(
            "{\n" +
            "  \"form\": {\n" +
            "    \"title\": \"%s\",\n" +
            "    \"type\": \"widget_form\",\n" +
            "    \"generatedAt\": \"%s\",\n" +
            "    \"version\": \"1.0\",\n" +
            "    \"widgets\": [\n",
            escapeJson(formTitle), new java.util.Date().toString()
        );
    }
    
    @Override
    public String renderFooter() {
        return 
            "    {\n" +
            "      \"type\": \"footer\",\n" +
            "      \"text\": \"© 2024 DriveDeal\",\n" +
            "      \"style\": {\n" +
            "        \"textAlign\": \"center\",\n" +
            "        \"color\": \"#666\",\n" +
            "        \"marginTop\": \"30px\"\n" +
            "      }\n" +
            "    }\n" +
            "  ]\n" +
            "}\n" +
            "}";
    }
    
    @Override
    public String getRendererType() {
        return "WIDGET";
    }
    
    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}