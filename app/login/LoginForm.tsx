'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormBuilder, { FormConfiguration } from '../FormBuilder';
import { loginUser } from '@/app/api';
export type LoginResponse = { user?: unknown; error?: string };

export const loginFormConfiguration: FormConfiguration = {
  layout: [
    ['email'],
    ['password'],
  ],
  config: {
    email: {
      component: 'text',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      validation: { required: true },
    },
    password: {
      component: 'text',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      validation: { required: true },
    },
  },
};

export type LoginFormProps = {
  onSubmit?: (values: Record<string, string>) => LoginResponse | Promise<LoginResponse>;
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
  submitLabel?: string;
  className?: string;
  redirectTo?: string;
};

export default function LoginForm({
  onSubmit,
  onSuccess,
  onError,
  submitLabel = 'Log In',
  className = '',
  redirectTo = '/',
}: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: Record<string, string>) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = onSubmit ? await onSubmit(values) : await loginUser(values);
      if (!data?.user) throw new Error(data?.error || "Invalid email or password.");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("user-updated"));
      setSuccess("Login successful! Redirecting...");
      onSuccess?.(data);
      if (redirectTo) router.push(redirectTo);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password.';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm" role="status">
          {success}
        </div>
      )}
      <FormBuilder
        configuration={loginFormConfiguration}
        initialValues={{ email: 'seller@example.com', password: 'n5dealpass' }}
        onSubmit={handleSubmit}
        submitLabel={loading ? 'Signing In...' : submitLabel}
        className={className}
      />
      <div className={"pt-3"}>Accounts:</div>
      <div>seller@example.com</div>
      <div>buyer@example.com</div>
      <div>manager@example.com</div>
    </div>
  );
}
