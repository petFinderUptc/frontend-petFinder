import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateRequired,
  validateFileSize,
  validateFileType,
  validatePasswordMatch,
  validateColombianPhone,
  validateContact,
  validatePersonName,
  validateColor,
  validateBreed,
  validateDescription,
} from './validation';

describe('validateEmail', () => {
  it('should return invalid for empty string', () => {
    expect(validateEmail('').isValid).toBe(false);
  });

  it('should return invalid for null', () => {
    expect(validateEmail(null).isValid).toBe(false);
  });

  it('should return invalid for missing @', () => {
    expect(validateEmail('userdomain.com').isValid).toBe(false);
  });

  it('should return invalid for missing domain', () => {
    expect(validateEmail('user@').isValid).toBe(false);
  });

  it('should return valid for correct email', () => {
    expect(validateEmail('usuario@dominio.com').isValid).toBe(true);
  });

  it('should return valid for email with subdomain', () => {
    expect(validateEmail('user@mail.petfinder.co').isValid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('should return invalid for empty password', () => {
    expect(validatePassword('').isValid).toBe(false);
  });

  it('should return invalid for null', () => {
    expect(validatePassword(null).isValid).toBe(false);
  });

  it('should return invalid when shorter than 8 characters', () => {
    const result = validatePassword('Abc1');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('8');
  });

  it('should return invalid when no digits', () => {
    expect(validatePassword('AbcdefgH').isValid).toBe(false);
  });

  it('should return invalid when no letters', () => {
    expect(validatePassword('12345678').isValid).toBe(false);
  });

  it('should return valid for strong password', () => {
    expect(validatePassword('Password1').isValid).toBe(true);
  });
});

describe('validateUsername', () => {
  it('should return invalid for empty username', () => {
    expect(validateUsername('').isValid).toBe(false);
  });

  it('should return invalid when shorter than 3 characters', () => {
    expect(validateUsername('ab').isValid).toBe(false);
  });

  it('should return invalid when longer than 30 characters', () => {
    expect(validateUsername('a'.repeat(31)).isValid).toBe(false);
  });

  it('should return invalid for special characters', () => {
    expect(validateUsername('user@name!').isValid).toBe(false);
  });

  it('should return valid with letters, numbers and underscores', () => {
    expect(validateUsername('user_123').isValid).toBe(true);
  });

  it('should return invalid for whitespace-only', () => {
    expect(validateUsername('   ').isValid).toBe(false);
  });
});

describe('validatePhone', () => {
  it('should return invalid for empty phone', () => {
    expect(validatePhone('').isValid).toBe(false);
  });

  it('should return invalid for non-numeric string', () => {
    expect(validatePhone('abc-def-ghij').isValid).toBe(false);
  });

  it('should return valid for standard phone', () => {
    expect(validatePhone('3001234567').isValid).toBe(true);
  });
});

describe('validateRequired', () => {
  it('should return invalid for empty string', () => {
    expect(validateRequired('').isValid).toBe(false);
  });

  it('should return invalid for null', () => {
    expect(validateRequired(null).isValid).toBe(false);
  });

  it('should return invalid for whitespace', () => {
    expect(validateRequired('   ').isValid).toBe(false);
  });

  it('should return valid for non-empty string', () => {
    expect(validateRequired('valor').isValid).toBe(true);
  });

  it('should return valid for number', () => {
    expect(validateRequired(42).isValid).toBe(true);
  });

  it('should use custom field label in error message', () => {
    const result = validateRequired('', 'La descripción');
    expect(result.error).toContain('La descripción');
  });
});

describe('validateFileSize', () => {
  it('should return invalid when no file', () => {
    expect(validateFileSize(null, 5 * 1024 * 1024).isValid).toBe(false);
  });

  it('should return invalid when file exceeds max size', () => {
    const file = { size: 6 * 1024 * 1024 };
    const result = validateFileSize(file, 5 * 1024 * 1024);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('5 MB');
  });

  it('should return valid when file is within size limit', () => {
    const file = { size: 2 * 1024 * 1024 };
    expect(validateFileSize(file, 5 * 1024 * 1024).isValid).toBe(true);
  });

  it('should return valid when file size equals max size', () => {
    const file = { size: 5 * 1024 * 1024 };
    expect(validateFileSize(file, 5 * 1024 * 1024).isValid).toBe(true);
  });
});

describe('validateFileType', () => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];

  it('should return invalid when no file', () => {
    expect(validateFileType(null, allowed).isValid).toBe(false);
  });

  it('should return invalid for disallowed type', () => {
    const file = { type: 'application/pdf' };
    const result = validateFileType(file, allowed);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('JPEG');
  });

  it('should return valid for allowed type', () => {
    const file = { type: 'image/jpeg' };
    expect(validateFileType(file, allowed).isValid).toBe(true);
  });
});

describe('validatePasswordMatch', () => {
  it('should return invalid when confirmPassword is empty', () => {
    expect(validatePasswordMatch('Pass1!', '').isValid).toBe(false);
  });

  it('should return invalid when passwords do not match', () => {
    const result = validatePasswordMatch('Pass1!', 'Other1!');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('no coinciden');
  });

  it('should return valid when passwords match', () => {
    expect(validatePasswordMatch('Pass1!', 'Pass1!').isValid).toBe(true);
  });
});

describe('validateColombianPhone', () => {
  it('should return invalid for empty phone', () => {
    expect(validateColombianPhone('').isValid).toBe(false);
  });

  it('should return valid for mobile 10 digits starting with 3', () => {
    expect(validateColombianPhone('3101234567').isValid).toBe(true);
  });

  it('should return valid for mobile with country code +57', () => {
    expect(validateColombianPhone('+573101234567').isValid).toBe(true);
  });

  it('should return valid with spaces as separators', () => {
    expect(validateColombianPhone('310 123 4567').isValid).toBe(true);
  });

  it('should return invalid for random digits', () => {
    expect(validateColombianPhone('12345').isValid).toBe(false);
  });

  it('should return valid for landline 7 digits', () => {
    expect(validateColombianPhone('6123456').isValid).toBe(true);
  });
});

describe('validateContact', () => {
  it('should return invalid for empty contact', () => {
    expect(validateContact('').isValid).toBe(false);
  });

  it('should return valid for valid email', () => {
    expect(validateContact('user@example.com').isValid).toBe(true);
  });

  it('should return valid for colombian mobile phone', () => {
    expect(validateContact('3101234567').isValid).toBe(true);
  });

  it('should return invalid for arbitrary string', () => {
    expect(validateContact('not a contact').isValid).toBe(false);
  });

  it('should return invalid when contact exceeds 100 characters', () => {
    expect(validateContact('a'.repeat(101)).isValid).toBe(false);
  });
});

describe('validatePersonName', () => {
  it('should return invalid for empty name', () => {
    expect(validatePersonName('').isValid).toBe(false);
  });

  it('should return invalid for single character', () => {
    expect(validatePersonName('A').isValid).toBe(false);
  });

  it('should return invalid for name with numbers', () => {
    expect(validatePersonName('Juan2').isValid).toBe(false);
  });

  it('should return valid for simple name', () => {
    expect(validatePersonName('Juan').isValid).toBe(true);
  });

  it('should return valid for name with accents', () => {
    expect(validatePersonName('María José').isValid).toBe(true);
  });

  it('should return invalid when longer than 50 characters', () => {
    expect(validatePersonName('A'.repeat(51)).isValid).toBe(false);
  });
});

describe('validateColor', () => {
  it('should return invalid for empty color', () => {
    expect(validateColor('').isValid).toBe(false);
  });

  it('should return invalid for single character', () => {
    expect(validateColor('a').isValid).toBe(false);
  });

  it('should return valid for simple color', () => {
    expect(validateColor('negro').isValid).toBe(true);
  });

  it('should return valid for compound color', () => {
    expect(validateColor('blanco y café').isValid).toBe(true);
  });

  it('should return invalid for color with numbers', () => {
    expect(validateColor('negro1').isValid).toBe(false);
  });

  it('should return invalid when longer than 50 characters', () => {
    expect(validateColor('negro '.repeat(10)).isValid).toBe(false);
  });
});

describe('validateBreed', () => {
  it('should return invalid for empty breed', () => {
    expect(validateBreed('').isValid).toBe(false);
  });

  it('should return invalid for single character', () => {
    expect(validateBreed('A').isValid).toBe(false);
  });

  it('should return valid for standard breed', () => {
    expect(validateBreed('Golden Retriever').isValid).toBe(true);
  });

  it('should return valid for mestizo with hyphen', () => {
    expect(validateBreed('mestizo').isValid).toBe(true);
  });

  it('should return invalid when longer than 60 characters', () => {
    expect(validateBreed('a'.repeat(61)).isValid).toBe(false);
  });
});

describe('validateDescription', () => {
  it('should return invalid for empty description', () => {
    expect(validateDescription('').isValid).toBe(false);
  });

  it('should return invalid when shorter than 10 characters', () => {
    const result = validateDescription('Corto');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('10');
  });

  it('should return valid for description with 10+ characters', () => {
    expect(validateDescription('Perro perdido en el parque').isValid).toBe(true);
  });

  it('should return invalid when longer than 500 characters', () => {
    expect(validateDescription('a'.repeat(501)).isValid).toBe(false);
  });

  it('should return valid for description at exactly 500 characters', () => {
    expect(validateDescription('a'.repeat(500)).isValid).toBe(true);
  });
});
