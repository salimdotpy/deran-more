import React, { useEffect, useState } from "react";
import Layout from "../ui/admin/layout";
import { LogoFavicon, Seo } from "../ui/admin/settings";
import { fetchSetting } from "../utils";

export default function SettingLogoFavicon() {
    const [data, setData] = useState(null);
    document.title = 'Logo & Favicon - DeranMore';
    const fetchData = async () => {
        const snapshot = await fetchSetting('logo_favicon.image');
        setData(snapshot);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Layout>
            {data && <LogoFavicon image={data} />}
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