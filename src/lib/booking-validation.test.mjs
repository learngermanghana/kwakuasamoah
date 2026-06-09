import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanBookingContact,
  validateBookingContact,
  validateCustomerName,
  validateEmail,
  validatePhone
} from "./booking-validation.js";

test("accepts realistic checkout contact details and normalizes them", () => {
  const contact = cleanBookingContact({
    customerName: "  Kwaku   Asamoah ",
    customerEmail: " KWAKU@example.com ",
    customerPhone: " +233 24 555 0198 "
  });

  assert.deepEqual(contact, {
    customerName: "Kwaku Asamoah",
    customerEmail: "kwaku@example.com",
    customerPhone: "+233 24 555 0198"
  });
  assert.deepEqual(validateBookingContact(contact), {
    customerName: undefined,
    customerEmail: undefined,
    customerPhone: undefined
  });
});

test("rejects low-quality names", () => {
  assert.match(validateCustomerName("Some check out with tis jhhfgxfhgjhg"), /first and last name/i);
  assert.match(validateCustomerName("Kwaku 123"), /letters/i);
  assert.match(validateCustomerName("jhhfgxfhgjhg Asamoah"), /real full name/i);
});

test("rejects malformed email addresses", () => {
  assert.match(validateEmail("fdhgfghjf@ghj"), /valid email/i);
  assert.match(validateEmail("kwaku@example..com"), /valid email/i);
  assert.equal(validateEmail("kwaku.asamoah@example.com"), undefined);
});

test("rejects implausible phone numbers", () => {
  assert.match(validatePhone("123456787654"), /real phone/i);
  assert.match(validatePhone("1111111111"), /real phone/i);
  assert.match(validatePhone("12345"), /8 to 15 digits/i);
  assert.equal(validatePhone("+233 24 555 0198"), undefined);
});
