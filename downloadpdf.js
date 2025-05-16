import { Roboto_Regular_Normal } from './roboto-regular-normal.js';

window.downloadPDF = function () {
  // Get jsPDF from global UMD bundle
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Register Roboto font
  doc.addFileToVFS("Roboto-Regular-normal.ttf", Roboto_Regular_Normal);
  doc.addFont("Roboto-Regular-normal.ttf", "Roboto", "normal");
  doc.setFont("Roboto", "normal");
  doc.setFontSize(16);

  doc.text("UPN QR Plačilni nalog", 20, 20);

  const fields = [
    ['Ime plačnika', 'ime_placnika'],
    ['Ulica plačnika', 'ulica_placnika'],
    ['Kraj plačnika', 'kraj_placnika'],
    ['IBAN plačnika', 'IBAN_placnika'],
    ['Referenca plačnika', 'referenca_placnika'],
    ['Znesek (€)', 'znesek'],
    ['Koda namena', 'koda_namena'],
    ['Namen plačila', 'namen_placila'],
    ['IBAN prejemnika', 'IBAN_prejemnika'],
    ['Referenca prejemnika', 'referenca_prejemnika'],
    ['Ime prejemnika', 'ime_prejemnika'],
    ['Ulica prejemnika', 'ulica_prejemnika'],
    ['Kraj prejemnika', 'kraj_prejemnika']
  ];

  let y = 30;
  doc.setFontSize(12);
  for (const [label, id] of fields) {
    const value = document.getElementById(id)?.value || '';
    doc.text(`${label}: ${value}`, 20, y);
    y += 8;
  }

  const canvas = document.getElementById('qrcode');
  if (canvas && canvas.toDataURL) {
    const imgData = canvas.toDataURL('image/png');
    y += 5;
    doc.addImage(imgData, 'PNG', 20, y, 50, 50);
  }

  doc.save('UPN-QR.pdf');
};

