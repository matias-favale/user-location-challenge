
import { Link } from 'react-router-dom'

const ErrorElement = () => {
    return (
        <>
            <div>
                <h1>Oops! Something went wrong.</h1>

                <Link to={'/'}>
                    Go to Home
                </Link>
            </div>
        </>
    )
}

export default ErrorElement
