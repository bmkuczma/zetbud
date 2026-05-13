<?php
declare(strict_types=1);

/**
 * Formularz kontaktowy Zet-Bud — wysyłka przez SMTP (seohost.pl), jak w projekcie AdwokatKuczma:
 * host z panelu (np. h67.seohost.pl), port 465 (SSL) lub 587 (STARTTLS), login = pełny adres skrzynki.
 *
 * Skonfiguruj config.local.php (wzorzec: config.local.php.example).
 */

use PHPMailer\PHPMailer\PHPMailer;

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function zetbud_redirect(string $query): void
{
    header('Location: index.html?' . $query . '#kontakt', true, 303);
    exit;
}

/** @return 'pl'|'en' */
function zetbud_form_lang(): string
{
    $f = $_POST['form_lang'] ?? '';
    return $f === 'en' ? 'en' : 'pl';
}

/** @return array<string, string> topic code => Polish label (e-mail) */
function zetbud_topic_labels(): array
{
    return [
        't1' => 'Budowa domu jedno- lub wielorodzinnego — od podstaw',
        't2' => 'Instalacje elektryczne',
        't3' => 'Prace ziemne i przygotowanie placu',
        't4' => 'Remonty i wykończenia wnętrz (wysoki standard)',
        't5' => 'Zagospodarowanie działki / otoczenie budynku',
        't6' => 'Inne — doprecyzuję w wiadomości',
    ];
}

require_once __DIR__ . '/lib/zetbud-contact-validators.php';

function zetbud_load_phpmailer(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $base = __DIR__ . '/lib/PHPMailer/src';
    if (!is_readable($base . '/PHPMailer.php')) {
        throw new RuntimeException('Brak biblioteki PHPMailer w katalogu lib/PHPMailer.');
    }
    require_once $base . '/Exception.php';
    require_once $base . '/PHPMailer.php';
    require_once $base . '/SMTP.php';
    $loaded = true;
}

/**
 * @return array{0: string, 1: string} [plain, html]
 */
function zetbud_build_bodies(
    string $safeName,
    string $phone,
    string $email,
    string $topicLine,
    string $message,
    string $ip,
    string $formLang,
): array {
    $plain = "Nowe zapytanie — formularz zet-bud.pl\r\n\r\n";
    $plain .= 'Język formularza / Form language: ' . $formLang . "\r\n\r\n";
    $plain .= "Imię / firma: {$safeName}\r\n";
    $plain .= "Telefon: {$phone}\r\n";
    $plain .= "E-mail: {$email}\r\n";
    $plain .= "Typ: {$topicLine}\r\n\r\n";
    $plain .= "Wiadomość:\r\n{$message}\r\n\r\n";
    $plain .= "IP: {$ip}\r\n";
    $plain .= 'Data: ' . gmdate('Y-m-d H:i:s') . " UTC\r\n";

    $esc = static function (string $s): string {
        return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };
    $nl = static function (string $s) use ($esc): string {
        return nl2br($esc($s), false);
    };

    $html = '<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;background:#eef3fb;font-family:Segoe UI,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#0f172a;">';
    $html .= '<div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #c9d4e8;border-radius:12px;padding:28px;">';
    $html .= '<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#1e40af;font-weight:600;">Zet-Bud</p>';
    $html .= '<h1 style="margin:0 0 20px;font-size:20px;color:#0f172a;">Nowe zapytanie o wycenę</h1>';
    $html .= '<table style="width:100%;border-collapse:collapse;font-size:14px;">';
    $html .= '<tr><td style="padding:6px 0;color:#475569;width:140px;">Imię / firma</td><td style="padding:6px 0;font-weight:600;">' . $esc($safeName) . '</td></tr>';
    $html .= '<tr><td style="padding:6px 0;color:#475569;">Telefon</td><td style="padding:6px 0;">' . $esc($phone) . '</td></tr>';
    $html .= '<tr><td style="padding:6px 0;color:#475569;">E-mail</td><td style="padding:6px 0;"><a href="mailto:' . $esc($email) . '">' . $esc($email) . '</a></td></tr>';
    $html .= '<tr><td style="padding:6px 0;color:#475569;">Typ inwestycji</td><td style="padding:6px 0;">' . $esc($topicLine) . '</td></tr>';
    $html .= '<tr><td style="padding:6px 0;color:#475569;">Język / language</td><td style="padding:6px 0;">' . $esc($formLang) . '</td></tr>';
    $html .= '</table>';
    $html .= '<p style="margin:20px 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#475569;">Treść</p>';
    $html .= '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">' . $nl($message) . '</div>';
    $html .= '<p style="margin:20px 0 0;font-size:13px;color:#64748b;">Odpowiedz bezpośrednio na ten e-mail — ustawione jest pole Reply-To na adres nadawcy z formularza.</p>';
    $html .= '<p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">IP: ' . $esc($ip) . ' · ' . $esc(gmdate('Y-m-d H:i:s') . ' UTC') . '</p>';
    $html .= '</div></body></html>';

    return [$plain, $html];
}

