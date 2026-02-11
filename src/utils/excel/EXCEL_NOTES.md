# Excel Processing Notes

## Limitations
1. **Macros**: Macros (.xlsm) are **NOT** executed. The reader explicitly disables VBA (`bookVBA: false`). This is a security feature.
2. **File Size**: Large files (> 10MB) may block the main thread. It is recommended to run `readWorkbook` inside a Web Worker if processing large datasets.
3. **Formulas**: We extract formula text (`f` field) but do not re-calculate them. We rely on the cached value (`v`) stored in the file. If the file was saved without recalculating, the value might be stale.

## Performance
- **Used Range**: The reader respects the `!ref` property of the sheet to avoid scanning millions of empty cells.
- **Lite Mode**: Using `options.lite = true` will skip extracting formula strings to save memory.
- **Sparse Data**: We store data in a dictionary `Record<string, CellData>` rather than a 2D array. This is memory efficient for sparse sheets but requires address lookups.

## Integration
To use this module:
1. Install SheetJS: `npm install xlsx`
2. Import `readWorkbook`:
   ```typescript
   import { readWorkbook } from './utils/excel/excelReader';
   
   const handleFile = async (file: File) => {
     try {
       const data = await readWorkbook(file, { lite: true });
       console.log(data);
     } catch (err) {
       console.error("Error reading excel", err);
     }
   };
   ```
