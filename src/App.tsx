import { RouterProvider } from 'react-router-dom'

import { router } from './routes'
import {AuthProvider} from "@/context/AuthContext.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // retry: getQueryRetry,
            staleTime: 1000 * 60 * 5,
            // cacheTime: 1000 * 60 * 5,
        },
    },
})

const App = () => {
    return (<>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    </>)
}

export default App