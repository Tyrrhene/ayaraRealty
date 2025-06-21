import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return <span className={clsx('text-5xl font-bold text-[#ba954e]', className)}>Ayara Realty</span>
}
