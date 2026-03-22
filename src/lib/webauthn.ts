// src/lib/webauthn.ts
export const isWebAuthnSupported = () => {
  return typeof window !== "undefined" && window.PublicKeyCredential !== undefined;
};

// Convert a string to an ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert an ArrayBuffer to a Base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert a Base64 string to an ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function registerBiometrics(username: string): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported in this browser.");
  }

  const userId = str2ab(username);
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: "Expense Tracker",
      id: window.location.hostname,
    },
    user: {
      id: userId,
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },  // ES256
      { type: "public-key", alg: -257 } // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
    },
    timeout: 60000,
    attestation: "none",
  };

  try {
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyOptions,
    })) as PublicKeyCredential;

    if (credential) {
      const credentialIdStr = bufferToBase64(credential.rawId);
      localStorage.setItem("expense_auth_credential", credentialIdStr);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Biometric registration failed:", error);
    throw error;
  }
}

export async function authenticateBiometrics(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported in this browser.");
  }

  const storedCredentialIdStr = localStorage.getItem("expense_auth_credential");
  if (!storedCredentialIdStr) {
    throw new Error("No biometric credential found. Please set up fingerprint first.");
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  const credentialId = base64ToBuffer(storedCredentialIdStr);

  const publicKeyOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    rpId: window.location.hostname,
    allowCredentials: [
      {
        type: "public-key",
        id: credentialId,
      },
    ],
    userVerification: "required",
    timeout: 60000,
  };

  try {
    const assertion = (await navigator.credentials.get({
      publicKey: publicKeyOptions,
    })) as PublicKeyCredential;

    if (assertion) {
      return true;
    }
    return false;
  } catch (error: any) {
    console.error("Biometric authentication failed:", error);
    // Some browsers throw NotAllowedError if the user cancels the prompt.
    if (error.name === "NotAllowedError") {
      throw new Error("Authentication was cancelled or denied.");
    }
    throw error;
  }
}
