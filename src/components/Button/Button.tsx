import React, { RefObject, forwardRef } from 'react'

import LoadingSpinner from '@/assets/icons/tube-spinner.svg?react'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
    children: React.ReactNode
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
    (props: Props, ref) => {
        const { className, children, disabled, isLoading, ...rest } = props

        return (
            <button
                type="button"
                className={className}
                disabled={disabled || isLoading}
                ref={ref as RefObject<HTMLButtonElement>}
                {...rest}
            >
                {isLoading ? (
                    <LoadingSpinner className="inline-block h-5" />
                ) : (
                    children
                )}
            </button>
        )
    }
)

export default Button
