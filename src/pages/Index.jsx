import React from "react";
import MainLayout from "../ui/container";
import { AboutSection, ContactSection, FooterSection, HeroSection, ServiceSection } from "../ui/sections";

export default function Index() {
    return (
        <MainLayout sitename={'Deran More'}>
            <HeroSection />
            <AboutSection />
            <ServiceSection />
            <ContactSection />
            <FooterSection />
        </MainLayout>
    )
}