import React from "react";
import Layout from "../ui/admin/layout";
import { Contents } from "../ui/admin/frontend";

export default function Frontend() {
    document.title = 'Frontend Setting - DeranMore';
    return (
        <Layout>
            <Contents />
        </Layout>
    )
}