import React, { Suspense, useEffect, useState } from "react";
import Layout from "../ui/admin/layout";
import { Contents } from "../ui/admin/frontend";
import { FormSkeleton } from "../ui/sections";
import { frontSections } from "../utils/frontend";
import { useParams } from "react-router-dom";

export default function Frontend() {
    const [data, setData] = useState(null);
    document.title = 'Frontend Setting - DeranMore';
    let params = useParams();
    params = params.type;
    const fetchData = async () => {
        const snapshot = await frontSections(params);
        setData(snapshot);
    };

    useEffect(() => {
        setData(null);
        fetchData();
    }, [params]);

    return (
        <Layout>
            <Suspense fallback={<FormSkeleton />}>
                {data && <Contents data={data} />}
            </Suspense>
        </Layout>
    )
}