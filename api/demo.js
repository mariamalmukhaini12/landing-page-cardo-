/**
 * CardO — demo request endpoint  (POST /api/demo)
 * ---------------------------------------------------------------
 * Runs on your own hosting (Vercel / Netlify / any Node server).
 * No form service involved. It sends two emails over your own
 * mailbox's SMTP:
 *
 *   1. the lead  -> info@cardofintech.om
 *   2. the bilingual confirmation email -> the person who requested a demo
 *
 * Environment variables required (set them in your host's dashboard):
 *   SMTP_HOST   e.g. smtp.zoho.com
 *   SMTP_PORT   465
 *   SMTP_USER   info@cardofintech.om
 *   SMTP_PASS   the mailbox app password
 *
 * See README.md
 * ---------------------------------------------------------------
 */

import nodemailer from 'nodemailer';

const TO = process.env.NOTIFY_TO || 'info@cardofintech.om';
const FROM = `CardO <${process.env.SMTP_USER || TO}>`;

const NAVY = '#1B2545';
const SLATE = '#3A4256';
const CLOUD = '#F4F7FB';
const LINE = '#E3E9F2';
const SKY = '#5CB8F2';
const SIGNAL = '#2A8FD4';

/* ---------- helpers ---------- */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
const validPhone = (v) => {
  const d = String(v).replace(/[^\d]/g, '');
  return d.length >= 8 && d.length <= 15;
};

function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

/* ---------- email 1: the lead, to you ---------- */

function leadHtml({ name, company, phone, email, language }) {
  const row = (k, v) => `
    <tr>
      <td style="padding:8px 14px 8px 0;border-bottom:1px solid ${LINE};color:#7C8598">${k}</td>
      <td style="padding:8px 0;border-bottom:1px solid ${LINE};color:${NAVY};font-weight:bold">${esc(v)}</td>
    </tr>`;

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:${SLATE};font-size:15px;line-height:1.7">
    <h2 style="color:${NAVY};margin:0 0 18px">New demo request</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px">
      ${row('Name', name)}${row('Company', company)}${row('Phone', phone)}${row('Email', email)}
      ${row('Language', language || '—')}
      ${row('Received', new Date().toLocaleString('en-GB', { timeZone: 'Asia/Muscat' }) + ' (Muscat)')}
    </table>
  </div>`;
}

/* ---------- email 2: the welcome, to them ---------- */

function welcomeHtml(name) {
  const n = esc(name);
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:${CLOUD}">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CLOUD};padding:32px 12px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid ${LINE}">

  <tr><td style="padding:28px 32px;border-bottom:1px solid ${LINE}">
    <span style="font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:24px;color:${NAVY}">Card</span><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${SKY};border:5px solid ${SIGNAL};vertical-align:-2px"></span>
  </td></tr>

  <tr><td dir="ltr" style="padding:32px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:${SLATE};font-size:15px;line-height:1.75">
    <p style="margin:0 0 16px;color:${NAVY};font-size:18px;font-weight:bold">Hello ${n},</p>
    <p style="margin:0 0 16px">Thank you for requesting a CardO demo! &#128640;</p>
    <p style="margin:0 0 16px">We've received your request and a member of our team will contact you within one business day to schedule your walkthrough.</p>
    <p style="margin:0 0 16px">In the demo we'll show you how CardO helps businesses control their spending through smart virtual cards, real-time tracking, and simplified expense management.</p>
    <p style="margin:0 0 4px">Thank you for your trust,</p>
    <p style="margin:0;font-weight:bold;color:${NAVY}">The CardO Team</p>
    <p style="margin:6px 0 0;color:${SIGNAL};font-size:14px">Smarter spending. Better control.</p>
  </td></tr>

  <tr><td style="padding:26px 32px"><div style="height:1px;background:${LINE}"></div></td></tr>

  <tr><td dir="rtl" align="right" style="padding:0 32px 32px;font-family:Tahoma,Arial,Helvetica,sans-serif;color:${SLATE};font-size:15px;line-height:2">
    <p style="margin:0 0 16px;color:${NAVY};font-size:18px;font-weight:bold">مرحبًا ${n}،</p>
    <p style="margin:0 0 16px">شكرًا لطلبك عرضًا توضيحيًا لـ CardO! &#128640;</p>
    <p style="margin:0 0 16px">لقد استلمنا طلبك، وسيتواصل معك أحد أعضاء فريقنا خلال يوم عمل واحد لتحديد موعد العرض.</p>
    <p style="margin:0 0 16px">سنوضح لك خلال العرض كيف تساعد CardO الشركات على التحكم في مصروفاتها من خلال البطاقات الافتراضية الذكية، والمتابعة الفورية للعمليات، وإدارة المصروفات بطريقة أكثر سهولة ووضوحًا.</p>
    <p style="margin:0 0 4px">شكرًا لثقتك بنا،</p>
    <p style="margin:0;font-weight:bold;color:${NAVY}">فريق CardO</p>
    <p style="margin:6px 0 0;color:${SIGNAL};font-size:14px">إدارة أذكى لمصروفات شركتك</p>
  </td></tr>

  <tr><td style="padding:22px 32px;background:${NAVY};color:#8FA6C9;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.8">
    <div>info@cardofintech.om &nbsp;&#183;&nbsp; +968 7232 3282 &nbsp;&#183;&nbsp; cardofintech.om</div>
    <div style="margin-top:6px;color:#7386A8">Global Business Systems LLC &#183; CR 1644714 &#183; Muscat, Oman</div>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

/* ---------- handler ---------- */

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method not allowed' });

  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('demo error: missing environment variables:', missing.join(', '));
    return res.status(500).json({ ok: false, error: 'email not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const name = String(body.name || '').trim();
    const company = String(body.company || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const language = String(body.language || '').trim();

    if (body.website) return res.status(200).json({ ok: true });          // honeypot
    if (name.length < 2 || company.length < 2) return res.status(400).json({ ok: false, error: 'name and company required' });
    if (!validPhone(phone)) return res.status(400).json({ ok: false, error: 'invalid phone' });
    if (!validEmail(email)) return res.status(400).json({ ok: false, error: 'invalid email' });

    const mailer = transport();

    // 1. lead to the team — the signup's address as reply-to
    await mailer.sendMail({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `CardO demo request — ${company}`,
      html: leadHtml({ name, company, phone, email, language })
    });

    // 2. confirmation to the person
    await mailer.sendMail({
      from: FROM,
      to: email,
      replyTo: TO,
      subject: 'Your CardO demo request | طلب العرض التوضيحي من CardO',
      html: welcomeHtml(name)
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('demo error:', err);
    return res.status(500).json({ ok: false, error: 'send failed' });
  }
}
