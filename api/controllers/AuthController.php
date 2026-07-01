<?php
declare(strict_types=1);

final class AuthController
{
    public static function login(): void
    {
        $ip = client_ip();
        $bucket = 'login';
        $rl = RateLimiter::hit($bucket, $ip, RateLimiter::MAX_ATTEMPTS, RateLimiter::WINDOW_SECONDS);
        if (!$rl['allowed']) {
            header('Retry-After: ' . (string) $rl['reset_in']);
            Response::fail(429, 'Demasiados intentos, reintente en ' . (string) $rl['reset_in'] . ' segundos');
            return;
        }

        $body = Csrf::readJsonBody();
        if (!is_array($body)) {
            $body = $_POST;
        }
        try {
            $email = Validator::require_email($body, 'email');
            $password = Validator::require_password($body, 'password', 8);
        } catch (InvalidArgumentException $e) {
            Response::fail(400, $e->getMessage());
            return;
        }

        $admin = UsuarioAdmin::findByEmail($email);
        if (!$admin || (int) $admin['activo'] !== 1 || !password_verify($password, (string) $admin['password_hash'])) {
            // Mensaje generico para no filtrar si el email existe
            Response::fail(401, 'Credenciales invalidas');
            return;
        }

        // Login OK: regenerar id de sesion para evitar fixation.
        // session_regenerate_id(true) elimina el archivo de sesion viejo y
        // emite automaticamente el Set-Cookie con el nuevo session_id.
        // No enviamos un Set-Cookie 'deleted' porque confunde a clientes
        // HTTP que colapsan cookies del mismo nombre: el navegador/curl
        // termina descartando la cookie activa.
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int) $admin['id'];
        $_SESSION['admin_email'] = (string) $admin['email'];
        $_SESSION['login_at'] = time();
        $_SESSION['csrf_token'] = Csrf::token();
        $_SESSION['csrf_issued_at'] = time();
        RateLimiter::reset($bucket, $ip);
        UsuarioAdmin::updateLastAccess((int) $admin['id']);

        Response::ok([
            'user' => self::sanitize($admin),
            'csrf_token' => (string) $_SESSION['csrf_token'],
        ]);
    }

    public static function logout(): void
    {
        AuthMiddleware::requireCsrf();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                [
                    'expires' => time() - 42000,
                    'path' => $params['path'],
                    'domain' => $params['domain'],
                    'secure' => $params['secure'],
                    'httponly' => $params['httponly'],
                    'samesite' => $params['samesite'] ?? 'Strict',
                ]
            );
        }
        session_destroy();
        Response::ok();
    }

    public static function me(): void
    {
        $admin = AuthMiddleware::requireAuth();
        Response::ok([
            'user' => self::sanitize($admin),
            'csrf_token' => AuthMiddleware::currentCsrfToken(),
        ]);
    }

    public static function csrf(): void
    {
        start_session();
        Response::ok([
            'csrf_token' => (string) ($_SESSION['csrf_token'] ?? Csrf::token()),
        ]);
    }

    private static function sanitize(array $admin): array
    {
        return [
            'id' => (int) $admin['id'],
            'email' => (string) $admin['email'],
            'nombre' => (string) $admin['nombre'],
            'activo' => (int) $admin['activo'] === 1,
            'ultimo_acceso' => $admin['ultimo_acceso'] ?? null,
        ];
    }
}
