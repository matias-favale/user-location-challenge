import React, {forwardRef, RefObject} from 'react'

import classnames from 'classnames'
import Spinner from "@/components/Spinner/Spinner.tsx";


interface Props extends React.ComponentPropsWithoutRef<'button'> {
    children: React.ReactNode
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
    (props: Props, ref) => {
        const {className, children, disabled, isLoading, ...rest} = props

        return (
            <button
                type="button"
                className={classnames('bg-green-700 py-2 transition duration-500 px-4 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 focus:ring-4 focus:ring-green-light focus:outline-green-800', className)}
                disabled={disabled || isLoading}
                ref={ref as RefObject<HTMLButtonElement>}
                {...rest}
            >
                {isLoading ? (
                    <Spinner/>
                ) : (
                    children
                )}
            </button>
        )
    }
)

export default Button
