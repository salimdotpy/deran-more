import React from "react";
import { AboutsSection, FooterSection } from "../ui/sections";
import MainLayout from "../ui/container";

export default function About() {
    return (
        <MainLayout sitename={'Deran More'}>
            <AboutsSection />
            <FooterSection />
        </MainLayout>
    )
}