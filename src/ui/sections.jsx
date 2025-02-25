import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, CardBody, Input, Textarea, Typography } from '@material-tailwind/react';
import { Link, useLocation, useNavigation } from 'react-router-dom';
import { BiLogoWhatsapp, BiSupport } from 'react-icons/bi';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { EnvelopeIcon, MapPinIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const cls = ['!text-fore peer-focus:pl-0 peer-focus:before:!border-primary/90 peer-focus:after:!border-primary/90', 'text-fore focus:border-primary/90 placeholder:opacity-100'];
const logo = '/images/logoIcon/logo.png'

export function LoadingComponent() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500); // Simulated loading time
        return () => clearTimeout(timeout);
    }, []);
    return (
        loading && (
        <div className='fixed inset-0 bg-primary/50 flex gap-2 justify-center items-center z-[1000]'>
            {[10, 12, 14].map((size, key) => 
            <img key={key} src={logo} alt='company logo' className={`size-${size} animate-bounce p-1 bg-white rounded-full shadow`} />
            )}
        </div>
        )
    )
}

const slider_img = 'images/img1.jpeg';
export const HeroSection = ({ data }) => {
    let heading = data?.heading;
    heading = heading && heading.split('<br />').map((head, key) =>
        <span key={key}>{head}<br /></span>
    )
    return (
        <div id="hero" style={{ backgroundImage: `url(${slider_img})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'top center' }} className='h-screen md:h-[80vh] bg-no-repeat relative'>
            <div className='absolute flex w-full h-screen md:h-[80vh] bg-black bg-opacity-40'>
                <div className='container m-auto text-white px-4 md:px-0'>
                    <Typography variant='h1' className="text-2xl md:text-4xl lg:text-5xl" data-aos="fade-left" data-aos-delay={100}>
                        Achieve Academic Success and Excellence
                    </Typography>
                    <Typography variant='h6' className='mt-3 mb-7 text-sm md:text-lg lg:text-2xl text-gray-200' data-aos="fade-right" data-aos-delay={200}>
                        With DeranMore Educational Consult Services
                    </Typography>
                    <a href={"/#about"} data-aos="fade-up" data-aos-delay={300}>
                        <Button className="rounded-full border-white hover:border-primary border-2 bg-transparent hover:bg-primary">
                            Learn More
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export const AboutSection = ({ data }) => {
    return (
        <section id='about' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-5 px-4'>
                    <div className='h-1/2 md:flex-1 basis-[100%] flex flex-col gap-y-4 p-5' data-aos="fade-right">
                        <h3 className='text-primary font-bold text-2xl font-[tahoma]'>
                            DeranMore
                            <br />
                            <span className='text-fore text-lg'>
                                Educational Consult Services
                            </span>
                        </h3>
                        <p className='text-fore/80 text-justify'> 
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit Asperiores dolores sed et. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit Asperiores dolores sed et.
                        </p>
                    </div>
                    <div data-aos="fade-left" className='relative md:flex-1 basis-[100%]' style={{backgroundImage: `url(images/img3.jpeg)`, backgroundSize: 'cover',}}>
                        <div className='absolute inset-0 from-header to-transparent bg-gradient-to-r'>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const ServiceSection = ({ content, elements }) => {
    elements = [
        {data_values: {Icon: QuestionMarkCircleIcon, title: 'Professional Guidance On:', description: ' Dissertation Writting, Thesis Development, Journal Publication Preparation etc.'}},
        {data_values: {Icon: BiSupport, title: 'Expert Assistance', description: 'Improve Research Design & Methodology, Enhance data analysis and interperation, Develop well-structured and coherent manuscripts.'}},
    ]
    return (
        <section id='services' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>Our Services</h3>
                    <p className='text-fore/80 my-4'>
                        We are rendering below Services
                    </p>
                </div>
                <div className='flex flex-wrap p-4 w-full'>
                    {elements && elements.map((service, key) =>{
                        const ServiceIcon = service.data_values.Icon;
                        const sub_services = service.data_values.description.split(',').map((sub_, i)=>
                        <p key={i}>&rArr; {sub_}</p>
                        );
                        return (
                        <div key={key} className='text-fore mb-8 w-full md:flex-1 lg:w-1/3 md:w-1/2 group' data-aos="fade-up" data-aos-delay={`${key}00`}>
                            <div className='float-left flex justify-center items-center size-14 border border-primary bg-primary rounded-full text-header group-hover:bg-header group-hover:text-primary transition-colors duration-1000'>
                                <ServiceIcon className='size-6' />
                            </div>
                            <Typography variant='h6' className='ml-20'>
                                {service.data_values.title}
                            </Typography>
                            <Typography as={'div'} className='ml-20'>
                                {sub_services}
                            </Typography>
                        </div>)
                    })}
                </div>
            </div>
        </section>
    );
};

export const FooterSection = ({ data }) => {
    const socialLinks = [
        {data_values: {social_icon: BiLogoWhatsapp, social_link: 'https://wa.me/+'}},
        {data_values: {social_icon: EnvelopeIcon, social_link: 'mailto:deranmore@hotmail.com'}},
        {data_values: {social_icon: PhoneIcon, social_link: 'tel:+18329844722,'}},
    ]
    return (
        <section id='' className='py-5 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap items-center justify-center md:justify-between gap-5 px-4'>
                    <div>
                        © Copyright <b>DeranMore.</b> All Rights Reserved
                    </div>
                    <div className='flex gap-x-3 text-2xl'>
                        {socialLinks && socialLinks.map(({ data_values }, key) => {
                            const SIcon = data_values?.social_icon
                            return (
                                <Link to={data_values?.social_link || '/'} key={key} className='hover:text-primary/60 text-primary/90'>
                                    {SIcon && <SIcon className='size-5' />}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export const ContactSection = ({ data }) => {
    const contact_info = [
        {title: 'Phone', desc: '+18329844722, +2348034066961', Icon: PhoneIcon},
        {title: 'Email', desc: 'deranmore@hotmail.com', Icon: EnvelopeIcon},
        {title: 'Address', desc: 'Ede, Osun State.', Icon: MapPinIcon},
    ]
    return (
        <section id='contact' className='pt-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>Contact Us</h3>
                    <p className='text-fore/80 my-4'>
                        Contact Us Today to Know more
                    </p>
                </div>
                <div className='flex flex-wrap gap-5 mb-10 px-4'>
                    <Card className="bg-header border text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <Typography variant="h5" className="text-fore">
                                Have something to say?
                            </Typography>
                            <hr className='w-full my-5'/>
                            <form className="flex flex-col gap-6 mb-2 mt-2 text-fore" method='post'>
                                <div className='flex flex-wrap gap-6 *:basis-1/3 *:flex-1'>
                                    <div>
                                        <Input size='lg' label='Name' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} />
                                    </div>
                                    <div>
                                        <Input size='lg' type='email' label='Email' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} />
                                    </div>
                                </div>
                                <div>
                                    <Input size='lg' label='Subject' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} />
                                </div>
                                <div>
                                    <Textarea size='lg' label='Your Message' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} />
                                </div>
                                <Button type="submit" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={false} fullWidth>
                                    {data?.data_values?.button_text || 'Send Message'}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                    <Card className="bg-header border text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <iframe src={data?.data_values?.map_source || 'https://www.google.com/maps/embed/v1/place?q=The+Federal+Polytechnic+Ede,+Ede,+Nigeria&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'} loading='lazy' className='w-full h-[400px]' allowFullScreen></iframe>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className='bg-primary/20'>
                <div className='container xl:w-[90%] mx-auto py-5'>
                    <div className='flex flex-wrap gap-5 px-4 w-full'>
                        {contact_info && contact_info.map((info, key) =>
                            <Card key={key} className='bg-header text-fore w-full lg:w-1/4 md:w-1/2 md:flex-1 group' data-aos="fade-up" data-aos-delay={`${key}00`}>
                                <CardBody>
                                    <div className='float-left flex justify-center items-center size-14 border border-primary bg-primary rounded-full text-header group-hover:bg-header group-hover:text-primary transition-colors duration-1000'>
                                        <info.Icon className='size-6' />
                                    </div>
                                    <Typography variant='h6' className='ml-20'>
                                        {info.title}
                                    </Typography>
                                    <Typography className='ml-20'>
                                        {info.desc}
                                    </Typography>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};