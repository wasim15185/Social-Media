"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, AlertCircleIcon } from "lucide-react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/auth-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Alert, AlertDescription } from "@/components/ui/alert"

/* -----------------------------
   Validation Schema
----------------------------- */

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupData = z.infer<typeof signupSchema>

/* -----------------------------
   Component
----------------------------- */

export function SignupForm() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register: registerUser, loading, error } = useAuth()

  const loginStore = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  })

  /* -----------------------------
     Submit Handler
  ----------------------------- */

  const onSubmit = async (data: SignupData) => {
    const { confirmPassword, ...payload } = data

    const result = await registerUser(payload)

    if (!result) return

    /**
     * Save user + token in Zustand
     */
    loginStore(result.data.user, result.data.token)

    /**
     * Redirect to feed
     */
    router.replace("/feed")
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your account</CardTitle>

        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Server Error */}

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}

            <Field>
              <FieldLabel>Full Name</FieldLabel>

              <Input {...register("name")} placeholder="John Doe" />

              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* Username */}

            <Field>
              <FieldLabel>Username</FieldLabel>

              <Input {...register("username")} placeholder="john_doe" />

              {errors.username && (
                <FieldDescription className="text-red-500">
                  {errors.username.message}
                </FieldDescription>
              )}
            </Field>

            {/* Email */}

            <Field>
              <FieldLabel>Email</FieldLabel>

              <Input
                type="email"
                {...register("email")}
                placeholder="johndoe@email.com"
              />

              {errors.email && (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            {/* Password */}

            <Field>
              <FieldLabel>Password</FieldLabel>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <FieldDescription className="text-red-500">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>

            {/* Confirm Password */}

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>

              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <FieldDescription className="text-red-500">
                  {errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>

            {/* Submit */}

            <Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Field>

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}