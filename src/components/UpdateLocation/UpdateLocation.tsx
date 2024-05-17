import UpdateLocationForm from "@/components/UpdateLocationForm/UpdateLocationForm.tsx";
import {UpdateLocationRequest} from "@/types/location.ts";
import {updateLocation} from "@/client/updateLocation.ts";
import useAuth from "@/hooks/use-auth.ts";
import {useMutation} from "@tanstack/react-query";

const UpdateLocation = () => {
    const {dispatch} = useAuth()
    const mutation = useMutation({
        mutationFn: (data: Partial<UpdateLocationRequest>) => {
            return updateLocation(data)
        },
        onSuccess: (user) => {
            dispatch({
                payload: {user: user, isLoggedIn: true}
            })
        }
    })

    const handleUpdateLocationSubmit = async (data: Partial<UpdateLocationRequest>) => {
        mutation.mutate(data)
    }

    return (
        <>
            <div className="max-w-fit">
                <UpdateLocationForm handleFormSubmit={handleUpdateLocationSubmit} isLoading={mutation.isPending}/>
            </div>
        </>
    )
}

export default UpdateLocation;