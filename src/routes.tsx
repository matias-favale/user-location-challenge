import { createBrowserRouter } from 'react-router-dom'

import { Suspense } from 'react'
import PageLoading from "./components/PageLoading/PageLoading.tsx";
import ErrorElement from "./pages/error/ErrorElement.tsx"
import RequireAuth from './components/RequireAuth/RequireAuth.tsx';

export const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <Suspense fallback = {<PageLoading/>}>
                    <RequireAuth/>
                </Suspense>),
            errorElement: <ErrorElement/>,
        }
])