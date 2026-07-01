<?php
declare(strict_types=1);

final class Validator
{
    public static function require_string(array $data, string $field, int $min = 1, int $max = 255): string
    {
        $val = $data[$field] ?? null;
        if (!is_string($val)) {
            throw new InvalidArgumentException("El campo '$field' es obligatorio");
        }
        $val = trim($val);
        $len = mb_strlen($val);
        if ($len < $min) {
            throw new InvalidArgumentException("El campo '$field' debe tener al menos $min caracteres");
        }
        if ($len > $max) {
            throw new InvalidArgumentException("El campo '$field' debe tener como maximo $max caracteres");
        }
        return $val;
    }

    public static function require_email(array $data, string $field = 'email'): string
    {
        $email = self::require_string($data, $field, 5, 120);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('El correo electronico no tiene un formato valido');
        }
        return strtolower($email);
    }

    public static function require_password(array $data, string $field = 'password', int $minLength = 8): string
    {
        $val = $data[$field] ?? null;
        if (!is_string($val)) {
            throw new InvalidArgumentException('La contrasena es obligatoria');
        }
        if (mb_strlen($val) < $minLength) {
            throw new InvalidArgumentException("La contrasena debe tener al menos $minLength caracteres");
        }
        return $val;
    }
}
