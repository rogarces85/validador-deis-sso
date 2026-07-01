<?php
declare(strict_types=1);

/**
 * Rate limit por IP usando la tabla `rate_limit` (key, count, window_start).
 * Se aplica a /api/auth/login (5 intentos / 15 min).
 */
final class RateLimiter
{
    public const WINDOW_SECONDS = 900; // 15 minutos
    public const MAX_ATTEMPTS = 5;

    public static function hit(string $bucket, string $ip, int $max, int $windowSec): array
    {
        $now = time();
        $key = sprintf('%s:%s', $bucket, $ip);
        $pdo = db();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare('SELECT count, window_start FROM rate_limit WHERE kkey = :k FOR UPDATE');
            $stmt->execute([':k' => $key]);
            $row = $stmt->fetch();
            if (!$row) {
                $pdo->prepare('INSERT INTO rate_limit (kkey, count, window_start) VALUES (:k, 1, :w)')
                    ->execute([':k' => $key, ':w' => $now]);
                $pdo->commit();
                return ['allowed' => true, 'remaining' => $max - 1, 'reset_in' => $windowSec];
            }
            $windowStart = (int) $row['window_start'];
            $count = (int) $row['count'];
            if ($now - $windowStart >= $windowSec) {
                $pdo->prepare('UPDATE rate_limit SET count = 1, window_start = :w WHERE kkey = :k')
                    ->execute([':w' => $now, ':k' => $key]);
                $pdo->commit();
                return ['allowed' => true, 'remaining' => $max - 1, 'reset_in' => $windowSec];
            }
            if ($count >= $max) {
                $pdo->commit();
                return [
                    'allowed' => false,
                    'remaining' => 0,
                    'reset_in' => $windowSec - ($now - $windowStart),
                ];
            }
            $pdo->prepare('UPDATE rate_limit SET count = count + 1 WHERE kkey = :k')
                ->execute([':k' => $key]);
            $pdo->commit();
            return [
                'allowed' => true,
                'remaining' => $max - $count - 1,
                'reset_in' => $windowSec - ($now - $windowStart),
            ];
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function reset(string $bucket, string $ip): void
    {
        $key = sprintf('%s:%s', $bucket, $ip);
        $stmt = db()->prepare('DELETE FROM rate_limit WHERE kkey = :k');
        $stmt->execute([':k' => $key]);
    }
}
