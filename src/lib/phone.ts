const SA_E164_BODY = /^27\d{9}$/;

export function normalizeSouthAfricanPhone(phone: string): string | null {
  if (!phone) {
    return null;
  }

  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 10) {
    digits = `27${digits.slice(1)}`;
  }

  if (!SA_E164_BODY.test(digits)) {
    return null;
  }

  return `+${digits}`;
}

export function maskPhone(phone: string): string {
  const normalized = normalizeSouthAfricanPhone(phone);

  if (!normalized) {
    return "Invalid number";
  }

  const visible = normalized.slice(-2);
  return `${normalized.slice(0, 3)} ******${visible}`;
}
