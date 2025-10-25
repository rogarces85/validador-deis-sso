<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Validador DEIS SSO 2025</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  
  <style>
    :root {
      --azul-principal: #007BFF;
      --azul-medio: #00AEEF;
      --azul-oscuro: #004B70;
      --fondo: #F8FAFC;
    }
    
    body {
      background: var(--fondo);
      min-height: 100vh;
    }
    
    .logo-container {
      text-align: center;
      margin-bottom: 2rem;
      animation: fadeIn 0.6s ease-in;
    }
    
    .logo-container img {
      max-width: 280px;
      width: 100%;
      height: auto;
      margin-bottom: 1rem;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .brand img {
      height: 72px;
      width: auto;
    }
    
    .brand h3 {
      margin: 0;
      color: var(--azul-oscuro);
      font-weight: 800;
      letter-spacing: 0.3px;
    }
    
    .upload-card {
      transition: all 0.3s ease;
    }
    
    .upload-card:hover {
      box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
    }
    
    .btn-primary {
      background: var(--azul-principal);
      border-color: var(--azul-principal);
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #0069d9;
      border-color: #0062cc;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    }
    
    .btn-primary:disabled {
      background: #6c757d;
      border-color: #6c757d;
      cursor: not-allowed;
    }
    
    .progress-bar {
      background: linear-gradient(90deg, var(--azul-medio), var(--azul-principal));
    }
    
    .file-upload-zone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .file-upload-zone:hover {
      border-color: var(--azul-principal);
      background: #f0f8ff;
    }
    
    .file-upload-zone.dragover {
      border-color: var(--azul-principal);
      background: #e3f2ff;
      transform: scale(1.02);
    }
    
    .upload-icon {
      font-size: 3rem;
      color: var(--azul-medio);
      margin-bottom: 1rem;
    }
    
    .info-card {
      background: #f8f9fa;
      border-left: 4px solid var(--azul-principal);
      padding: 1rem;
      margin-top: 1.5rem;
    }
    
    .format-badge {
      display: inline-block;
      background: var(--azul-principal);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      margin: 0 0.25rem;
    }
  </style>
</head>
<body>
<div class="container mt-4 mt-md-5" style="max-width: 800px;">
  <div class="text-center mb-4">
    <img src="assets/logo.png" alt="DEIS Osorno Logo" style="max-width: 300px; width: 100%; height: auto;">
  </div>
  
  <div class="text-center mb-4">
    <h3 class="mb-2" style="color: #004B70; font-weight: 800;">Validador DEIS SSO 2025</h3>
    <p class="text-muted mb-0">Sistema de Validación de Archivos REM</p>
  </div>
  
  <form id="uploadForm" action="upload.php" method="post" enctype="multipart/form-data" class="card upload-card p-4 shadow-sm border-0">
    <div class="file-upload-zone" id="dropZone">
      <div class="upload-icon">📁</div>
      <h5 class="mb-3">Arrastra tu archivo aquí o haz clic para seleccionar</h5>
      <input type="file" class="d-none" id="file" name="file" required accept=".xlsm,.xlsx">
      <button type="button" class="btn btn-outline-primary" id="btnSelectFile">
        Seleccionar Archivo
      </button>
      <p class="text-muted small mt-3 mb-0">
        Formatos aceptados: 
        <span class="format-badge">.xlsm</span>
        <span class="format-badge">.xlsx</span>
      </p>
      <p class="text-muted small mb-0">Tamaño máximo: 50MB</p>
    </div>
    
    <div id="fileInfo" class="alert alert-info mt-3" style="display:none;">
      <strong>Archivo seleccionado:</strong> <span id="fileName"></span><br>
      <small><strong>Tamaño:</strong> <span id="fileSize"></span></small>
    </div>
    
    <div id="progressWrap" class="progress mb-3 mt-3" style="height: 24px; display:none;">
      <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="width: 0%">
        <span id="progressText">0%</span>
      </div>
    </div>
    
    <button type="submit" id="btnSubmit" class="btn btn-primary btn-lg w-100 mt-3" disabled>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-upload me-2" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"/>
        <path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"/>
      </svg>
      Subir y Validar Archivo
    </button>
  </form>
  
  <div class="info-card">
    <h6 class="mb-2">ℹ️ Información del Sistema</h6>
    <ul class="small mb-0">
      <li>El nombre del archivo debe comenzar con el código del establecimiento (6 dígitos)</li>
      <li>Formato: <code>CODIGOSERIEME.xlsx</code> ejemplo: <code>123100A0101.xlsx</code></li>
      <li>El sistema validará automáticamente según las reglas configuradas</li>
      <li>Podrás descargar un reporte detallado en Excel al finalizar</li>
    </ul>
  </div>
</div>

<script>
const fileInput = document.getElementById('file');
const btnSubmit = document.getElementById('btnSubmit');
const btnSelectFile = document.getElementById('btnSelectFile');
const progressBar = document.getElementById('progressBar');
const progressWrap = document.getElementById('progressWrap');
const progressText = document.getElementById('progressText');
const dropZone = document.getElementById('dropZone');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const uploadForm = document.getElementById('uploadForm');

// Formatear tamaño de archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Botón seleccionar archivo
btnSelectFile.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  fileInput.click();
});

// Manejar cambio de archivo
fileInput.addEventListener('change', function() {
  if (this.files.length > 0) {
    const file = this.files[0];
    btnSubmit.disabled = false;
    fileInfo.style.display = 'block';
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    dropZone.style.borderColor = '#28a745';
  } else {
    btnSubmit.disabled = true;
    fileInfo.style.display = 'none';
    dropZone.style.borderColor = '#ccc';
  }
});

// Drag and drop - solo en el área específica, no en el botón
dropZone.addEventListener('click', (e) => {
  // Solo abrir selector si NO se hizo clic en el botón
  if (e.target !== btnSelectFile && !btnSelectFile.contains(e.target)) {
    fileInput.click();
  }
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (ext === 'xlsm' || ext === 'xlsx') {
      fileInput.files = files;
      fileInput.dispatchEvent(new Event('change'));
    } else {
      alert('Solo se permiten archivos .xlsm o .xlsx');
    }
  }
});

// Envío del formulario
uploadForm.addEventListener('submit', function(e) {
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
  progressWrap.style.display = 'block';
  
  let width = 0;
  const interval = setInterval(() => {
    width = Math.min(width + 5, 95);
    progressBar.style.width = width + '%';
    progressBar.setAttribute('aria-valuenow', width);
    progressText.textContent = width + '%';
    
    if (width >= 95) {
      clearInterval(interval);
    }
  }, 150);
});
</script>
</body>
</html>
