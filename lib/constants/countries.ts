export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  // Add more countries as needed
];

export function getCountryByCode(code: string) {
  return COUNTRIES.find(c => c.code === code);
}

export function getCountryName(code: string) {
  return COUNTRIES.find(c => c.code === code)?.name || code;
}
