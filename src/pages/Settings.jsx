import React from "react";
import Layout from "../ui/admin/layout";
import { LogoFavicon, Seo } from "../ui/admin/settings";

export default function SettingLogoFavicon() {
    document.title = 'Logo & Favicon - DeranMore';
    return (
        <Layout>
            <LogoFavicon />
        </Layout>
    )
}

export function SettingSeo() {
    document.title = 'Seo - DeranMore';
    return (
        <Layout>
            <Seo />
        </Layout>
    )
}