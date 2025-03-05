import React, { useEffect, useState } from "react";
import Layout from "../ui/admin/layout";
import { Contents } from "../ui/admin/frontend";
import { FormSkeleton } from "../ui/sections";
import { frontSections } from "../utils/frontend";
import { useParams } from "react-router-dom";
import { useDidMount, useDocumentTitle } from "../hooks";

export default function Frontend() {
    const [data, setData] = useState(null);
    useDocumentTitle('Frontend Setting - DeranMore');
    const didMount = useDidMount();
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
            {didMount && data ? <Contents data={data} /> : <FormSkeleton className='!p-0' size={10} />}
        </Layout>
    )
}