export interface IEmailTemplateService {
  render: (template: string, lang: string, data: Record<string, any>) => any;
}
