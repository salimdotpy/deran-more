import React from "react";
import { AboutsSection, FooterSection } from "../ui/sections";
import MainLayout from "../ui/container";
import { useDocumentTitle } from "../hooks";

export default function About() {
    useDocumentTitle('About us - DeranMore');
    return (
        <MainLayout sitename={'Deran More'}>
            <AboutsSection />
            <FooterSection />
        </MainLayout>
    )
}