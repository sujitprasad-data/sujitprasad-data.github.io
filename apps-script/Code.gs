/**
 * Google Apps Script backend for the portfolio "Connect" form.
 *
 * Setup:
 * 1. Create a Google Sheet. Put this script in Extensions > Apps Script.
 * 2. Project Settings > Script properties, add:
 *      RESUME_URL   = Drive share link to a phone-free resume (Anyone with the link: Viewer)
 *      NOTIFY_EMAIL = the address that should get a notification for each submission
 * 3. Deploy > New deployment > type "Web app":
 *      Execute as: Me    |    Who has access: Anyone
 * 4. Copy the web app URL into NEXT_PUBLIC_FORM_URL (see env.example).
 */

const SHEET_NAME = "Leads";
const HEADERS = ["Timestamp", "Name", "Email (Canonical)", "Raw Email", "Message", "Source", "Status"];
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DISPOSABLE_DOMAINS = {
  "mailinator.com": true,
  "guerrillamail.com": true,
  "10minutemail.com": true,
  "tempmail.com": true,
  "temp-mail.org": true,
  "yopmail.com": true,
  "trashmail.com": true,
  "sharklasers.com": true,
  "getnada.com": true,
  "maildrop.cc": true,
  "throwawaymail.com": true,
  "fakeinbox.com": true,
  "dispostable.com": true,
  "mailnesia.com": true,
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const name = clean(body.name, 100);
    const rawEmail = String(body.email || "").trim().toLowerCase().slice(0, 150);
    const message = clean(body.message, 1000);
    const source = clean(body.source, 100);

    const normalized = normalizeAndValidateEmail(rawEmail);
    if (!name || name.length < 2 || !normalized.valid) {
      return json({ ok: false, error: normalized.error || "invalid" });
    }

    // Canonical email has "+..." stripped and Gmail dots removed, so
    // abc+123@gmail.com, abc+999@gmail.com, and a.b.c@gmail.com all become abc@gmail.com
    const canonicalEmail = normalized.canonical;

    const props = PropertiesService.getScriptProperties();
    const sheet = getSheet();

    if (hasCanonicalEmailAlreadySubmitted(sheet, canonicalEmail)) {
      sheet.appendRow([new Date(), name, canonicalEmail, clean(rawEmail, 150), message, source, "DUPLICATE_BLOCKED"]);
      return json({ ok: true, deduplicated: true });
    }

    sheet.appendRow([new Date(), name, canonicalEmail, clean(rawEmail, 150), message, source, "SENT"]);

    const notify = props.getProperty("NOTIFY_EMAIL");
    if (notify) {
      MailApp.sendEmail(
        notify,
        "Portfolio contact: " + name,
        "Name: " + name + "\nEmail: " + canonicalEmail + "\nMessage: " + message
      );
    }

    const resume = props.getProperty("RESUME_URL");
    if (resume) {
      MailApp.sendEmail(
        canonicalEmail,
        "Sujit Prasad's resume",
        "Hi " + name + ",\n\nThanks for connecting. Here is my resume:\n" + resume +
          "\n\nI'll reply to you soon.\n\nSujit Prasad"
      );
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: "server" });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Validates the email, blocks disposable domains, strips everything after '+'
 * in the local part (so abc+123@gmail.com -> abc@gmail.com), and removes dots
 * for Gmail/Googlemail addresses.
 */
function normalizeAndValidateEmail(email) {
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "invalid_format" };
  }
  const parts = email.split("@");
  if (parts.length !== 2) return { valid: false, error: "invalid_format" };

  const localPart = parts[0];
  let domain = parts[1];

  if (!localPart || !domain || domain.indexOf("..") !== -1 || domain.charAt(0) === "." || domain.charAt(domain.length - 1) === ".") {
    return { valid: false, error: "invalid_domain" };
  }

  if (DISPOSABLE_DOMAINS[domain]) {
    return { valid: false, error: "disposable_domain" };
  }

  if (domain === "googlemail.com") {
    domain = "gmail.com";
  }

  // Strip "+tag" subaddressing (anything from '+' up to '@')
  let baseLocal = localPart.split("+")[0];

  // For Gmail, dots in the username don't count either (a.b.c@gmail.com == abc@gmail.com)
  if (domain === "gmail.com") {
    baseLocal = baseLocal.replace(/\./g, "");
  }

  if (!baseLocal) {
    return { valid: false, error: "empty_local" };
  }

  return {
    valid: true,
    canonical: baseLocal + "@" + domain,
  };
}

/**
 * Checks whether this canonical email has already requested the resume,
 * preventing someone from spamming abc+1@gmail.com, abc+2@gmail.com, etc.
 */
function hasCanonicalEmailAlreadySubmitted(sheet, canonicalEmail) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  const existing = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  for (let i = 0; i < existing.length; i++) {
    if (String(existing[i][0]).trim().toLowerCase() === canonicalEmail) {
      return true;
    }
  }
  return false;
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

// Strip leading characters that make Sheets treat text as a formula.
function clean(value, max) {
  const s = String(value || "").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