/**
 * @throws \PHPMailer\PHPMailer\Exception
 */
function zetbud_send_via_smtp(
    string $mailTo,
    string $safeName,
    string $phone,
    string $email,
    string $topicLine,
    string $plainBody,
    string $htmlBody,
): void {
    zetbud_load_phpmailer();

    $host = (string) constant('SMTP_HOST');
    $user = (string) constant('SMTP_USER');
    $pass = (string) constant('SMTP_PASSWORD');
    $port = defined('SMTP_PORT') ? (int) constant('SMTP_PORT') : 465;
    $fromAddr = (defined('SMTP_FROM') && is_string(constant('SMTP_FROM')) && constant('SMTP_FROM') !== '')
        ? constant('SMTP_FROM')
        : $user;
    $fromName = (defined('SMTP_FROM_NAME') && is_string(constant('SMTP_FROM_NAME')) && constant('SMTP_FROM_NAME') !== '')
        ? constant('SMTP_FROM_NAME')
        : 'Zet-Bud';
    $helo = (defined('ZETBUD_SMTP_HELO') && is_string(constant('ZETBUD_SMTP_HELO')) && constant('ZETBUD_SMTP_HELO') !== '')
        ? constant('ZETBUD_SMTP_HELO')
        : 'zet-bud.pl';

    if ($host === '' || $user === '' || $pass === '' || $fromAddr === '') {
        throw new RuntimeException('Niepełna konfiguracja SMTP (SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM).');
    }

    if (!extension_loaded('openssl')) {
        throw new RuntimeException('Brak rozszerzenia openssl w PHP — wymagane do SMTP z TLS/SSL.');
    }

    /**
     * Po zmianie portu musi zgadzać się szyfrowanie: 465 = zwykle SMTPS (implicit SSL),
     * 587 = STARTTLS (najpierw jawne połączenie, potem TLS). Opcjonalnie: define('SMTP_ENCRYPTION', 'ssl'|'tls'|'none').
     */
    $enc = 'auto';
    if (defined('SMTP_ENCRYPTION') && is_string(constant('SMTP_ENCRYPTION')) && constant('SMTP_ENCRYPTION') !== '') {
        $enc = strtolower(trim((string) constant('SMTP_ENCRYPTION')));
    }
    if ($enc === 'auto') {
        $enc = ($port === 465 || $port === 8465) ? 'ssl' : 'tls';
    }

    $mail = new PHPMailer(true);
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Timeout = 30;
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->Port = $port;
    if (defined('ZETBUD_SMTP_DEBUG') && constant('ZETBUD_SMTP_DEBUG')) {
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = static function ($str, $level): void {
            error_log('[zet-bud smtp-debug] ' . trim((string) $str));
        };
    }
    if (defined('ZETBUD_SMTP_INSECURE') && ZETBUD_SMTP_INSECURE) {
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ];
    }
    if ($enc === 'ssl' || $enc === 'smtps') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->SMTPAutoTLS = false;
    } elseif ($enc === 'none' || $enc === 'off' || $enc === 'plain') {
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->SMTPAutoTLS = true;
    }
    $mail->Hostname = $helo;
    $mail->Helo = $helo;

    $subject = '[Zet-Bud] Zapytanie o wycenę — ' . $topicLine;
    $mail->setFrom($fromAddr, $fromName);
    $mail->addAddress($mailTo);
    $mail->addReplyTo($email, $safeName);
    $mail->Subject = $subject;
    $mail->isHTML(true);
    $mail->Body = $htmlBody;
    $mail->AltBody = $plainBody;
    $mail->XMailer = 'Zet-Bud zet-bud.pl';

    $mail->send();
}

/**
 * Wyciąga adres e-mail z nagłówka From (np. "Zet-Bud <kontakt@domena.pl>").
 */
function zetbud_extract_email_from_from_header(string $header): ?string
{
    $header = trim($header);
    if ($header === '') {
        return null;
    }
    if (preg_match('/<([^>]+)>/', $header, $m)) {
        $addr = trim($m[1]);

        return filter_var($addr, FILTER_VALIDATE_EMAIL) ? $addr : null;
    }

    return filter_var($header, FILTER_VALIDATE_EMAIL) ? $header : null;
}

/**
 * Opcjonalny parametr dodatkowy dla mail() — -f envelope (wymagany na części hostingów).
 */
function zetbud_mail_envelope_param(string $fromHeader): string
{
    $addr = zetbud_extract_email_from_from_header($fromHeader);
    if ($addr === null) {
        return '';
    }

    return '-f' . $addr;
}

function zetbud_send_via_mail(
    string $mailTo,
    string $email,
    string $subjectEncoded,
    string $plainBody,
    string $fromHeader,
): bool {
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . $fromHeader,
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . PHP_VERSION,
    ];
    $headerStr = implode("\r\n", $headers);
    $extra = zetbud_mail_envelope_param($fromHeader);
    $ok = @mail($mailTo, $subjectEncoded, $plainBody, $headerStr, $extra);
    if (!$ok && $extra !== '') {
        $ok = @mail($mailTo, $subjectEncoded, $plainBody, $headerStr, '');
    }
    if (!$ok) {
        $last = error_get_last();
        if ($last !== null) {
            error_log('[zet-bud contact] mail(): ' . $last['message']);
        }
    }

    return $ok;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    zetbud_redirect('wycena=0&why=method');
}

