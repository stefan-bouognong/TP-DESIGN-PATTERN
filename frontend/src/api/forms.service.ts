import api from './index.service';

export interface FormRenderRequest {
  formType: string;
  entityId: number;
  rendererType: string;
  includeDetails?: boolean;
}

export interface FormRenderResponse {
  formType: string;
  rendererType: string;
  title: string;
  content: string;
  entityId: number;
  mimeType: string;
  fieldCount: number;
}

export interface WidgetFormResponse {
  form: {
    title: string;
    type: string;
    widgets: Array<{
      type: string;
      id: string;
      label: string;
      value: string;
      editable: boolean;
    }>;
  };
}

export interface DynamicRenderRequest {
  includeTechnicalDetails?: boolean;
  includeFinancialDetails?: boolean;
  theme?: string;
  compactMode?: boolean;
}

export const formsService = {
  // Rendre un formulaire générique
  renderForm: (data: FormRenderRequest) => 
    api.post<FormRenderResponse>('/forms/render', data),

  // Formulaire véhicule en HTML
  getVehicleFormHtml: (id: number) => 
    api.get<string>(`/forms/vehicle/${id}/html`, { responseType: 'text' }),

  // Formulaire véhicule en Widgets (JSON)
  getVehicleFormWidget: (id: number) => 
    api.get<WidgetFormResponse>(`/forms/vehicle/${id}/widget`),

  // Formulaire client en HTML
  getClientFormHtml: (id: number) => 
    api.get<string>(`/forms/client/${id}/html`, { responseType: 'text' }),

  // Formulaire commande en HTML
  getOrderFormHtml: (id: number) => 
    api.get<string>(`/forms/order/${id}/html`, { responseType: 'text' }),

  // Rendu dynamique avec options
  dynamicRender: (
    formType: string, 
    entityId: number, 
    renderer: string, 
    options?: DynamicRenderRequest
  ) => 
    api.post(`/forms/dynamic`, options, {
      params: { formType, entityId, renderer }
    }),

  // Liste des renderers disponibles
  getRenderers: () => 
    api.get<string[]>('/forms/renderers'),
};