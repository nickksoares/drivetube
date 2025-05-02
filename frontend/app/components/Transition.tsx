'use client'

import React, { useState, useEffect, useRef } from 'react'

interface TransitionProps {
  show: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  children: React.ReactNode
  className?: string
  duration?: number
  onEnter?: () => void
  onEntered?: () => void
  onExit?: () => void
  onExited?: () => void
}

export default function Transition({
  show,
  enter = 'transition-opacity duration-300',
  enterFrom = 'opacity-0',
  enterTo = 'opacity-100',
  leave = 'transition-opacity duration-300',
  leaveFrom = 'opacity-100',
  leaveTo = 'opacity-0',
  children,
  className = '',
  duration = 300,
  onEnter,
  onEntered,
  onExit,
  onExited
}: TransitionProps) {
  const [isRendered, setIsRendered] = useState(show)
  const [classes, setClasses] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (show) {
      // Enter transition
      setIsRendered(true)
      onEnter?.()
      
      // Apply enter classes
      setClasses(`${enter} ${enterFrom} ${className}`)
      
      // Force a reflow to make the transition work
      document.body.offsetHeight
      
      // Apply enter-to classes
      timeoutRef.current = setTimeout(() => {
        setClasses(`${enter} ${enterTo} ${className}`)
        
        // Transition complete
        timeoutRef.current = setTimeout(() => {
          onEntered?.()
        }, duration)
      }, 10)
    } else if (isRendered) {
      // Exit transition
      onExit?.()
      
      // Apply leave classes
      setClasses(`${leave} ${leaveFrom} ${className}`)
      
      // Force a reflow to make the transition work
      document.body.offsetHeight
      
      // Apply leave-to classes
      timeoutRef.current = setTimeout(() => {
        setClasses(`${leave} ${leaveTo} ${className}`)
        
        // Transition complete
        timeoutRef.current = setTimeout(() => {
          setIsRendered(false)
          onExited?.()
        }, duration)
      }, 10)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [show, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo, className, duration, onEnter, onEntered, onExit, onExited])

  if (!isRendered) {
    return null
  }

  return (
    <div className={classes}>
      {children}
    </div>
  )
}