$formLang = zetbud_form_lang();

/* Pole pułapka — unikaj nazw typu „website”, żeby menedżery haseł go nie uzupełniały. */
if (!empty($_POST['zetbud_hp'])) {
    http_response_code(200);
    exit;
}

$mailTo = 'biuro@zet-bud.pl';
if (is_readable(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
}
if (defined('ZETBUD_MAIL_TO') && is_string(ZETBUD_MAIL_TO) && ZETBUD_MAIL_TO !== '') {
    $mailTo = ZETBUD_MAIL_TO;
}

$now = time();
if (!empty($_SESSION['zet_bud_last_send']) && ($now - (int) $_SESSION['zet_bud_last_send']) < 50) {
    zetbud_redirect('wycena=rate&lang=' . $formLang);
}

$name = trim((string) ($_POST['name'] ?? ''));
$phoneLegacy = trim((string) ($_POST['phone'] ?? ''));
$phone = zetbud_phone_from_post();
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$len = static function (string $s): int {
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
};

if ($len($name) < 2 || $len($name) > 220) {
    zetbud_redirect('wycena=0&lang=' . $formLang . '&why=bad_name');
}
$phoneDigits = zetbud_phone_digits_only($phone);
$legacyDigits = zetbud_phone_digits_only($phoneLegacy);
if (strlen($phoneDigits) < 6 && strlen($legacyDigits) >= 6) {
    $phone = $phoneLegacy;
    $phoneDigits = $legacyDigits;
}
if (strlen($phoneDigits) < 6 || $len($phone) > 45 || strlen($phoneDigits) > 18) {
    zetbud_redirect('wycena=0&lang=' . $formLang . '&why=bad_phone');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    zetbud_redirect('wycena=0&lang=' . $formLang . '&why=bad_email');
}

$topicLabels = zetbud_topic_labels();
$topicCode = trim((string) ($_POST['topic'] ?? ''));
if ($topicCode === '' || !isset($topicLabels[$topicCode])) {
    zetbud_redirect('wycena=0&lang=' . $formLang . '&why=bad_topic');
}
if ($len($message) < 10 || $len($message) > 8000) {
    zetbud_redirect('wycena=0&lang=' . $formLang . '&why=bad_msg');
}

$safeName = preg_replace('/[^\p{L}\p{N}\s\-\.\'\"]/u', '', $name) ?? $name;
$topicLine = $topicLabels[$topicCode];
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

[$plainBody, $htmlBody] = zetbud_build_bodies($safeName, $phone, $email, $topicLine, $message, $ip, $formLang);

$sent = false;
$smtpConfigured = defined('SMTP_HOST') && defined('SMTP_USER') && defined('SMTP_PASSWORD')
    && is_string(constant('SMTP_HOST')) && constant('SMTP_HOST') !== ''
    && is_string(constant('SMTP_USER')) && constant('SMTP_USER') !== ''
    && is_string(constant('SMTP_PASSWORD')) && constant('SMTP_PASSWORD') !== '';

if ($smtpConfigured) {
    try {
        zetbud_send_via_smtp($mailTo, $safeName, $phone, $email, $topicLine, $plainBody, $htmlBody);
        $sent = true;
    } catch (Throwable $e) {
        error_log(
            '[zet-bud contact] SMTP: ' . $e->getMessage() . ' [' . get_class($e) . ']'
            . ' | host=' . (defined('SMTP_HOST') ? (string) constant('SMTP_HOST') : '')
            . ' port=' . (defined('SMTP_PORT') ? (string) (int) constant('SMTP_PORT') : '465')
        );
        $sent = false;
    }
}

if (!$sent) {
    $subject = '=?UTF-8?B?' . base64_encode('[Zet-Bud] Zapytanie o wycenę') . '?=';
    $fromHeader = 'noreply@zet-bud.pl';
    if (defined('SMTP_FROM') && is_string(constant('SMTP_FROM')) && constant('SMTP_FROM') !== '') {
        $fromHeader = constant('SMTP_FROM');
    }
    if (defined('ZETBUD_MAIL_FROM') && is_string(constant('ZETBUD_MAIL_FROM')) && constant('ZETBUD_MAIL_FROM') !== '') {
        $fromHeader = constant('ZETBUD_MAIL_FROM');
    }
    $sent = zetbud_send_via_mail($mailTo, $email, $subject, $plainBody, $fromHeader);
}

if ($sent) {
    $_SESSION['zet_bud_last_send'] = $now;
    zetbud_redirect('wycena=1&lang=' . $formLang);
}

zetbud_redirect('wycena=0&lang=' . $formLang . '&why=mail');
