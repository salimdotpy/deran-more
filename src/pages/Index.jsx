import React, { useEffect, useState } from "react";
import MainLayout from "../ui/container";
import { AboutSection, ContactSection, FooterSection, HeroSection, PaymentSection, ServiceSection } from "../ui/sections";

export default function Index() {
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const snapshot = await frontSections(params);
        setData(snapshot);
    };

    useEffect(() => {
        setData(null);
        fetchData();
    }, []);
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