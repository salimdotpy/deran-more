import React, { useEffect, useState } from "react";
import Layout from "../ui/admin/layout";
import { LogoFavicon, Seo } from "../ui/admin/settings";
import { fetchSetting } from "../utils";
import { useDidMount, useDocumentTitle } from "../hooks";
import { FormSkeleton } from "../ui/sections";

export default function SettingLogoFavicon() {
    useDocumentTitle('Logo & Favicon - DeranMore')
    const didMount = useDidMount();
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const snapshot = await fetchSetting('logo_favicon.image');
        setData(snapshot);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Layout>
            {didMount && data ? <LogoFavicon image={data} /> : <FormSkeleton className='!p-0' size={10} />}
        </Layout>
    )
}

export function SettingSeo() {
    useDocumentTitle('Seo - DeranMore')
    const didMount = useDidMount();
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const snapshot = await fetchSetting('seo.data');
        setData(snapshot);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Layout>
            {didMount && data ? <Seo data={data} /> : <FormSkeleton className='!p-0' size={10} />}
        </Layout>
    )
}