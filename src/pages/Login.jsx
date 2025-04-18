
import React from "react";
import { AuthLayout } from "../ui/container";
import AdminLogin from "../ui/admin/login";
import { useDocumentTitle } from "../hooks";
export default function Login() {
    useDocumentTitle('Login - DeranMore')
    return (
        <AuthLayout phrase="Hi, Welcome Back">
            <AdminLogin />
        </AuthLayout>
    )
}