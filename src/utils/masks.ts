// Utilitários para máscaras e validações do formulário

export const applyMask = {
  cpf: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  },

  cep: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  },

  whatsapp: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

export const extractDigits = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCPF = (cpf: string): boolean => {
  const digits = extractDigits(cpf);
  if (digits.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  
  return true;
};

export const validateCEP = (cep: string): boolean => {
  const digits = extractDigits(cep);
  return digits.length === 8;
};

export const validateWhatsApp = (whatsapp: string): boolean => {
  const digits = extractDigits(whatsapp);
  return digits.length === 11 && digits.startsWith('11');
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getCurrentDate = (): string => {
  return formatDate(new Date());
};