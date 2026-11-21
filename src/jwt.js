// Edge-native HMAC-SHA256 JWT implementation using Web Crypto API
function base64UrlEncode(bytes) {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function stringToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToString(bytes) {
  return new TextDecoder().decode(bytes);
}

async function getKey(secret) {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signJwt(payload, secret, expiresInSeconds = 86400 * 30) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerB64 = base64UrlEncode(stringToBytes(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(stringToBytes(JSON.stringify(fullPayload)));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await getKey(secret);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, stringToBytes(dataToSign));
  const signatureB64 = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${dataToSign}.${signatureB64}`;
}

export async function verifyJwt(token, secret) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const dataToVerify = `${headerB64}.${payloadB64}`;

  try {
    const key = await getKey(secret);
    const signatureBytes = base64UrlDecode(signatureB64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      stringToBytes(dataToVerify)
    );

    if (!isValid) return null;

    const payloadJson = bytesToString(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}
