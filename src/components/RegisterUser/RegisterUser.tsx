import RegisterUserForm from "@/components/RegisterUserForm/RegisterUserForm.tsx";
import {UserRegistrationRequest} from "@/types/user-location.ts";
import {register} from "@/client/register.ts";
import {useMutation} from "@tanstack/react-query";
import useAuth from "@/hooks/use-auth.ts";

const RegisterUser = () => {
    const {dispatch} = useAuth()
    const mutation = useMutation({
        mutationFn: (data: Partial<UserRegistrationRequest>) => {
            return register(data)
        },
        onSuccess: (user) => {
            dispatch({
                payload: {user: user, isLoggedIn: true}
            })
        }
    })

    const handleSubmit = (data: Partial<UserRegistrationRequest>, onError?: (apiError?: {}) => void) => {
        mutation.mutate(data);

        if (mutation.error && onError) onError(mutation.error)
    }

    return <>
        <div className="max-w-fit">
            <RegisterUserForm handleFormSubmit={handleSubmit} isLoading={mutation.isPending}/>
        </div>
    </>
}

export default RegisterUser;