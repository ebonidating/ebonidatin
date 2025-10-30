// Input validation utilities for security

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number")
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain a special character (!@#$%^&*)")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .slice(0, 1000) // Limit length
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+$$$$]{10,}$/
  return phoneRegex.test(phone)
}

export const validateAge = (dateOfBirth: string): boolean => {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age >= 18 && age <= 120
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateFileSize = (sizeInBytes: number, maxSizeInMB: number): boolean => {
  return sizeInBytes <= maxSizeInMB * 1024 * 1024
}

export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase()
  return fileExtension ? allowedTypes.includes(fileExtension) : false
}
