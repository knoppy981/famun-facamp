import XLSX from "xlsx";

export function exportAoo(aoo: { [key: string]: string | undefined | number; }[], fileName: string) {
  var ws = XLSX.utils.json_to_sheet(aoo);
  var wb = XLSX.utils.book_new();

  let maxWidths: { [key: string]: number } = {};
  const minWidth: number = 10;

  aoo.forEach(row => {
    Object.keys(row).forEach((key: string) => {
      // Calculate the length of the current cell content
      let contentLength: number = row[key]?.toString().length || 0;

      // Update the maxWidths object
      if (!maxWidths[key] || contentLength > maxWidths[key]) {
        maxWidths[key] = contentLength;
      }
    });
  });

  // Convert maxWidths object to an array for the worksheet columns
  ws["!cols"] = Object.keys(maxWidths).map(key => ({ wch: Math.max(maxWidths[key], minWidth) }));

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export function exportAoa(aoa: string[][], fileName: string) {
  var ws = XLSX.utils.aoa_to_sheet(aoa);
  var wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}