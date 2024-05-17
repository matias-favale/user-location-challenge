import Input from '../Input/Input'
import {HandleRegisterUserForm, UserRegistrationFormData} from "@/types/user-location.ts";
import {useFormik} from 'formik'
import Button from "../../components/Button/Button.tsx";
import {useState} from "react";

interface Props {
    handleFormSubmit: HandleRegisterUserForm
    isLoading: boolean
}

const RegisterUserForm = ({handleFormSubmit, isLoading = false}: Props) => {
    const [showServerError, setShowServerError] = useState(false)

    console.log(`RegisterUserForm isLoading ${isLoading}`)

    const onError = (apiError?: {}) => {
        setShowServerError(true)
        if(apiError) setErrors(apiError);
    }

    const onSubmit = (data: {}) => {
        console.log("Saving!")
        handleFormSubmit(data, onError)
    }

    const {
        errors,
        setErrors,
        // isSubmitting,
        // setSubmitting,
        isValid,
        touched,
        handleSubmit,
        getFieldProps
    } = useFormik<UserRegistrationFormData>({
        initialValues: {username: ''},
        onSubmit,
        // validationSchema: idDetailsSchema,
    })

    // setSubmitting(isLoading)

    return (
        <>
            <div>
                <form noValidate onSubmit={handleSubmit}>
                    <Input label="Username"
                           required
                           isTouched={touched.username}
                           errorMessage={errors.username}
                           {...getFieldProps('username')}/>

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!isValid}
                        className="my-4"
                    >
                        Register
                    </Button>

                    {showServerError && (
                        <p className="text-red-600 text-sm mt-4">
                            Whoops! We encountered an unexpected error. Try again later or
                            contact support.
                        </p>
                    )}
                </form>
            </div>
        </>
    )
}

export default RegisterUserForm;