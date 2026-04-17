import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = 'pointer',
  children,
  ...props
}) => {
  const baseClass = 'btn'
  const variantClass = `${baseClass}--variant-${variant}`
  const sizeClass = `${baseClass}--size-${size}`
  const fullWidthClass = fullWidth ? `${baseClass}--full-width` : ''

  const combinedClasses = [baseClass, variantClass, sizeClass, fullWidthClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}
