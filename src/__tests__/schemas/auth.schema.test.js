import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/schemas/auth.schema'

describe('loginSchema', () => {
  it('valide des identifiants corrects', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejette un email invalide', () => {
    const result = loginSchema.safeParse({ email: 'pas-un-email', password: 'secret123' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('email')
  })

  it('rejette un email vide', () => {
    const result = loginSchema.safeParse({ email: '', password: 'secret123' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('email')
  })

  it('rejette un mot de passe trop court', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('password')
  })

  it('rejette un mot de passe vide', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validData = {
    email: 'user@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  }

  it('valide des données correctes', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true)
  })

  it('rejette si confirmPassword ne correspond pas', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: 'Autre1' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('confirmPassword')
    expect(result.error.issues[0].message).toBe('Les mots de passe ne correspondent pas')
  })

  it('rejette un mot de passe sans majuscule', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'password1',
      confirmPassword: 'password1',
    })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('password')
  })

  it('rejette un mot de passe sans minuscule', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'PASSWORD1',
      confirmPassword: 'PASSWORD1',
    })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('password')
  })

  it('rejette un mot de passe sans chiffre', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'PasswordOnly',
      confirmPassword: 'PasswordOnly',
    })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('password')
  })

  it('rejette un mot de passe trop court', () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: 'Pass1',
      confirmPassword: 'Pass1',
    })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('password')
  })

  it('rejette un email invalide', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'pas-valide' })
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('email')
  })
})
