<?php
declare(strict_types=1);

final class Csrf
{
    public static function token(): string
    {
        return bin2hex(random_bytes(32));
    }

    public static function verify(string $token): bool
    {
        if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
            return false;
        }
        if (!is_string($token) || $token === '') {
            return false;
        }
        return hash_equals((string) $_SESSION['csrf_token'], $token);
    }

    /**
     * Lee el token CSRF del header X-CSRF-Token o del body csrf_token.
     */
    public static function readFromRequest(): ?string
    {
        $header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (is_string($header) && $header !== '') {
            return $header;
        }
        $body = self::readJsonBody();
        if (is_array($body) && isset($body['csrf_token']) && is_string($body['csrf_token'])) {
            return $body['csrf_token'];
        }
        return null;
    }

    public static function readJsonBody(): ?array
    {
        $raw = file_get_contents('php://input');
        if (!is_string($raw) || $raw === '') {
            return null;
        }
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        return null;
    }
}
