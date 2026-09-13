export interface ParsedUserAgent {
  clientName: string;
  isProxy: boolean;
  category: 'email-client' | 'browser' | 'mobile' | 'bot' | 'unknown';
}

export function parseUserAgent(ua?: string | null): ParsedUserAgent {
  if (!ua) {
    return {
      clientName: 'Unknown Client',
      isProxy: false,
      category: 'unknown',
    };
  }

  // Google Image Proxy (Gmail)
  if (ua.includes('GoogleImageProxy') || ua.includes('ggpht.com')) {
    return {
      clientName: 'Gmail (Google Image Proxy)',
      isProxy: true,
      category: 'email-client',
    };
  }

  // Yahoo Mail Proxy
  if (ua.includes('YahooMailProxy') || ua.includes('Yahoo! Mail')) {
    return {
      clientName: 'Yahoo Mail (Proxy)',
      isProxy: true,
      category: 'email-client',
    };
  }

  // Microsoft Outlook
  if (ua.includes('Outlook') || ua.includes('Microsoft Office')) {
    return {
      clientName: 'Microsoft Outlook',
      isProxy: false,
      category: 'email-client',
    };
  }

  // Thunderbird
  if (ua.includes('Thunderbird')) {
    return {
      clientName: 'Mozilla Thunderbird',
      isProxy: false,
      category: 'email-client',
    };
  }

  // Apple Mail / iOS
  if (
    ua.includes('AppleWebKit') &&
    (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod'))
  ) {
    return {
      clientName: 'Apple Mail (iOS)',
      isProxy: false,
      category: 'mobile',
    };
  }

  // Apple Mail / macOS
  if (
    ua.includes('Macintosh') &&
    !ua.includes('Chrome') &&
    !ua.includes('Firefox')
  ) {
    return {
      clientName: 'Apple Mail (macOS)',
      isProxy: false,
      category: 'email-client',
    };
  }

  // Chrome
  if (ua.includes('Chrome')) {
    return {
      clientName: 'Google Chrome',
      isProxy: false,
      category: 'browser',
    };
  }

  // Firefox
  if (ua.includes('Firefox')) {
    return {
      clientName: 'Mozilla Firefox',
      isProxy: false,
      category: 'browser',
    };
  }

  // Safari
  if (ua.includes('Safari')) {
    return {
      clientName: 'Apple Safari',
      isProxy: false,
      category: 'browser',
    };
  }

  return {
    clientName: ua,
    isProxy: false,
    category: 'unknown',
  };
}
