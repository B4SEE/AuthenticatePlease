import { Email } from './types';

const legitimateDomains = [
  'google.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'facebook.com',
  'paypal.com',
  'dropbox.com',
  'adobe.com',
  'slack.com',
  'zoom.us',
  'surveymonkey.com',
  'qualtrics.com'
];

const phishingDomains = [
  'g00gle.com',
  'micros0ft.com',
  'apple-support.net',
  'amaz0n-security.com',
  'faceb00k-login.com',
  'paypa1.com',
  'dr0pbox.com',
  'ad0be.net',
  'slack-update.com',
  'zoom-meeting.net',
  'opinion-survey.net',
  'survey-rewards.com'
];

interface EmailTemplate {
  subject: string;
  content: string;
  type: 'login' | 'download' | 'survey';
}

const emailTemplates: EmailTemplate[] = [
  // Login templates
  {
    subject: 'Security Alert',
    content: 'We detected unusual activity on your account. Please verify your identity by logging in.',
    type: 'login'
  },
  {
    subject: 'Account Verification Required',
    content: 'Your account needs to be verified. Please log in to continue using our services.',
    type: 'login'
  },
  {
    subject: 'Password Reset',
    content: 'A password reset was requested for your account. Click below to log in and change your password.',
    type: 'login'
  },
  {
    subject: 'Unusual Activity Detected',
    content: 'We noticed some unusual activity on your account. Please log in to confirm your recent actions.',
    type: 'login'
  },
  {
    subject: 'Update Your Information',
    content: 'Your account information needs to be updated. Please log in to verify your details.',
    type: 'login'
  },
  // Download templates
  {
    subject: 'Your invoice is ready',
    content: 'Your monthly invoice has been generated and is ready for download.',
    type: 'download'
  },
  {
    subject: 'Invoice #INV-2024-001',
    content: 'Please find attached your invoice for recent services. Click the download button to access it.',
    type: 'download'
  },
  {
    subject: 'Document shared with you',
    content: 'A new document has been shared with you. Click download to view the shared file.',
    type: 'download'
  },
  {
    subject: 'Your receipt from recent purchase',
    content: 'Thank you for your purchase. Your receipt is ready for download.',
    type: 'download'
  },
  {
    subject: 'Contract for review',
    content: 'Please review the attached contract document. Use the download button to access it.',
    type: 'download'
  },
  {
    subject: 'Important: Tax document available',
    content: 'Your tax document for 2024 is now available. Please download for your records.',
    type: 'download'
  },
  {
    subject: 'Payslip ready for download',
    content: 'Your monthly payslip has been generated and is ready for download.',
    type: 'download'
  },
  // Survey templates
  {
    subject: "We'd love your feedback!",
    content: "Dear user,\nPlease take a moment to complete our short survey.",
    type: 'survey'
  },
  {
    subject: "Quick survey - Get a $50 reward!",
    content: "Complete our 2-minute survey and receive a $50 gift card as a thank you.",
    type: 'survey'
  },
  {
    subject: "Your opinion matters",
    content: "Help us improve our services by completing a brief satisfaction survey.",
    type: 'survey'
  },
  {
    subject: "Feedback requested - Win prizes!",
    content: "Share your thoughts in our survey and enter to win amazing prizes.",
    type: 'survey'
  }
];

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateEmail(): Email {
  const isPhishing = Math.random() < 0.5;
  const domain = isPhishing ? getRandomElement(phishingDomains) : getRandomElement(legitimateDomains);
  const template = getRandomElement(emailTemplates);
  
  const settings = (() => {
    try {
      const saved = localStorage.getItem('gameSettings');
      return saved ? JSON.parse(saved) : { timerLength: 60 };
    } catch {
      return { timerLength: 60 };
    }
  })();

  // Generate sender based on template type and domain
  const sender = template.type === 'download' 
    ? `billing@${domain}`
    : `security@${domain}`;
  
  return {
    id: generateRandomId(),
    subject: template.subject,
    sender,
    content: template.content,
    isPhishing,
    timeLimit: settings.timerLength,
    startTime: Date.now(),
    type: template.type
  };
}

export function shouldGenerateNewEmail(
  currentEmails: Email[],
  maxEmails: number = 1,
  minTimeBetweenEmails: number = 5000
): boolean {
  if (currentEmails.length >= maxEmails) return false;
  
  const lastEmail = currentEmails[currentEmails.length - 1];
  if (!lastEmail) return true;
  
  return Date.now() - lastEmail.startTime >= minTimeBetweenEmails;
} 