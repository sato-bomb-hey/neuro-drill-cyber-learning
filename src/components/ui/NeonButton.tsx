import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'blue' | 'green' | 'red' | 'purple' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  blue: 'border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-cyber-black shadow-neon-blue hover:shadow-neon-blue',
  green: 'border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-black shadow-neon-green hover:shadow-neon-green',
  red: 'border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-black shadow-neon-red hover:shadow-neon-red',
  purple: 'border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-cyber-black',
  yellow: 'border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow hover:text-cyber-black',
}

const sizeStyles = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-6 py-2 text-base',
  lg: 'px-8 py-3 text-lg',
}

export function NeonButton({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
  disabled,
  ...props
}: NeonButtonProps) {
  return (
    <button
      className={`
        border font-mono tracking-wider
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
