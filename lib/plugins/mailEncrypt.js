export const handleEmailClick = (e, emailIcon, CONTACT_EMAIL) => {
  if (CONTACT_EMAIL && emailIcon && !emailIcon.current.href) {
    e.preventDefault()
    const email = decryptEmail(CONTACT_EMAIL)
    emailIcon.current.href = `mailto:${email}`
    emailIcon.current.click()
  }
}

export const encryptEmail = email => {
  return btoa(unescape(encodeURIComponent(email)))
}

/** 明文邮箱（未经过 encryptEmail / Base64） */
const PLAIN_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const decryptEmail = encryptedEmail => {
  if (encryptedEmail == null || typeof encryptedEmail !== 'string') {
    return encryptedEmail
  }
  const trimmed = encryptedEmail.trim()
  if (!trimmed) {
    return trimmed
  }
  // 配置里直接写邮箱时不再走 atob，避免 InvalidCharacterError
  if (PLAIN_EMAIL_RE.test(trimmed)) {
    return trimmed
  }
  try {
    return decodeURIComponent(escape(atob(trimmed)))
  } catch {
    // 非合法 Base64 或解码失败时按原样使用（兼容历史明文配置）
    return trimmed
  }
}
