import {Alert} from 'react-native';
import {generatePDF} from 'react-native-html-to-pdf';
import Share, {Social} from 'react-native-share';
import {ComputedValues, FormState, SECTIONS, SECTION_LABELS} from '../types';
import {fmt} from './calculation';

export function buildPDFHtml(form: FormState, computed: ComputedValues): string {
  const rps = parseFloat(form.ratePerStitch) || 0;
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const tableRows = SECTIONS.map(
    s => `
    <tr>
      <td class="col-label">${SECTION_LABELS[s]}</td>
      <td>${form.sections[s].head || '0'}</td>
      <td>${form.sections[s].stich || '0'}</td>
      <td class="computed">${fmt(computed.totalStich[s], 0)}</td>
      <td class="computed rate-col">₹ ${fmt(computed.rate[s])}</td>
    </tr>`,
  ).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #004C6D; background: #fff; padding: 32px; }

  .header { background: #004C6D; color: white; padding: 20px 24px; border-radius: 10px; margin-bottom: 24px; }
  .header h1 { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
  .header .sub { font-size: 12px; color: #00E0D6; margin-top: 4px; }

  .section-title {
    font-size: 11px; font-weight: bold; color: #0077A8;
    text-transform: uppercase; letter-spacing: 1px;
    margin: 16px 0 8px;
  }

  .info-box { background: #F2FBFF; border: 1px solid #E6F1F7; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
  .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .info-label { font-size: 12px; color: #7BAFC0; }
  .info-value { font-size: 13px; font-weight: bold; color: #004C6D; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th {
    background: #004C6D; color: white;
    padding: 9px 10px; font-size: 11px;
    text-align: center; letter-spacing: 0.5px;
  }
  th.col-label { text-align: left; }
  td {
    padding: 8px 10px; font-size: 12px;
    border-bottom: 1px solid #E6F1F7;
    text-align: center; color: #004C6D;
  }
  td.col-label { text-align: left; font-weight: bold; }
  td.computed { background: #D0F8F5; color: #0077A8; font-weight: bold; }
  td.rate-col { background: #D0F8F5; }
  tr:nth-child(even) td { background: #F2FBFF; }
  tr:nth-child(even) td.computed { background: #C0F4F0; }

  .summary-box {
    border: 2px solid #00B3C7; border-radius: 10px;
    padding: 16px 20px; margin-top: 8px;
  }
  .summary-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; border-bottom: 1px solid #E6F1F7;
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 13px; color: #004C6D; font-weight: bold; }
  .summary-value { font-size: 14px; color: #0077A8; font-weight: bold; }
  .summary-total .summary-label { font-size: 15px; color: #004C6D; }
  .summary-total .summary-value {
    font-size: 20px; color: #00B3C7; font-weight: bold;
  }

  .footer {
    margin-top: 28px; padding-top: 12px;
    border-top: 1px solid #E6F1F7;
    display: flex; justify-content: space-between;
    font-size: 10px; color: #7BAFC0;
  }
</style>
</head>
<body>

  <!-- App Header -->
  <div class="header">
    <h1>✂ Stitcho Art Costing Software</h1>
    <div class="sub">by Apex Infocom &nbsp;|&nbsp; com.apexinfocom.stitcho</div>
  </div>

  <!-- Design Info -->
  <div class="section-title">Design Information</div>
  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Design No / Name</span>
      <span class="info-value">${form.designName || '—'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Rate Per Stitch</span>
      <span class="info-value">${rps.toFixed(2)}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Generated On</span>
      <span class="info-value">${now}</span>
    </div>
  </div>

  <!-- Calculation Table -->
  <div class="section-title">Stitching Calculation</div>
  <table>
    <thead>
      <tr>
        <th class="col-label">Section</th>
        <th>Head</th>
        <th>Stich</th>
        <th>Total Stich</th>
        <th>Rate (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <!-- Summary -->
  <div class="section-title">Summary</div>
  <div class="summary-box">
    <div class="summary-row">
      <span class="summary-label">Rate Per Stitch</span>
      <span class="summary-value">${rps.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Total Sarees Stitch</span>
      <span class="summary-value">${fmt(computed.sareesStitch, 0)}</span>
    </div>
    ${SECTIONS.map(
      s => `
    <div class="summary-row">
      <span class="summary-label">${SECTION_LABELS[s]} Rate</span>
      <span class="summary-value">₹ ${fmt(computed.rate[s])}</span>
    </div>`,
    ).join('')}
    <div class="summary-row summary-total">
      <span class="summary-label">Total Sarees Rate</span>
      <span class="summary-value">₹ ${fmt(computed.sareesRate)}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Stitcho Art Costing – com.apexinfocom.stitcho</span>
    <span>${now}</span>
  </div>

</body>
</html>`;
}

export async function generateAndSharePDF(
  form: FormState,
  computed: ComputedValues,
): Promise<void> {
  try {
    const html = buildPDFHtml(form, computed);
    const designSlug = (form.designName || 'stitcho').replace(/[^a-z0-9]/gi, '_');
    const options = {
      html,
      fileName: `stitcho_${designSlug}_${Date.now()}`,
    };

    const pdf = await generatePDF(options);
    if (!pdf || !pdf.filePath) {
      throw new Error('PDF generation failed to produce a valid file.');
    }

    const fileUrl = pdf.filePath.startsWith('file://')
      ? pdf.filePath
      : `file://${pdf.filePath}`;

    const shareOptions = {
      title: `Stitcho – ${form.designName || 'Costing Report'}`,
      subject: `Stitcho – ${form.designName || 'Costing Report'}`,
      message: `Stitcho Art Costing Report\nDesign: ${
        form.designName || '—'
      }\nSarees Rate: ₹${fmt(computed.sareesRate)}\nTotal Stitch: ${fmt(
        computed.sareesStitch,
        0,
      )}\n\nShared from Stitcho Art Costing App`,
      url: fileUrl,
      type: 'application/pdf',
    };

    // Try sharing directly to WhatsApp if installed
    try {
      const {isInstalled} = await Share.isPackageInstalled('com.whatsapp');
      if (isInstalled) {
        await Share.shareSingle({
          ...shareOptions,
          social: Social.Whatsapp,
        });
        return;
      }
    } catch {
      // If WhatsApp check fails or not installed, fallback to general share dialog
    }

    // Fallback to standard share dialog
    await Share.open(shareOptions);
  } catch (err: any) {
    if (
      err &&
      err.message &&
      (err.message.includes('User did not share') ||
        err.message.includes('dismissed') ||
        err.message.includes('Canceled') ||
        err.message.includes('CANCELLED'))
    ) {
      return;
    }
    Alert.alert(
      'Share Failed',
      err?.message || 'Could not share PDF. Please try again.',
    );
  }
}
