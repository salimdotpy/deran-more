import React from "react";
import Layout from "../ui/admin/layout";
import { useDocumentTitle } from "../hooks";
import { Password, Profile } from "../ui/admin/settings";

export default function UpdateProfile() {
    useDocumentTitle('Update Profile - DeranMore');
    return (
        <Layout>
            <Profile />
        </Layout>
    )
}

export function UpdatePassword() {
    useDocumentTitle('Update Password - DeranMore');
    return (
        <Layout>
            <Password />
        </Layout>
    )
}