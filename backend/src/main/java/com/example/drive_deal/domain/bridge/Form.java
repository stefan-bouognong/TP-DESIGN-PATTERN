// Form.java (Abstraction)
package com.example.drive_deal.domain.bridge;

public abstract class Form {
    protected FormRenderer renderer;
    
    protected Form(FormRenderer renderer) {
        this.renderer = renderer;
    }
    
    public abstract String render();
    public abstract String getTitle();
    public abstract String getFormType();
    
    // Template method pour le rendu standard
    public String renderForm() {
        return renderer.renderHeader(getTitle()) + 
               render() + 
               renderer.renderFooter();
    }
    
    // Changement dynamique de renderer
    public void setRenderer(FormRenderer renderer) {
        this.renderer = renderer;
    }
    
    public FormRenderer getRenderer() {
        return renderer;
    }
}