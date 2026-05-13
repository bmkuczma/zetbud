'use strict';

/**
 * Odpowiednik logiki syncPhone() z assets/js/main.js (tylko ciąg cyfr krajowych).
 * Przy zmianach w main.js zaktualizuj ten plik i testy.
 */
function zetbudNationalMaxFromOption(dataNationalMax) {
  var max = parseInt(dataNationalMax || '15', 10);
  if (isNaN(max) || max < 6) max = 15;
  if (max > 15) max = 15;
  return max;
}

function zetbudSyncNationalDigits(nationalValue, countryValue, metaMax) {
  var raw = nationalValue.replace(/\D/g, '');
  var ccDigits = countryValue.replace(/\D/g, '');
  if (countryValue === '+1' && raw.length === 11 && raw.charAt(0) === '1') {
    raw = raw.slice(1);
  }
  while (ccDigits.length >= 1 && raw.indexOf(ccDigits) === 0 && raw.length > metaMax) {
    raw = raw.slice(ccDigits.length);
  }
  if (raw.charAt(0) === '0' && raw.length === metaMax + 1) {
    raw = raw.slice(1);
  }
  return raw.slice(0, metaMax);
}

module.exports = { zetbudNationalMaxFromOption, zetbudSyncNationalDigits };
