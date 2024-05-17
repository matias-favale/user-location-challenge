import PageLoading from "@/components/PageLoading/PageLoading.tsx";
import {login} from "@/client/login.ts";
import ListNearMeUsers from "@/components/ListNearMeUsers/ListNearMeUsers.tsx";
import useAuth from "@/hooks/use-auth.ts";
import RegisterUser from "@/components/RegisterUser/RegisterUser.tsx";
import {AxiosError} from "axios";
import {useEffect, useState} from "react";
import UpdateLocation from "@/components/UpdateLocation/UpdateLocation.tsx";

const RequireAuth = () => {
    const {state, dispatch} = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        const getCurrentUser = async () => {
            try {
                const response = await login();
                if (response.data) {
                    dispatch({
                        payload: {user: response.data, isLoggedIn: true}
                    })
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error?.response?.status === 404 || error?.status === 404) {
                        console.log("User does not exist.")
                    } else {
                        console.error("Login API error.", error)
                    }
                } else {
                    console.error("Unexpected login error.", error)
                }
            }
            setIsLoading(false)
        }

        getCurrentUser()
    }, [dispatch]);

    if (isLoading) {
        return <PageLoading/>
    }

    // if (!state.isLoggedIn) {
    //     return (
    //         <>
    //             <h1>Welcome to your location site ! </h1>
    //             <RegisterUser/>
    //         </>
    //     )
    // }

    return (
        <>
            <div className="w-full h-full bg-blue-200 px-28 py-20">
                <div className="my-5 mt-5">
                    {
                        !state.isLoggedIn && (
                            <>
                                <h1>Welcome to your location site ! </h1>
                                <div className="py-8">
                                    <RegisterUser/>
                                </div>
                            </>
                        )
                    }

                    {state.isLoggedIn && (
                        <>
                            <h2>Hi {state.user?.username} !</h2>
                            <div className="py-8">
                                <UpdateLocation/>

                                <ListNearMeUsers/>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default RequireAuth