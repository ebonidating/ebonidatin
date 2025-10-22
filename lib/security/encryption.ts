// Encryption utilities for sensitive data

export const encryptSensitiveData = async (data: string, key: string): Promise<string> => {
  // In production, use a proper encryption library like TweetNaCl.js or libsodium.js
  // This is a placeholder for demonstration
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const keyBuffer = encoder.encode(key)

  // Use SubtleCrypto for encryption
  const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, ["encrypt"])

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, dataBuffer)

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encryptedData), iv.length)

  return btoa(String.fromCharCode(...combined))
}

export const decryptSensitiveData = async (encryptedData: string, key: string): Promise<string> => {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  const combined = new Uint8Array(
    atob(encryptedData)
      .split("")
      .map((c) => c.charCodeAt(0)),
  )
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)

  const keyBuffer = encoder.encode(key)
  const cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, ["decrypt"])

  const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, data)

  return decoder.decode(decryptedData)
}
