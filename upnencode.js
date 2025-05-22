// Pads a string with leading zeroes
function pad(str, len = 2) {
  str = String(str);
  return str.length >= len ? str : '0'.repeat(len - str.length) + str;
}

// Converts amount (e.g. 12.5) to "00000001250"
function formatAmount(amount) {
  return pad(Math.round(amount * 100).toString(), 11);
}

// Formats a Date to dd.mm.yyyy (e.g. 15.11.2016)
function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function encodeUPN(data) {
  const payerIBAN = (data.IBAN_placnika || '').replace(/\s+/g, '');
  const payerRef = (data.referenca_placnika || '').replace(/\s+/g, '');
  const recipientIBAN = (data.IBAN_prejemnika || '').replace(/\s+/g, '');
  const recipientRef = (data.referenca_prejemnika || '').replace(/\s+/g, '');

  const lines = [
    'UPNQR', // 1. header
    payerIBAN, // 2. payer IBAN (usually empty)
    '', // 3. empty
    '', // 4. empty
    payerRef, // 5. payer reference (optional)
    (data.ime_placnika || '').trim(), // 6. payer name
    (data.ulica_placnika || '').trim(), // 7. payer address
    (data.kraj_placnika || '').trim(), // 8. payer city
    formatAmount(data.znesek), // 9. amount in cents, 11-digit
    '', // 10. empty payment date
    '', // 11. empty urgency (optional 'X')
    (data.koda_namena || '').trim().toUpperCase(), // 12. purpose code (4 chars)
    (data.namen_placila || '').trim(), // 13. payment purpose description
    formatDate(data.rok_placila || new Date()), // 14. due date
    recipientIBAN, // 15. recipient IBAN
    recipientRef, // 16. recipient reference
    (data.ime_prejemnika || '').trim(), // 17. recipient name
    (data.ulica_prejemnika || '').trim(), // 18. recipient address
    (data.kraj_prejemnika || '').trim(), // 19. recipient city
    '', // 20. placeholder for control sum
    ''  // 21. reserved, always empty
  ];

  // Compute control sum: total length of lines 1–19 including 19 newlines
  const sum = lines.slice(0, 19).reduce((acc, line) => acc + line.length + 1, 0);
  lines[19] = sum.toString();

  return lines.join('\n');
}

// UI function that collects data and generates the QR code
function generate() {
  const data = {
    ime_placnika: document.getElementById('ime_placnika').value,
    ulica_placnika: document.getElementById('ulica_placnika').value,
    kraj_placnika: document.getElementById('kraj_placnika').value,
    znesek: parseFloat(document.getElementById('znesek').value),
    koda_namena: document.getElementById('koda_namena').value,
    namen_placila: document.getElementById('namen_placila').value,
    IBAN_prejemnika: document.getElementById('IBAN_prejemnika').value,
    referenca_prejemnika: document.getElementById('referenca_prejemnika').value,
    ime_prejemnika: document.getElementById('ime_prejemnika').value,
    ulica_prejemnika: document.getElementById('ulica_prejemnika').value,
    kraj_prejemnika: document.getElementById('kraj_prejemnika').value,
    IBAN_placnika: document.getElementById('IBAN_placnika').value,
    referenca_placnika: document.getElementById('referenca_placnika').value,
    rok_placila: document.getElementById('rok_placila')?.value || new Date()
  };

  const upnText = encodeUPN(data);

  QRCode.toCanvas(document.getElementById('qrcode'), upnText, {
    errorCorrectionLevel: 'M',
    width: 256
  }, err => {
    if (err) console.error(err);
  });
}

