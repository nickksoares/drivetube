'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  className?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  }

  const colorClasses = {
    primary: 'border-yellow-500',
    white: 'border-white',
    gray: 'border-gray-300'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50'
    : ''

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
