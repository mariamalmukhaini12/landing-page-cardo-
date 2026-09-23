# CardO landing page — cardofintech.om

One page (`index.html`) plus one serverless function (`api/demo.js`) that emails
each demo request to info@cardofintech.om and sends the visitor a bilingual
confirmation.

```
index.html      the page (English / Arabic toggle)
api/demo.js     POST /api/demo — sends the two emails
package.json    installs nodemailer for the function
vercel.json     security headers
```

## Deploy on Vercel

1. Connect this GitHub repo to the `cardo-fintech` Vercel project
   (Project → Settings → Git), or import it as a new project.
   Framework preset: **Other**. No build command, no output directory.
2. **Settings → Environment Variables** (Production), then redeploy:

   | Name        | Value                                   |
   |-------------|-----------------------------------------|
   | `SMTP_HOST` | `smtp.zoho.com` (or `smtp.gmail.com`, `smtp.office365.com`) |
   | `SMTP_PORT` | `465`                                   |
   | `SMTP_USER` | `info@cardofintech.om`                  |
   | `SMTP_PASS` | the mailbox **app password**            |
   | `NOTIFY_TO` | `info@cardofintech.om`                  |

3. Keep `cardofintech.om` under **Settings → Domains**.

The files must keep this layout. The function only exists if `demo.js` sits
inside the `api/` folder and `package.json` is at the root.

## Test

Open https://cardofintech.om, submit the form with your own details, and check
that both emails arrive. If the form shows an error, open Vercel → project →
**Logs**. `missing environment variables` means step 2 isn't done. Any other
message is the exact SMTP error.

If sending ever fails, the form tells the visitor to email info@cardofintech.om
or call +968 7232 3282, so no lead is left with a dead end.

Never commit a `.env` file. Use `.env.example` as the template for local testing
(`npm install && npx vercel dev`).
