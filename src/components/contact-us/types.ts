export interface ContactForm {
  subject: string;
  descriptions: Descriptions;
  email?: string;
  name?: string;
  themes: Themes;
  optionalData: OptionalData;
  feedbackContact: boolean;
  questions: Questions;
}

export interface OptionalData {
  userAgent: string;
  sessionId?: string;
}

export interface Questions {
  issueDescription?: QuestionDetail;
  additionalDescription?: QuestionDetail;
  optionalDescription?: QuestionDetail;
}

export interface QuestionDetail {
  text: string;
  order: number;
}

export interface Descriptions {
  issueDescription?: string;
  additionalDescription?: string;
  optionalDescription?: string;
}

export interface Themes {
  theme: string;
  subtheme?: string;
}

export interface ContactUsServiceInterface {
  contactUsSubmitForm: (contactForm: ContactForm) => Promise<void>;
}
