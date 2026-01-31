package com.example.drive_deal.utils;

import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Component
public class HtmlTemplateProcessor {

    private final TemplateEngine templateEngine;

    public HtmlTemplateProcessor(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public String process(String template, Object data) {
        Context context = new Context();
        context.setVariable("data", data);
        return templateEngine.process(template, context);
    }
}
