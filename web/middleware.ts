/**
 * Password gate for the hosted site (Vercel Routing Middleware).
 *
 * Every request is checked here before any file is served. Without a valid
 * session cookie the visitor gets the sign-in page, never the app.
 *
 * Settings (Vercel → Project → Settings → Environment Variables):
 *   SITE_PASSWORD  the shared password. Changing it signs everyone out.
 */
import { next } from "@vercel/functions";

export const config = { matcher: "/:path*" };

const COOKIE = "cc_session";
const LOGIN_PATH = "/__auth/login";
const LOGOUT_PATH = "/__auth/logout";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

async function sessionToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("collaboration-circle-session-v1"));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

/** Only same-site paths; never "//host" or an absolute URL. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/__auth")) return "/";
  return value;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const PRIVATE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "same-origin",
};

function signInPage(nextPath: string, error: string | null, status = 401): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Collaboration Circle</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { display: flex; background: #FFFFFF; color: #101418; font: 15px/1.6 "IBM Plex Sans", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .rail { width: 220px; flex: none; background: #101418; padding: 32px 20px; }
  .wordmark { font-family: "Newsreader", Georgia, serif; font-size: 20px; line-height: 1.2; color: #FFFFFF; }
  main { flex: 1; min-width: 0; display: flex; align-items: center; padding: 48px 56px; }
  form { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 20px; }
  .eyebrow { font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #4B5563; }
  h1 { font-family: "Newsreader", Georgia, serif; font-weight: 400; font-size: 40px; line-height: 1.1; margin: 0; }
  p { margin: 0; color: #4B5563; }
  label { display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: #4B5563; }
  input { height: 48px; border: 1px solid #C7CCD2; border-radius: 0; padding: 0 16px; font: inherit; font-size: 15px; color: #101418; background: #FFFFFF; }
  input:focus { outline: 2px solid #101418; outline-offset: -1px; }
  button { align-self: flex-start; background: #6E1E2A; color: #FFFFFF; border: 0; border-radius: 0; padding: 9px 16px; font: inherit; font-size: 15px; cursor: pointer; transition: background 150ms ease; }
  button:hover { background: #571722; }
  button:focus-visible { outline: 2px solid #101418; outline-offset: 2px; }
  .error { color: #6E1E2A; font-size: 14px; }
  .note { font-size: 14px; padding-top: 16px; border-top: 1px solid #E2E5E9; }
  @media (max-width: 720px) {
    body { flex-direction: column; }
    .rail { width: 100%; padding: 20px 16px; }
    .wordmark br { display: none; }
    main { padding: 40px 16px; align-items: flex-start; }
    h1 { font-size: 28px; }
  }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
  <div class="rail"><div class="wordmark">Collaboration<br>Circle</div></div>
  <main>
    <form method="post" action="${LOGIN_PATH}">
      <div class="eyebrow">Private preview</div>
      <h1>Collaboration Circle OS</h1>
      <p>This preview is open to the circle's team only. Enter the password you were given.</p>
      <label for="password">Password
        <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
      </label>
      <input type="hidden" name="next" value="${escapeHtml(nextPath)}">
      ${error ? `<div class="error" role="alert">${escapeHtml(error)}</div>` : ""}
      <button type="submit">Enter</button>
      <p class="note">Sample data only. Nothing here is a real family, deal or conversation.</p>
    </form>
  </main>
</body>
</html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", ...PRIVATE_HEADERS } });
}

function plain(message: string, status: number): Response {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", ...PRIVATE_HEADERS } });
}

export default async function middleware(request: Request): Promise<Response> {
  const password = process.env.SITE_PASSWORD;
  // Fail closed: without a password configured, nothing is served.
  if (!password) return plain("This site is locked. Set SITE_PASSWORD in the hosting settings, then redeploy.", 503);

  const url = new URL(request.url);
  const expected = await sessionToken(password);

  if (url.pathname === LOGOUT_PATH) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/", "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`, ...PRIVATE_HEADERS },
    });
  }

  if (url.pathname === LOGIN_PATH) {
    if (request.method !== "POST") return Response.redirect(new URL("/", url), 303);
    const form = await request.formData();
    const given = String(form.get("password") ?? "");
    const nextPath = safeNext(String(form.get("next") ?? "/"));
    if (!sameString(await sessionToken(given), expected)) {
      await new Promise((r) => setTimeout(r, 600)); // slows repeated guessing
      return signInPage(nextPath, "That password is not right. Check it and try again.");
    }
    return new Response(null, {
      status: 303,
      headers: {
        Location: nextPath,
        "Set-Cookie": `${COOKIE}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${THIRTY_DAYS}`,
        ...PRIVATE_HEADERS,
      },
    });
  }

  const cookie = readCookie(request, COOKIE);
  if (cookie && sameString(cookie, expected)) {
    return next({ headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }

  return signInPage(safeNext(url.pathname + url.search), null);
}
