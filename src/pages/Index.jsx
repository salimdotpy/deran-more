import React from "react";
import MainLayout from "../ui/container";
import { AboutSection, CatchySection, ContactSection, FooterSection, HeroSection, PaymentSection, ServiceSection } from "../ui/sections";
import { useDocumentTitle } from "../hooks";

export default function Index() {
    useDocumentTitle('Deran More');
    return (
        <MainLayout sitename={'Deran More'}>
            <HeroSection />
            <AboutSection />
            <CatchySection />
            <ServiceSection />
            <PaymentSection />
            <ContactSection />
            <FooterSection />
        </MainLayout>
    )
}