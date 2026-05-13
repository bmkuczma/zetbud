<?php
/**
 * Uruchom z katalogu głównego repozytorium: php tests/php/phone_validator_test.php
 */
declare(strict_types=1);

$_SERVER = $_SERVER ?? [];
$_POST = [];

require_once dirname(__DIR__, 2) . '/lib/zetbud-contact-validators.php';

function zetbud_test_fail(string $msg): void
{
    fwrite(STDERR, "FAIL: {$msg}\n");
    exit(1);
}

function zetbud_test_assert(string $expected, string $actual, string $label): void
{
    if ($expected !== $actual) {
        zetbud_test_fail("{$label}\n  oczekiwano: {$expected}\n  jest:      {$actual}");
    }
}

$_POST = ['phone_country' => '+48', 'phone_national' => '601234567'];
zetbud_test_assert('+48 601234567', zetbud_phone_from_post(), 'PL 9 cyfr krajowych');

$_POST = ['phone_country' => '+48', 'phone_national' => '48601234567'];
zetbud_test_assert('+48 601234567', zetbud_phone_from_post(), 'PL wklejka z prefiksem 48');

$_POST = ['phone_country' => '+48', 'phone_national' => '0601234567'];
zetbud_test_assert('+48 601234567', zetbud_phone_from_post(), 'PL z wiodącym 0');

$_POST = ['phone_country' => '+49', 'phone_national' => '1512345678901'];
zetbud_test_assert('+49 15123456789', zetbud_phone_from_post(), 'DE — obcięcie do 11 cyfr krajowych');

$_POST = ['phone_country' => '+1', 'phone_national' => '12025551234'];
zetbud_test_assert('+1 2025551234', zetbud_phone_from_post(), 'US +1 z wiodącą 1');

zetbud_test_assert('9', (string) zetbud_phone_national_max('48'), 'PL max map');
zetbud_test_assert('601234567', zetbud_phone_digits_only('60 123 45 67'), 'digits only');

fwrite(STDOUT, "OK — tests/php/phone_validator_test.php\n");
