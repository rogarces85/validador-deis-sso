<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Establecimiento No Válido - DEIS SSO</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
  :root {
    --azul-oscuro: #004B70;
    --fondo: #F8FAFC;
  }
  body {
    background: var(--fondo);
  }
  .error-icon {
    font-size: 4rem;
    color: #dc3545;
  }
</style>
</head>
<body class="d-flex align-items-start justify-content-center p-4">
  <div class="card shadow border-0" style="max-width:600px; width:100%;">
    <div class="card-header text-white d-flex align-items-center gap-2" style="background:#004B70;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
      </svg>
      Archivo No Corresponde al Servicio
    </div>
    <div class="card-body">
      <div class="text-center mb-4">
        <div class="error-icon">⚠️</div>
      </div>
      <p class="mb-2"><strong>Archivo:</strong> <code><?= htmlspecialchars($file) ?></code></p>
      <p class="mb-2"><strong>Código detectado:</strong> <span class="badge bg-danger"><?= htmlspecialchars($codigo) ?></span></p>
      
      <div class="alert alert-warning mt-3">
        <strong>El código no pertenece al listado de establecimientos del Servicio de Salud Osorno.</strong>
      </div>
      
      <p class="small text-muted mb-0">
        Por favor, verifique que el nombre del archivo comience con el código correcto del establecimiento (6 dígitos).
      </p>
    </div>
    <div class="card-footer bg-white d-flex justify-content-end gap-2">
      <a href="index.php" class="btn btn-sm btn-outline-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        </svg>
        Volver e intentar nuevamente
      </a>
    </div>
  </div>
</body>
</html>