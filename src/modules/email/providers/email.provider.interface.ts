interface IBaseEmailPayload {
  to: string | string[];
  subject?: string;
  template?: string;
  cc?: string | string[];
}

type EmailWithText = {
  text: string;
  html?: never;
};

type EmailWithHtml = {
  html: string;
  text?: never;
};

export type IEmailPayload = IBaseEmailPayload & (EmailWithText | EmailWithHtml);

export interface IEmailProvider {
  readonly name: string;
  send(payload: IEmailPayload): Promise<string | undefined>;
}
