"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-green-600" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-600" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-yellow-600" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-600" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast border shadow-lg !px-4 !py-3",
          success: "!bg-green-50 !border-green-200 !text-green-900 dark:!bg-green-950 dark:!border-green-800 dark:!text-green-100",
          error: "!bg-red-50 !border-red-200 !text-red-900 dark:!bg-red-950 dark:!border-red-800 dark:!text-red-100",
          info: "!bg-blue-50 !border-blue-200 !text-blue-900 dark:!bg-blue-950 dark:!border-blue-800 dark:!text-blue-100",
          warning: "!bg-yellow-50 !border-yellow-200 !text-yellow-900 dark:!bg-yellow-950 dark:!border-yellow-800 dark:!text-yellow-100",
          description: "!text-current/70",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
