<?php
declare(strict_types=1);

/**
 * Walidacja / normalizacja pól formularza kontaktowego (używane przez contact.php i testy PHP).
 */

function zetbud_phone_digits_only(string $s): string
{
    return preg_replace('/\D+/u', '', $s) ?? '';
}

/** Maks. długość numeru krajowego (bez kodu) — zgodnie z opcjami w index.html */
function zetbud_phone_national_max(string $ccDigits): int
{
    static $map = [
        '1' => 10,
        '44' => 10,
        '48' => 9,
        '49' => 11,
        '380' => 9,
        '420' => 9,
        '421' => 9,
        '370' => 8,
        '46' => 9,
        '47' => 8,
        '45' => 8,
        '31' => 9,
        '353' => 9,
        '33' => 9,
        '39' => 10,
        '43' => 11,
        '34' => 9,
    ];

    return $map[$ccDigits] ?? 15;
}

/**
 * Składa telefon z pól formularza (phone_country + phone_national).
 */
function zetbud_phone_from_post(): string
{
    $ccRaw = trim((string) ($_POST['phone_country'] ?? '+48'));
    $nat = zetbud_phone_digits_only((string) ($_POST['phone_national'] ?? ''));
    $ccDigits = zetbud_phone_digits_only($ccRaw);
    $metaMax = zetbud_phone_national_max($ccDigits);

    if ($ccRaw === '+1' && strlen($nat) === 11 && str_starts_with($nat, '1')) {
        $nat = substr($nat, 1);
    }
    while ($ccDigits !== '' && str_starts_with($nat, $ccDigits) && strlen($nat) > $metaMax) {
        $nat = substr($nat, strlen($ccDigits));
    }
    if ($nat !== '' && $nat[0] === '0' && strlen($nat) === $metaMax + 1) {
        $nat = substr($nat, 1);
    }
    $nat = substr($nat, 0, $metaMax);
    if ($ccRaw === '') {
        $ccRaw = $ccDigits !== '' ? '+' . $ccDigits : '';
    }

    return trim($ccRaw . ' ' . $nat);
}
