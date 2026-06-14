 Cargar archivo REM
2. Extraer código, serie y mes desde el nombre
3. Buscar establecimiento por código
4. Identificar tipo del establecimiento
5. Leer workbook
6. Cargar reglas de la serie
7. Para cada regla:
   a. Revisar alcance: TODOS, POSTAS, HOSPITALES, CESFAM, APS, etc.
   b. Si aplica al establecimiento actual:
      - Evaluar regla normalmente.
   c. Si no aplica al establecimiento actual y bloquearEnOtros = true:
      - Revisar si las celdas involucradas tienen datos.
      - Si tienen datos, generar hallazgo.
   d. Si no aplica y bloquearEnOtros = false:
      - Ignorar regla.
8. Guardar resultado
9. Mostrar resumen
10. Exportar reporte

