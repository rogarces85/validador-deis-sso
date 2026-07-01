<?php
declare(strict_types=1);

final class UsuarioAdmin
{
    public static function findByEmail(string $email): ?array
    {
        $stmt = db()->prepare(
            'SELECT id, email, password_hash, nombre, activo, ultimo_acceso, creado_en
             FROM usuarios_admin WHERE email = :e LIMIT 1'
        );
        $stmt->execute([':e' => strtolower($email)]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public static function findById(int $id): ?array
    {
        $stmt = db()->prepare(
            'SELECT id, email, password_hash, nombre, activo, ultimo_acceso, creado_en
             FROM usuarios_admin WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public static function create(string $email, string $passwordHash, string $nombre): int
    {
        $stmt = db()->prepare(
            'INSERT INTO usuarios_admin (email, password_hash, nombre, activo)
             VALUES (:e, :p, :n, 1)'
        );
        $stmt->execute([
            ':e' => strtolower($email),
            ':p' => $passwordHash,
            ':n' => $nombre,
        ]);
        return (int) db()->lastInsertId();
    }

    public static function updatePasswordHash(int $id, string $passwordHash): void
    {
        $stmt = db()->prepare(
            'UPDATE usuarios_admin SET password_hash = :p WHERE id = :id'
        );
        $stmt->execute([':p' => $passwordHash, ':id' => $id]);
    }

    public static function updateLastAccess(int $id): void
    {
        $stmt = db()->prepare(
            'UPDATE usuarios_admin SET ultimo_acceso = NOW() WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
    }

    public static function emailExists(string $email): bool
    {
        $stmt = db()->prepare('SELECT 1 FROM usuarios_admin WHERE email = :e LIMIT 1');
        $stmt->execute([':e' => strtolower($email)]);
        return $stmt->fetch() !== false;
    }
}
