import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Log do corpo do POST para debug
  console.log('[WEBHOOK RECEBIDO]', JSON.stringify(req.body));

  // Extrair campos do payload da Perfect Pay
  const { token, sale_status_enum, customer } = req.body;
  const email = customer?.email;
  const name = customer?.full_name;

  // Traduzir status numérico para texto
  let status = '';
  if (sale_status_enum === 2) status = 'approved';
  else if (sale_status_enum === 5) status = 'rejected';
  else if (sale_status_enum === 6) status = 'canceled';

  // Token especial para mensagem personalizada
  const specialToken = 'e8a3c622941e51e10d48491c5aeabf6c';
  // Token padrão
  const defaultToken = '7a96921c75214e33a2d6e2815facdc49';

  try {
    // E-mail padrão para pagamento aprovado
    if (status === 'approved') {
      await resend.emails.send({
        from: 'SignalCheck <noreply@signalcheckapp.store>',
        to: email,
        subject: 'Congratulations on your purchase! Access your tool',
        html: `
          <div style="background:#181A1B;padding:32px 0;text-align:center;font-family:Inter,Arial,sans-serif;">
            <div style="background:#232d36;max-width:420px;margin:0 auto;padding:32px 24px;border-radius:16px;box-shadow:0 4px 24px #0005;">
              <img src="https://signalcheckapp.store/logo.jpg" alt="Logo" style="width:64px;height:64px;margin-bottom:18px;border-radius:12px;box-shadow:0 2px 8px #0002;" />
              <h2 style="color:#25d366;margin-bottom:18px;font-size:24px;">Congratulations on your purchase!</h2>
              <p style="color:#fff;font-size:17px;margin-bottom:32px;">To access our tools, simply click the button below:</p>
              <a href="https://redirect-online.vercel.app/tutorial" style="display:inline-block;background:#25d366;color:#fff;font-weight:700;font-size:18px;padding:16px 32px;border-radius:8px;text-decoration:none;box-shadow:0 2px 8px #25d36633;transition:background 0.2s;">Access Tutorial</a>
              <p style="color:#b0b0b0;font-size:14px;margin-top:32px;">If you have any questions, please contact our support team.</p>
            </div>
          </div>
        `
      });
      return res.status(200).json({ ok: true });
    }

    // E-mail personalizado para rejeitado/cancelado e token especial
    if (
      (status === 'canceled' || status === 'rejected') &&
      (token === specialToken)
    ) {
      await resend.emails.send({
        from: 'SignalCheck <noreply@signalcheckapp.store>',
        to: email,
        subject: `${name}, you canceled… but they didn’t stop.`,
        html: `
          <div style="background:#181A1B;padding:32px 0;text-align:center;font-family:Inter,Arial,sans-serif;">
            <div style="background:#232d36;max-width:420px;margin:0 auto;padding:32px 24px;border-radius:16px;box-shadow:0 4px 24px #0005;">
              <h2 style="color:#E60033;margin-bottom:18px;font-size:22px;">${name}, you canceled… but they didn’t stop.</h2>
              <p style="color:#fff;font-size:17px;margin-bottom:24px;">
                ⚠️ Canceling doesn't change the facts, <b>${name}</b>.<br><br>
                If you still feel like something's off… it probably is.<br>
                While you're hesitating, the other person keeps laughing behind your back.<br><br>
                With SignalCheck, you'd get access to:
                <ul style="text-align:left;margin:1rem auto 1rem 1.2rem;color:#25d366;">
                  <li>📍 Real-time location tracking (without being detected)</li>
                  <li>💬 Conversations from WhatsApp, Facebook, Instagram, and Snapchat</li>
                  <li>🔐 Automatic password cloning</li>
                  <li>🎤 Live microphone listening</li>
                </ul>
                Canceling was your choice.<br>
                But staying in the dark will be too.<br><br>
                👉 Final chance with a secret discount:<br>
                <b>💣 From $14 down to just $9.90 (limited time only)</b>
              </p>
              <a href="https://go.perfectpay.com.br/PPU38CPTLRL" style="display:inline-block;background:#1eb200;color:#008000;font-weight:700;font-size:18px;padding:16px 32px;border-radius:8px;text-decoration:none;box-shadow:0 2px 8px #B2001A33;transition:background 0.2s;margin-bottom:16px;border: none;">Private reactivation link</a>
              <p style="color:#444;font-size:14px;margin-top:24px;">Once you know the truth... everything changes.</p>
            </div>
          </div>
        `
      });
      return res.status(200).json({ ok: true });
    }

    // E-mail padrão para rejeitado/cancelado e token padrão
    if (
      (status === 'canceled' || status === 'rejected') &&
      (token === defaultToken)
    ) {
      await resend.emails.send({
        from: 'SignalCheck <noreply@signalcheckapp.store>',
        to: email,
        subject: `${name}, you canceled… but they didn’t stop.`,
        html: `
          <div style="background:#fff;padding:32px 0;text-align:center;font-family:Inter,Arial,sans-serif;">
            <div style="background:#fff;max-width:420px;margin:0 auto;padding:32px 24px;border-radius:16px;box-shadow:0 4px 24px #0002;">
              <h2 style="color:#E60033;margin-bottom:18px;font-size:22px;">${name}, you canceled… but they didn’t stop.</h2>
              <p style="color:#222;font-size:17px;margin-bottom:24px;">
                ⚠️ Canceling doesn't change the facts, <b>${name}</b>.<br><br>
                If you still feel like something's off… it probably is.<br>
                While you're hesitating, the other person keeps laughing behind your back.<br><br>
                With SignalCheck, you'd get access to:
                <ul style="text-align:left;margin:1rem auto 1rem 1.2rem;color:#E60033;">
                  <li>📍 Real-time location tracking (without being detected)</li>
                  <li>💬 Conversations from WhatsApp, Facebook, Instagram, and Snapchat</li>
                  <li>🔐 Automatic password cloning</li>
                  <li>🎤 Live microphone listening</li>
                </ul>
                Canceling was your choice.<br>
                But staying in the dark will be too.<br><br>
                👉 Final chance with a secret discount:<br>
                <b>💣 From $14 down to just $9.90 (limited time only)</b>
              </p>
              <a href="https://go.perfectpay.com.br/PPU38CPTPLS" style="display:inline-block;background:#B2001A;color:#fff;font-weight:700;font-size:18px;padding:16px 32px;border-radius:8px;text-decoration:none;box-shadow:0 2px 8px #B2001A33;transition:background 0.2s;margin-bottom:16px;border: none;">Private reactivation link</a>
              <p style="color:#444;font-size:14px;margin-top:24px;">Once you know the truth... everything changes.</p>
            </div>
          </div>
        `
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: false, message: 'Not approved or canceled/rejected' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}