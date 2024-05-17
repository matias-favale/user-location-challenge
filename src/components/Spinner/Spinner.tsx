import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

import LoadingSpinner from '@/assets/icons/tube-spinner.svg?react'

interface Props {
    className?: string
}

const Spinner = ({ className }: Props) => {
    return (
        <LoadingSpinner
            className={twMerge(
                classNames('inline-block h-5 animate-spin', className)
            )}
        />
    )
}

export default Spinner
