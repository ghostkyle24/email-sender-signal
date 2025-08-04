import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, status } = req.body;

  if (status !== 'approved' && status !== 'paid') {
    return res.status(200).json({ ok: false, message: 'Not approved' });
  }

  try {
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
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}