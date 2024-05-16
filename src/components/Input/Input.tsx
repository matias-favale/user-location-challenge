import {ComponentPropsWithoutRef} from 'react'

import classNames from 'classnames'
import {twMerge} from 'tailwind-merge'

interface Props extends ComponentPropsWithoutRef<'input'> {
    label?: string
    errorMessage?: string | null
    name: string
    isTouched: boolean | undefined
}

const Input = ({
                   className,
                   label,
                   type = 'text',
                   name,
                   isTouched,
                   errorMessage,
                   required,
                   ...rest
               }: Props) => {
    const showError = isTouched && errorMessage

    return (
        <>
            <div>
                <label
                    className="relative block text-sm font-medium mb-2 text-gray-700"
                    htmlFor={name}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>

                <div className="relative">
                    <input
                        type={type}
                        id={name}
                        className={twMerge(
                            classNames(
                                'border-1 focus:ring-purple-light rounded-lg py-2 px-3 border-gray-300 focus-visible:outline-none focus:border-green-300 focus:ring-4 text-base w-full transition-shadow duration-300 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-300',
                                className,
                                {
                                    'focus:border-red-300 border-red-300': showError,
                                }
                            )
                        )}
                        {...rest}
                        name={name}
                    />
                </div>
            </div>

            <span
                data-testid="error-message"
                className="block text-sm text-red-500 pt-2"
            >
            {isTouched && errorMessage}
          </span>
        </>
    )
}

export default Input
