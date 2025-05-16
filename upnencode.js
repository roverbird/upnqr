function pad(str, len = 2) {
  str = String(str);
  return str.length >= len ? str : '0'.repeat(len - str.length) + str;
}

function formatAmount(amount) {
  return pad(Math.round(amount * 100).toString(), 11);
}

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
    'UPNQR',
    payerIBAN,
    data.polog ? '1' : '',       // polog (deposit)
    data.dvig ? '1' : '',        // dvig (withdrawal)
    payerRef,
    (data.ime_placnika || '').trim(),
    (data.ulica_placnika || '').trim(),
    (data.kraj_placnika || '').trim(),
    formatAmount(data.znesek),
    formatDate(data.rok_placila || new Date()),
    data.nujno ? 'X' : '',
    (data.koda_namena || '').trim().toUpperCase(),
    (data.namen_placila || '').trim(),
    '', // deadline
    recipientIBAN,
    recipientRef,
    (data.ime_prejemnika || '').trim(),
    (data.ulica_prejemnika || '').trim(),
    (data.kraj_prejemnika || '').trim(),
    '0', // sum placeholder
    (data.rezerva || '') // reserved
  ];

  const sum = lines.slice(0, 19).reduce((acc, line) => acc + line.length + 1, 0);
  lines[19] = sum.toString();

  return lines.join('\n');
}

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
    referenca_placnika: document.getElementById('referenca_placnika').value
  };

  const upnText = encodeUPN(data);

  QRCode.toCanvas(document.getElementById('qrcode'), upnText, {
    errorCorrectionLevel: 'M',
    width: 256
  }, err => {
    if (err) console.error(err);
  });
}

