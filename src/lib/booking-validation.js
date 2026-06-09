const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_WORD_PATTERN = /^\p{L}[\p{L}'’-]*\p{L}$/u;
const PHONE_ALLOWED_PATTERN = /^\+?[0-9()\-\s]+$/;

export function normalizeWhitespace(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function validateCustomerName(value) {
  const name = normalizeWhitespace(value);
  const words = name.split(" ").filter(Boolean);

  if (!name) return "Please enter your full name.";
  if (name.length < 4 || name.length > 80) return "Enter a full name between 4 and 80 characters.";
  if (words.length < 2 || words.length > 5) return "Enter your first and last name only.";
  if (words.some((word) => word.length < 2 || word.length > 24 || !NAME_WORD_PATTERN.test(word))) {
    return "Use letters, apostrophes, or hyphens only for your full name.";
  }
  if (/(.)\1{3,}/iu.test(name) || words.some((word) => word.length >= 8 && !/[aeiouy]/iu.test(word))) {
    return "Enter your real full name so we can confirm the booking.";
  }

  return undefined;
}

export function validateEmail(value) {
  const email = normalizeWhitespace(value).toLowerCase();

  if (!email) return "Please enter your email address.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email) || email.includes("..")) return "Enter a valid email address.";

  const [localPart, domain] = email.split("@");
  const labels = domain?.split(".") || [];
  const validDomain = labels.length >= 2 && labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
  const topLevelDomain = labels.at(-1) || "";

  if (!localPart || localPart.length > 64 || !validDomain || !/^[a-z]{2,}$/i.test(topLevelDomain)) {
    return "Enter a valid email address.";
  }

  return undefined;
}

function containsLongSequence(digits) {
  for (let index = 0; index <= digits.length - 7; index += 1) {
    const window = digits.slice(index, index + 7);
    let ascending = true;
    let descending = true;

    for (let offset = 1; offset < window.length; offset += 1) {
      const previous = Number(window[offset - 1]);
      const current = Number(window[offset]);
      ascending &&= current === (previous + 1) % 10;
      descending &&= current === (previous + 9) % 10;
    }

    if (ascending || descending) return true;
  }

  return false;
}

export function validatePhone(value) {
  const phone = normalizeWhitespace(value);
  const digits = phone.replace(/\D/g, "");

  if (!phone) return "Please enter your phone or WhatsApp number.";
  if (!PHONE_ALLOWED_PATTERN.test(phone) || digits.length < 8 || digits.length > 15) {
    return "Enter a valid phone or WhatsApp number with 8 to 15 digits.";
  }
  if (new Set(digits).size < 4 || containsLongSequence(digits)) {
    return "Enter a real phone or WhatsApp number so we can confirm the booking.";
  }

  return undefined;
}

/**
 * @param {{ customerName?: unknown, customerEmail?: unknown, customerPhone?: unknown }} contact
 */
export function cleanBookingContact({ customerName, customerEmail, customerPhone }) {
  return {
    customerName: normalizeWhitespace(customerName),
    customerEmail: normalizeWhitespace(customerEmail).toLowerCase(),
    customerPhone: normalizeWhitespace(customerPhone)
  };
}

/**
 * @param {{ customerName?: unknown, customerEmail?: unknown, customerPhone?: unknown }} contact
 */
export function validateBookingContact(contact) {
  return {
    customerName: validateCustomerName(contact.customerName),
    customerEmail: validateEmail(contact.customerEmail),
    customerPhone: validatePhone(contact.customerPhone)
  };
}
