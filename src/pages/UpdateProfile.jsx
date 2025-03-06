import React from "react";
import Layout from "../ui/admin/layout";
import { useDocumentTitle } from "../hooks";
import { useAuth } from "../ui/AuthContext";
import { Profile } from "../ui/admin/settings";

export default function UpdateProfile() {
    useDocumentTitle('Update Profile - DeranMore');
    const {user, loading} = useAuth();
    
    if (loading) return <p>Loading...</p>;
    return (
        <Layout>
            <Profile />
        </Layout>
    )
}