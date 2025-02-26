import React from "react";
import MainLayout from "../ui/container";
import { AboutSection, ContactSection, FooterSection, HeroSection, PaymentSection, ServiceSection } from "../ui/sections";

export default function Index() {
    return (
        <MainLayout sitename={'Deran More'}>
            <HeroSection />
            <AboutSection />
            <ServiceSection />
            <PaymentSection />
            <ContactSection />
            <FooterSection />
        </MainLayout>
    )
}