<?php
declare(strict_types=1);

/**
 * Middlewares de autenticacion y proteccion CSRF.
 */
final class AuthMiddleware
{
    public static function requireAuth(): array
    {
        if (empty($_SESSION['admin_id'])) {
            Response::fail(401, 'No autenticado');
            exit;
        }
        $admin = UsuarioAdmin::findById((int) $_SESSION['admin_id']);
        if (!$admin || (int) $admin['activo'] !== 1) {
            $_SESSION = [];
            session_destroy();
            Response::fail(401, 'Sesion invalida');
            exit;
        }
        return $admin;
    }

    public static function requireCsrf(): void
    {
        $token = Csrf::readFromRequest();
        if ($token === null) {
            Response::fail(403, 'Token CSRF ausente');
            exit;
        }
        if (!Csrf::verify($token)) {
            Response::fail(403, 'Token CSRF invalido');
            exit;
        }
    }

    public static function currentCsrfToken(): string
    {
        start_session();
        return (string) ($_SESSION['csrf_token'] ?? '');
    }
}
