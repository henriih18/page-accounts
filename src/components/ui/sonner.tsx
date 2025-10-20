/* "use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
 */

"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      closeButton={false}
      style={{
        "--success-bg": "#dcfce7",    // verde claro
        "--success-text": "#166534",  // verde oscuro
        "--success-border": "#4ade80",
        "--error-bg": "#fee2e2",      // rojo claro
        "--error-text": "#991b1b",    // rojo oscuro
        "--error-border": "#f87171",
        "--warning-bg": "#fef3c7",    // amarillo claro
        "--warning-text": "#78350f",  // amarillo oscuro
        "--warning-border": "#fbbf24",
        "--info-bg": "#dbEafe",       // azul claro
        "--info-text": "#1e40af",     // azul oscuro
        "--info-border": "#60a5fa",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }
