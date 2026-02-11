import { Injectable } from '@nestjs/common';
import { IEmailTemplateService } from './email-template.service.interface';
import '../compiled/templates.precompiled';

import Handlebars from 'handlebars/runtime';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';

@Injectable()
export class HbsEmailTemplateService implements IEmailTemplateService {
  render(template: string, lang: string, data: any) {
    const key = `${lang}/${template}`;
    const compiled = Handlebars.templates[key];

    if (!compiled) {
      throw new AppError(APP_ERRORS.TEMPLATE_NOT_FOUND);
    }

    return compiled(data);
  }
}
