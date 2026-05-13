'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { zetbudNationalMaxFromOption, zetbudSyncNationalDigits } = require('./phone-sync-impl.cjs');

test('PL max z opcji select', () => {
  assert.equal(zetbudNationalMaxFromOption('9'), 9);
});

test('PL — 9 cyfr', () => {
  assert.equal(zetbudSyncNationalDigits('601234567', '+48', 9), '601234567');
});

test('PL — wklejka 48601234567', () => {
  assert.equal(zetbudSyncNationalDigits('48601234567', '+48', 9), '601234567');
});

test('PL — wiodące 0', () => {
  assert.equal(zetbudSyncNationalDigits('0601234567', '+48', 9), '601234567');
});

test('US +1 — usuń wiodącą 1', () => {
  assert.equal(zetbudSyncNationalDigits('12025551234', '+1', 10), '2025551234');
});
