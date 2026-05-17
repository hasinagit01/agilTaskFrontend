import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email obligatoire')
    .email('Email invalide'),
  password: z.string()
    .min(1, 'Mot de passe obligatoire')
    .min(6, 'Minimum 6 caractères'),
})

export const registerSchema = z.object({
  email: z.string()
    .min(1, 'Email obligatoire')
    .email('Email invalide'),
  password: z.string()
    .min(1, 'Mot de passe obligatoire')
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[a-z]/, 'Au moins une minuscule')
    .regex(/\d/, 'Au moins un chiffre'),
  confirmPassword: z.string()
    .min(1, 'Confirmation obligatoire'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})
