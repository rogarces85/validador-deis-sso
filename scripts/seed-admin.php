<?php
/**
 * Siembra el primer usuario admin (o actualiza su contrasena si ya existe).
 *
 * Solicita email, nombre y contrasena (con confirmacion) por CLI.
 * Hash bcrypt con cost 12.
 *
 * Uso:
 *   php scripts/seed-admin.php
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/api/bootstrap.php';

function prompt(string $label, bool $hidden = false): string
{
    if (function_exists('readline_add_history')) {
        if (!$hidden) {
            echo $label;
            return trim((string) fgets(STDIN));
        }
    }
    echo $label;
    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN' && function_exists('shell_exec')) {
        $cmd = 'read -s -r -p "" v && echo "$v"';
        $val = trim((string) shell_exec($cmd));
        echo "\n";
        return $val;
    }
    echo '(entrada oculta no soportada en este entorno, escriba a ciegas) ';
    return trim((string) fgets(STDIN));
}

function prompt_win_hidden(string $label): string
{
    echo $label;
    $val = '';
    while (true) {
        $ch = stream_get_contents(STDIN, 1);
        if ($ch === false || $ch === "\n" || $ch === "\r" || ord($ch) === 4) {
            break;
        }
        if (ord($ch) === 8 || ord($ch) === 127) {
            $val = mb_substr($val, 0, mb_strlen($val) - 1);
            echo "\b \b";
        } else {
            $val .= $ch;
            echo '*';
        }
    }
    echo "\n";
    return $val;
}

function read_email(): string
{
    while (true) {
        $email = trim(prompt('Correo electronico del admin: '));
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return strtolower($email);
        }
        echo "  ! Correo invalido. Intente de nuevo.\n";
    }
}

function read_nombre(): string
{
    while (true) {
        $nombre = trim(prompt('Nombre visible del admin: '));
        $len = mb_strlen($nombre);
        if ($len >= 2 && $len <= 120) {
            return $nombre;
        }
        echo "  ! El nombre debe tener entre 2 y 120 caracteres.\n";
    }
}

function read_password(): string
{
    while (true) {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $a = prompt_win_hidden('Contrasena (min 8 caracteres): ');
            $b = prompt_win_hidden('Confirme la contrasena: ');
        } else {
            $a = prompt('Contrasena (min 8 caracteres): ', true);
            $b = prompt('Confirme la contrasena: ', true);
        }
        if ($a !== $b) {
            echo "  ! Las contrasenas no coinciden.\n\n";
            continue;
        }
        if (mb_strlen($a) < 8) {
            echo "  ! La contrasena debe tener al menos 8 caracteres.\n\n";
            continue;
        }
        return $a;
    }
}

echo "=== Siembra de usuario administrador ===\n\n";
$email = read_email();
$nombre = read_nombre();
$password = read_password();
echo "\n";

$existing = UsuarioAdmin::emailExists($email);
if ($existing) {
    echo "El correo '$email' ya existe. Se actualizara la contrasena.\n";
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $confirm = trim(prompt_win_hidden('Confirme con la contrasena actual para autorizar: '));
    } else {
        $confirm = prompt('Confirme con la contrasena actual para autorizar: ', true);
    }
    $admin = UsuarioAdmin::findByEmail($email);
    if (!$admin || !password_verify($confirm, (string) $admin['password_hash'])) {
        echo "Contrasena actual incorrecta. Abortando.\n";
        exit(1);
    }
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    UsuarioAdmin::updatePasswordHash((int) $admin['id'], $hash);
    echo "Contrasena actualizada para el admin #$admin[id] ($email).\n";
} else {
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $id = UsuarioAdmin::create($email, $hash, $nombre);
    echo "Admin #$id creado: $email ($nombre).\n";
}

echo "Listo. Ya puede iniciar sesion en /admin/login.\n";
