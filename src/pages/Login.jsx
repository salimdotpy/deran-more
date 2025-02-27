
import React from "react";
import { AuthLayout } from "../ui/container";
import AdminLogin from "../ui/admin/login";
export default function Login() {
    return (
        <AuthLayout phrase="Hi, Welcome Back">
            <AdminLogin />
        </AuthLayout>
    )
}