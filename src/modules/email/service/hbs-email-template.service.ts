import { Injectable } from '@nestjs/common';
import { IEmailTemplateService } from './email-template.service.interface';
import '../compiled/templates.precompiled';

import Handlebars from 'handlebars/runtime';

@Injectable()
export class HbsEmailTemplateService implements IEmailTemplateService {
  render(template: string, lang: string, data: any) {
    const key = `${lang}/${template}`;
    const compiled = Handlebars.templates[key];

    if (!compiled) {
      throw new Error(`Template ${key} not found`);
    }

    return compiled(data);
  }
}
