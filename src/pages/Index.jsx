import React from "react";
import MainLayout from "../ui/container";
import { AboutSection, CatchySection, ContactSection, FooterSection, HeroSection, PaymentSection, ServiceSection } from "../ui/sections";

export default function Index() {
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