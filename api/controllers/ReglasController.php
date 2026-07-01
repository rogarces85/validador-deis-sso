<?php
declare(strict_types=1);

final class ReglasController
{
    public static function list(): void
    {
        AuthMiddleware::requireAuth();
        $page = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['perPage'] ?? 20);
        $filtros = [
            'serie' => $_GET['serie'] ?? null,
            'rem_sheet' => $_GET['rem_sheet'] ?? null,
            'severidad' => $_GET['severidad'] ?? null,
            'q' => $_GET['q'] ?? null,
            'incluir_desactivadas' => !empty($_GET['incluir_desactivadas']),
        ];
        $result = Regla::list($filtros, $page, $perPage);
        Response::ok([
            'items' => $result['items'],
            'total' => $result['total'],
            'page' => $page,
            'perPage' => $perPage,
            'totalPages' => (int) ceil($result['total'] / $perPage),
        ]);
    }

    public static function get(array $params): void
    {
        AuthMiddleware::requireAuth();
        $reglaId = $params['regla_id'] ?? '';
        $regla = Regla::findByReglaId($reglaId);
        if (!$regla) {
            Response::fail(404, 'Regla no encontrada');
            return;
        }
        Response::ok(['regla' => $regla]);
    }

    public static function create(): void
    {
        $admin = AuthMiddleware::requireAuth();
        AuthMiddleware::requireCsrf();
        $body = Csrf::readJsonBody();
        if (!is_array($body)) {
            Response::fail(400, 'Cuerpo JSON requerido');
            return;
        }
        try {
            $payload = RuleValidator::validateCreate($body);
        } catch (InvalidArgumentException $e) {
            Response::fail(400, $e->getMessage());
            return;
        }
        if (Regla::reglaIdExists($payload['regla_id'])) {
            Response::fail(409, 'Ya existe una regla con ese regla_id');
            return;
        }
        $id = Regla::create($payload, (int) $admin['id']);
        ReglasAudit::record((int) $admin['id'], 'CREATE', $payload['regla_id'], $id, [
            'antes' => null,
            'despues' => $payload,
        ]);
        $regla = Regla::findByReglaId($payload['regla_id']);
        Response::created(['regla' => $regla]);
    }

    public static function update(array $params): void
    {
        $admin = AuthMiddleware::requireAuth();
        AuthMiddleware::requireCsrf();
        $reglaId = $params['regla_id'] ?? '';
        $body = Csrf::readJsonBody();
        if (!is_array($body)) {
            Response::fail(400, 'Cuerpo JSON requerido');
            return;
        }
        $current = Regla::findByReglaId($reglaId);
        if (!$current) {
            Response::fail(404, 'Regla no encontrada');
            return;
        }
        try {
            $payload = RuleValidator::validateUpdate($body);
        } catch (InvalidArgumentException $e) {
            Response::fail(400, $e->getMessage());
            return;
        }
        $updated = Regla::update($reglaId, $payload, (int) $admin['id']);
        ReglasAudit::record((int) $admin['id'], 'UPDATE', $reglaId, (int) $current['id'], [
            'antes' => $current,
            'despues' => $updated,
        ]);
        Response::ok(['regla' => $updated]);
    }

    public static function deactivate(array $params): void
    {
        $admin = AuthMiddleware::requireAuth();
        AuthMiddleware::requireCsrf();
        $reglaId = $params['regla_id'] ?? '';
        $current = Regla::findByReglaId($reglaId);
        if (!$current) {
            Response::fail(404, 'Regla no encontrada');
            return;
        }
        $updated = Regla::deactivate($reglaId, (int) $admin['id']);
        ReglasAudit::record((int) $admin['id'], 'DEACTIVATE', $reglaId, (int) $current['id'], [
            'antes' => $current,
            'despues' => $updated,
        ]);
        Response::ok(['regla' => $updated]);
    }

    public static function activate(array $params): void
    {
        $admin = AuthMiddleware::requireAuth();
        AuthMiddleware::requireCsrf();
        $reglaId = $params['regla_id'] ?? '';
        $current = Regla::findByReglaId($reglaId);
        if (!$current) {
            Response::fail(404, 'Regla no encontrada');
            return;
        }
        $updated = Regla::activate($reglaId, (int) $admin['id']);
        ReglasAudit::record((int) $admin['id'], 'ACTIVATE', $reglaId, (int) $current['id'], [
            'antes' => $current,
            'despues' => $updated,
        ]);
        Response::ok(['regla' => $updated]);
    }
}
