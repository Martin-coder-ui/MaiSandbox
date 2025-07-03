import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LocalizationSettings {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  country: string;
}

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const useGlobalLocalization = () => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<LocalizationSettings>({
    language: 'en',
    currency: 'USD',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    country: 'US'
  });

  // Currency information
  const currencies: Record<string, CurrencyInfo> = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
    CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    THB: { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' }
  };

  // Auto-detect user's locale preferences
  useEffect(() => {
    const detectLocaleSettings = () => {
      const browserLanguage = navigator.language || 'en';
      const languageCode = browserLanguage.split('-')[0];
      
      // Try to detect country from language
      const countryMap: Record<string, string> = {
        'en': 'US',
        'es': 'ES',
        'fr': 'FR',
        'de': 'DE',
        'it': 'IT',
        'pt': 'BR',
        'nl': 'NL',
        'sv': 'SE',
        'no': 'NO',
        'da': 'DK',
        'fi': 'FI',
        'pl': 'PL',
        'ru': 'RU',
        'zh': 'CN',
        'ja': 'JP',
        'ko': 'KR',
        'ar': 'SA',
        'hi': 'IN'
      };

      // Currency mapping based on country
      const currencyMap: Record<string, string> = {
        'US': 'USD',
        'GB': 'GBP',
        'EU': 'EUR',
        'ES': 'EUR',
        'FR': 'EUR',
        'DE': 'EUR',
        'IT': 'EUR',
        'NL': 'EUR',
        'JP': 'JPY',
        'CA': 'CAD',
        'AU': 'AUD',
        'CH': 'CHF',
        'CN': 'CNY',
        'IN': 'INR',
        'KR': 'KRW',
        'BR': 'BRL',
        'MX': 'MXN',
        'RU': 'RUB',
        'ZA': 'ZAR',
        'SG': 'SGD',
        'HK': 'HKD',
        'NZ': 'NZD',
        'SE': 'SEK',
        'NO': 'NOK',
        'DK': 'DKK',
        'PL': 'PLN',
        'CZ': 'CZK',
        'HU': 'HUF',
        'TR': 'TRY',
        'IL': 'ILS',
        'AE': 'AED',
        'SA': 'SAR',
        'TH': 'THB',
        'MY': 'MYR',
        'ID': 'IDR',
        'PH': 'PHP',
        'VN': 'VND'
      };

      const detectedCountry = countryMap[languageCode] || 'US';
      const detectedCurrency = currencyMap[detectedCountry] || 'USD';

      // Load saved preferences or use detected values
      const savedSettings = localStorage.getItem('mai_localization_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          i18n.changeLanguage(parsed.language);
        } catch (error) {
          console.error('Failed to parse saved localization settings');
        }
      } else {
        const newSettings = {
          language: languageCode,
          currency: detectedCurrency,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateFormat: getDateFormat(languageCode),
          numberFormat: browserLanguage,
          country: detectedCountry
        };
        setSettings(newSettings);
        i18n.changeLanguage(languageCode);
      }
    };

    detectLocaleSettings();
  }, [i18n]);

  // Get appropriate date format for language
  const getDateFormat = (language: string): string => {
    const formatMap: Record<string, string> = {
      'en': 'MM/dd/yyyy',
      'es': 'dd/MM/yyyy',
      'fr': 'dd/MM/yyyy',
      'de': 'dd.MM.yyyy',
      'it': 'dd/MM/yyyy',
      'pt': 'dd/MM/yyyy',
      'nl': 'dd-MM-yyyy',
      'sv': 'yyyy-MM-dd',
      'no': 'dd.MM.yyyy',
      'da': 'dd-MM-yyyy',
      'fi': 'dd.MM.yyyy',
      'pl': 'dd.MM.yyyy',
      'ru': 'dd.MM.yyyy',
      'zh': 'yyyy/MM/dd',
      'ja': 'yyyy/MM/dd',
      'ko': 'yyyy. MM. dd.',
      'ar': 'dd/MM/yyyy',
      'hi': 'dd/MM/yyyy'
    };
    return formatMap[language] || 'MM/dd/yyyy';
  };

  // Update settings and save to localStorage
  const updateSettings = (newSettings: Partial<LocalizationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('mai_localization_settings', JSON.stringify(updatedSettings));
    
    if (newSettings.language) {
      i18n.changeLanguage(newSettings.language);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currencyCode?: string): string => {
    const currency = currencyCode || settings.currency;
    const currencyInfo = currencies[currency];
    
    try {
      return new Intl.NumberFormat(settings.numberFormat, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      return `${currencyInfo?.symbol || '$'}${amount.toLocaleString()}`;
    }
  };

  // Format date
  const formatDate = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(settings.numberFormat, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  };

  // Format number
  const formatNumber = (number: number): string => {
    try {
      return new Intl.NumberFormat(settings.numberFormat).format(number);
    } catch (error) {
      return number.toLocaleString();
    }
  };

  // Get current currency info
  const getCurrentCurrency = (): CurrencyInfo => {
    return currencies[settings.currency] || currencies.USD;
  };

  // Get timezone offset
  const getTimezoneOffset = (): string => {
    try {
      return new Intl.DateTimeFormat('en', {
        timeZone: settings.timezone,
        timeZoneName: 'short'
      }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || '';
    } catch (error) {
      return '';
    }
  };

  return {
    settings,
    updateSettings,
    formatCurrency,
    formatDate,
    formatNumber,
    getCurrentCurrency,
    getTimezoneOffset,
    currencies
  };
};