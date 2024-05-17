import {UsersNearMeResponse} from "@/types/location.ts";
import {listUsersNearMe} from "@/client/listUsersNearMe.ts";
import {useEffect, useState} from "react";
import Spinner from "@/components/Spinner/Spinner.tsx";
import useAuth from "@/hooks/use-auth.ts";
import {useMutation} from "@tanstack/react-query";

const ListNearMeUsers = () => {
    const {state} = useAuth()

    if (!state.isLoggedIn) return

    const [usersNearMe, setUsersNearMe] = useState<UsersNearMeResponse[]>()

    const mutation = useMutation({
        mutationFn: listUsersNearMe,
        onSuccess: (usersNearMe: UsersNearMeResponse[]) => {

            setUsersNearMe(usersNearMe)
        }
    })
    useEffect(() => {
        if (state?.user && ('positionX' in state.user && 'positionY' in state?.user && 'distance' in state.user)) {
            mutation.mutate()
        }
    }, [state?.user]);

    if (mutation.isPending) {
        return (
            <Spinner/>
        )
    }

    return (
        <>
            <div className="mt-2">
                <h2>Users nearby:</h2>
            </div>
            {Array.isArray(usersNearMe) && usersNearMe.length === 0 &&
                <>
                    <span className="text-sm">
                        It looks like there are no users near you, make sure your location data is updated or try a higher distance.
                    </span>
                    <br/>
                    <span className="text-sm">Note: Data may be updating in the server, so try again after a few seconds.</span>
                </>

            }

            {/*{!missingLocationData && (*/}
            {Array.isArray(usersNearMe) && usersNearMe.length > 0 && (
                <div className="grid grid-cols-6 gap-4">
                    {
                        usersNearMe
                            .sort((userNear1, userNear2) => userNear1.ud_distance - userNear2.ud_distance)
                            .map((userNear) => {
                                    const otherUserPx = userNear.userOneId === state?.user?.id ? userNear.u1_positionX : userNear.u2_positionX
                                    const otherUserPy = userNear.userOneId === state?.user?.id ? userNear.u1_positionY : userNear.u2_positionY
                                    const username = userNear.userOneId === state?.user?.id ? userNear.u1_username : userNear.u2_username

                                    return (
                                        <div
                                            className="w-44 p-6 border-2 border-blue-300 text-base/6 shadow-md shadow-gray-600 bg-blue-300 rounded-2xl">
                                            <div className="row">
                                                <div className="font-bold">{username}</div>
                                            </div>
                                            <div className="row flex justify-between">
                                                <div>X</div>
                                                <div>{otherUserPx}</div>
                                            </div>
                                            <div className="row flex justify-between">
                                                <div>Y</div>
                                                <div>{otherUserPy}</div>
                                            </div>
                                            <div className="row flex justify-between">
                                                <div>Distance</div>
                                                <div>{userNear.ud_distance.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                    }
                </div>
            )}
        </>
    )
}

export default ListNearMeUsers