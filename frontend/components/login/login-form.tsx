"use client"

import { useState } from "react"
import { Eye, EyeOff, GalleryVerticalEnd, AlertCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/auth-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

/* -----------------------------
   Component
----------------------------- */

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const { login: apiLogin, loading, error } = useAuth()

  const loginStore = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  /* -----------------------------
     Submit Handler
  ----------------------------- */

  const onSubmit = async (data: LoginFormData) => {
    const result = await apiLogin(data)

    if (!result) return

    const token = result.data.token
    const user = result.data.user

    /**
     * Save token + user in Zustand
     */
    loginStore(result.data.user, result.data.token)

    /**
     * Redirect to feed
     */
    router.replace("/feed")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Header */}

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>

            <h1 className="text-xl font-bold">Welcome Back</h1>

            <FieldDescription>
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline">
                Sign up
              </a>
            </FieldDescription>
          </div>

          {/* Email */}

          <Field>
            <FieldLabel>Email</FieldLabel>

            <Input
              type="email"
              placeholder="m@example.com"
              {...register("email")}
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

          {/* Server Error */}

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}

          <Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
