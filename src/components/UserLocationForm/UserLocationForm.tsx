import Input from '../Input/Input'
import {UserLocation} from "../../types/user-location.ts";
import {useFormik} from 'formik'
import Button from "../../components/Button/Button.tsx";

interface Props {
    initialValues?: UserLocation
}

const UserLocationForm = ({initialValues = {
    username: ''
}}: Props) => {

    const onSubmit = () => {
        console.log("Saved!")
    }

    const {
        errors,
        isSubmitting,
        isValid,
        touched,
        getFieldProps
    } = useFormik<UserLocation>({
        initialValues,
        onSubmit,
        // validationSchema: idDetailsSchema,
    })

    return (
        <>
            <div>
                <Input label="Username"
                       required
                       isTouched={touched.username}
                       errorMessage={errors.username}
                       {...getFieldProps('username')}/>

                <Button
                    type="button"
                    isLoading={isSubmitting}
                    disabled={!isValid}
                >
                    Submit
                </Button>
            </div>
        </>
    )
}

export default UserLocationForm;