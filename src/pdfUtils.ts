// pdfUtils.ts
export function generateAndDownloadPDF(data: any, fileName: string) {
  console.log("Generating PDF with data:", data);
  console.log("File name:", fileName);

  const blob = new Blob([JSON.stringify(data)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
