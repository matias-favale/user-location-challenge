import Input from '../Input/Input'
import {useFormik} from 'formik'
import Button from "../../components/Button/Button.tsx";
import {useState} from "react";
import {HandleUpdateLocationForm, UpdateLocationFormData} from "@/types/location.ts";
import useAuth from "@/hooks/use-auth.ts";

interface Props {
    handleFormSubmit: HandleUpdateLocationForm,
    isLoading: boolean
}

const UpdateLocationForm = ({handleFormSubmit, isLoading}: Props) => {
    const {state} = useAuth()
    const [showServerError, setShowServerError] = useState(false)

    if(!state.isLoggedIn) return

    const onError = () => {
        setShowServerError(true)
    }

    const onSubmit = (data: {}) => {
        console.log("Saving!")
        handleFormSubmit(data, onError)
    }

    const {
        errors,
        isValid,
        touched,
        handleSubmit,
        getFieldProps
    } = useFormik<UpdateLocationFormData>({
        initialValues: {
            positionX: state?.user?.positionX || 0,
            positionY: state?.user?.positionY || 0,
            distance: state?.user?.distance || 0
        },
        onSubmit,
        // validationSchema: idDetailsSchema,
    })

    return (
        <>
            <span className="text-sm">Enter your location data, negative numbers are valid.</span>
            <div>
                <form noValidate onSubmit={handleSubmit}>
                    <Input label="Position X"
                           required
                           isTouched={touched.positionX}
                           errorMessage={errors.positionX}
                           {...getFieldProps('positionX')}/>
                    <Input label="Position Y"
                           required
                           isTouched={touched.positionY}
                           errorMessage={errors.positionY}
                           {...getFieldProps('positionY')}/>
                    <Input label="Desired Distance"
                           required
                           isTouched={touched.distance}
                           errorMessage={errors.distance}
                           {...getFieldProps('distance')}/>

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!isValid}
                        className="my-4"
                    >
                        Save Location
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

export default UpdateLocationForm;