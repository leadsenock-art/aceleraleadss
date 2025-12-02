export const cleanPhoneNumber = (phone: any): string | null => {
  if (!phone) return null;
  
  // Convert to string in case it's a number from Excel
  const str = String(phone).trim();
  
  // Remove all non-numeric characters
  let cleaned = str.replace(/\D/g, '');

  // Basic validation: if too short, it's probably not a valid phone number
  if (cleaned.length < 8) return null;

  return cleaned;
};

export const formatPhoneNumberDisplay = (phone: string | null): string => {
  if (!phone) return 'Sem número';
  
  // Simple formatting for display only (assuming BR format mostly)
  if (phone.length === 11) { // 11 99999 9999
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  }
  if (phone.length === 10) { // 11 9999 9999 (fixo ou antigo)
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
  }
  if (phone.length === 13 && phone.startsWith('55')) { // 55 11 99999 9999
    return `+55 (${phone.substring(2, 4)}) ${phone.substring(4, 9)}-${phone.substring(9)}`;
  }
  if (phone.length === 12 && phone.startsWith('55')) { // 55 11 9999 9999
    return `+55 (${phone.substring(2, 4)}) ${phone.substring(4, 8)}-${phone.substring(8)}`;
  }
  
  return phone;
};

export const generateWhatsAppLink = (phone: string, template: string, leadName: string): string => {
  // Garantir que temos apenas números
  let cleanPhone = phone.replace(/\D/g, '');

  // Lógica inteligente para BR: Se tiver 10 ou 11 dígitos (DDD + Número), adiciona 55.
  // Evita links quebrados para números locais.
  if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
    cleanPhone = '55' + cleanPhone;
  }

  // Replace placeholders
  const processedText = template.replace(/{nome}/gi, leadName || 'Cliente');
  
  const encodedText = encodeURIComponent(processedText);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const generateInstagramLink = (username: string): string => {
  if (!username) return '';

  let cleanUser = String(username).trim();

  // Se já for um link completo (comum em JSON Scrapers), retorna direto
  if (cleanUser.startsWith('http')) {
      return cleanUser;
  }
  
  // Lógica legada para Excel ou inputs manuais (usuário digita @nome ou nome)
  // Remove protocol and domain just in case
  cleanUser = cleanUser.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '');
  
  // Remove query params
  cleanUser = cleanUser.split('?')[0];

  // Remove trailing slashes
  cleanUser = cleanUser.replace(/\/+$/, '');
  
  // Remove @ if present at start
  cleanUser = cleanUser.replace(/^@/, '').trim();
  
  if (!cleanUser) return '';

  // Return strictly the format requested: https://www.instagram.com/username/
  return `https://www.instagram.com/${cleanUser}/`;
};