import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Button, Card, CardBody, Dialog, DialogBody, Input, List, ListItem, ListItemPrefix, Textarea, Typography } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, CheckCircleIcon, CreditCardIcon, EnvelopeIcon, FaceFrownIcon, MapPinIcon,  XMarkIcon } from '@heroicons/react/24/outline';
import { getContent } from '../utils';
import { useDidMount } from '../hooks';
import { social_icons } from './admin/frontend';
import { frontSections } from '../utils/frontend';

const cls = ['!text-fore peer-focus:pl-0 peer-focus:before:!border-primary/90 peer-focus:after:!border-primary/90', 'text-fore focus:border-primary/90 placeholder:opacity-100'];
const logo = '/images/logoIcon/logo.png'

export function LoadingComponent() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 3000); // Simulated loading time
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

export function FormSkeleton({ size = 5, className = ''}) {
    return (
        <div className={`max-w-full animate-pulse p-5 space-y-5 ${className}`}>
            {Array(size).fill(null).map((_, key) =>
                <div key={key} className="h-3 rounded-full bg-gray-300">
                    &nbsp;
                </div>
            )}
        </div>
    )
}

const slider_img = 'images/img1.jpeg';
export const HeroSection = () => {
    const [data, setData] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await frontSections('hero');
        setData(snapshot?.content.data_values);
    };

    useEffect(() => {
        fetchData();
        return setData(null);
    }, []);
    return (
        <div id="hero" style={{ backgroundImage: `url(${didMount && data ? data.image : '/images/default.png'})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'top center' }} className='h-screen md:h-[80vh] bg-no-repeat relative'>
            <div className='absolute flex w-full h-screen md:h-[80vh] bg-black bg-opacity-40'>
                <div className='container m-auto text-white px-4 md:px-0'>
                    <Typography variant='h1' className="text-2xl md:text-4xl lg:text-5xl" data-aos="fade-left" data-aos-delay={100}>
                        {didMount && data ? data.heading : <FormSkeleton className='w-1/2 !p-0' size={1} />}
                    </Typography>
                    <Typography variant='h6' className='mt-3 mb-7 text-sm md:text-lg lg:text-2xl text-gray-200' data-aos="fade-right" data-aos-delay={200}>
                        {didMount && data ? data.sub_heading : <FormSkeleton className='w-1/2 !p-0' size={1} />}
                    </Typography>
                    <a href={data ? data.button_url :"/#about"} data-aos="fade-up" data-aos-delay={300}>
                        <Button className="rounded-full border-white hover:border-primary border-2 bg-transparent hover:bg-primary">
                            {didMount && data ? data.button_text : <FormSkeleton className='!p-0' size={1} />}
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export const AboutSection = () => {
    const [data, setData] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await frontSections('about');
        setData(snapshot?.content.data_values);
    };

    useEffect(() => {
        fetchData();
        return setData(null);
    }, []);
    return (
        <section id='about' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap gap-5 px-4'>
                    <div className='h-1/2 md:flex-1 basis-[100%] flex flex-col gap-y-4 p-5' data-aos="fade-right">
                        <h3 className='text-primary font-bold text-2xl font-[tahoma]'>
                            {didMount && data ? data.heading : <FormSkeleton className='!p-0' size={1} />}
                            <br />
                            <div className='text-fore text-lg'>
                                {didMount && data ? data.sub_heading : <FormSkeleton className='!p-0' size={1} />}
                            </div>
                        </h3>
                        <div className='text-fore/80 text-justify'>
                            {didMount && data ? data.details : <FormSkeleton className='!p-0' />}
                        </div>
                    </div>
                    <div data-aos="fade-left" className='relative min-h-60 md:flex-1 basis-[100%]' style={{ backgroundImage: `url(${didMount && data ? data.image : '/images/default.png'})`, backgroundSize: 'cover', }}>
                        <div className='absolute inset-0 from-header to-transparent md:bg-gradient-to-r bg-gradient-to-b'>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const ServiceSection = () => {
    const [content, setContent] = useState(null);
    const [elements, setElements] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await getContent('services.content', true);
        setContent(snapshot?.data_values);
        const snapshot2 = await getContent('services.element', false, null, true);
        setElements(snapshot2);
    };

    useEffect(() => {
        fetchData();
        return ()=>{
            setContent(null);
            setElements(null);
        }
    }, []);

    return (
        <section id='services' className='py-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        {didMount && content ? content.heading : <FormSkeleton className='!p-0' size={1} />}
                    </h3>
                    <div className='text-fore/80 my-4'>
                        {didMount && content ? content.sub_heading : <FormSkeleton className='!p-0' size={1} />}
                    </div>
                </div>
                <div className='flex flex-wrap p-4 w-full'>
                    {elements ? elements.map((service, key) => {
                        const ServiceIcon = social_icons[service.data_values.icon];
                        const sub_services = service.data_values.description.split('\n').map((sub_, i) =>
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
                    }) : 
                    <FormSkeleton className='!p-0 w-full' />
                    }
                </div>
            </div>
        </section>
    );
};

export const PaymentSection = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => { setOpen(!open); };

    const [content, setContent] = useState(null);
    const [elements, setElements] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await getContent('payment.content', true);
        setContent(snapshot?.data_values);
        const snapshot2 = await getContent('payment.element', false, null, true);
        setElements(snapshot2);
    };

    useEffect(() => {
        fetchData();
        return ()=>{
            setContent(null);
            setElements(null);
        }
    }, []);

    return (
        <section id='payment' className='py-10 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        {didMount && content ? content.heading : <FormSkeleton className='!p-0' size={1} />}
                    </h3>
                    <div className='text-fore/80 my-4'>
                        {didMount && content ? content.sub_heading : <FormSkeleton className='!p-0' size={1} />}
                    </div>
                </div>
                <div className='flex flex-wrap gap-5 mb-10 px-4'>
                    <Card data-aos="fade-left" className="bg-back text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <div className=''>
                                <CreditCardIcon className='size-16 text-primary inline-block' />
                                <Typography className="text-fore">
                                    You can make payment to one of these account:
                                </Typography>
                            </div>
                            <hr className='w-full my-3' />
                            <List className='p-0'>
                                {elements ? elements.map(({data_values:dv}, key) => 
                                <ListItem key={key} className='text-fore'>
                                    <ListItemPrefix>
                                        <ArrowRightIcon className='size-6' />
                                    </ListItemPrefix>
                                    {dv.account_name}, {dv.account_number},  {dv.bank}
                                </ListItem>
                                ) :
                                <FormSkeleton className='!p-0 w-full' />
                                }
                            </List>
                        </CardBody>
                    </Card>
                    <Card data-aos="fade-right" className="bg-back text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <div className=''>
                                <CheckCircleIcon className='size-16 text-primary inline-block' />
                                <Typography className="text-fore">
                                    I've made the payment?
                                </Typography>
                            </div>
                            <hr className='w-full my-3' />
                            <div className='flex items-center justify-center my-16'>
                                <Button variant='outlined' onClick={handleOpen} className='border-primary rounded-full px-16 hover:text-white border-2 text-fore hover:bg-primary'>
                                {didMount && content ? content.button_text : <FormSkeleton className='!p-0' size={1} />}
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogBody divider className=" bg-header border-0 gap-4 md:p-16 relative rounded">
                    <XMarkIcon className="mr-3 h-5 w-5 absolute top-3 right-0" onClick={handleOpen} />
                    <form className="mt-8 mb-2 text-fore" method='post'>
                        <div className="mb-1 flex flex-col gap-6">
                            <div>
                                <Input label='Enter Transaction ID' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} required />
                            </div>
                        </div>
                        <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={false} fullWidth>
                            Comfirm
                        </Button>
                    </form>
                </DialogBody>
            </Dialog>
        </section>
    );
};

export const ContactSection = () => {
    const [data, setData] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await frontSections('contact_us');
        setData(snapshot?.content.data_values);
    };

    useEffect(() => {
        fetchData();
        return setData(null);
    }, []);

    const contact_info = [
        { title: 'Phone', desc: data?.phone || '+18329844722, +2348034066961', Icon: PhoneIcon },
        { title: 'Email', desc: data?.email || 'deranmore@hotmail.com', Icon: EnvelopeIcon },
        { title: 'Address', desc: data?.address || 'Ede, Osun Sta.', Icon: MapPinIcon },
    ]
    return (
        <section id='contact' className='pt-10'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='p-4 text-center'>
                    <h3 className='font-bold text-2xl'>
                        {didMount && data ? data.heading : <FormSkeleton className='!p-0' size={1} />}
                    </h3>
                    <div className='text-fore/80 my-4'>
                        {didMount && data ? data.sub_heading : <FormSkeleton className='!p-0' size={1} />}
                    </div>
                </div>
                <div className='flex flex-wrap gap-5 mb-10 px-4'>
                    <Card data-aos="fade-left" data-aos-delay="100" className="bg-header border text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <Typography variant="h5" className="text-fore">
                                {didMount && data ? data.title : <FormSkeleton className='!p-0' size={1} />}
                            </Typography>
                            <hr className='w-full my-5' />
                            <form className="flex flex-col gap-6 mb-2 mt-2 text-fore" method='post'>
                                <div className='flex flex-wrap gap-6 *:basis-1/3 *:flex-1'>
                                    <div>
                                        <Input size='lg' label='Name' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} required />
                                    </div>
                                    <div>
                                        <Input size='lg' type='email' label='Email' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} required />
                                    </div>
                                </div>
                                <div>
                                    <Input size='lg' label='Subject' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} required />
                                </div>
                                <div>
                                    <Textarea size='lg' label='Your Message' labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0' }} className={cls[1]} required />
                                </div>
                                <Button type="submit" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={false} fullWidth>
                                    {data?.button_text || 'Send Message'}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                    <Card data-aos="fade-left" data-aos-delay="200" className="bg-header border text-fore md:flex-1 basis-[100%]">
                        <CardBody>
                            <iframe src={data?.map_source || 'https://www.google.com/maps/embed/v1/place?q=The+Federal+Polytechnic+Ede,+Ede,+Nigeria&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'} loading='lazy' className='w-full h-[400px]' allowFullScreen></iframe>
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
                                    <Typography as={'div'} className='ml-20'>
                                        {didMount && data ? info.desc : <FormSkeleton className='!p-0' size={1} />}
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

export const FooterSection = () => {
    const [elements, setElements] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await getContent('footer.element', false, null, true);
        setElements(snapshot);
    };

    useEffect(() => {
        fetchData();
        return ()=>{
            setElements(null);
        }
    }, []);
    
    return (
        <section id='' className='py-5 bg-header'>
            <div className='container xl:w-[90%] mx-auto'>
                <div className='flex flex-wrap items-center justify-center md:justify-between gap-5 px-4'>
                    <div>
                        © Copyright <b>DeranMore.</b> All Rights Reserved
                    </div>
                    <div className='flex gap-x-3 text-2xl'>
                    {elements ? elements.map(({data_values:dv}, key) =>{
                        const SIcon = social_icons[dv.social_icon];
                        return (
                            <Link to={dv?.social_link || '/'} key={key} className='hover:text-primary/60 text-primary/90'>
                                {SIcon && <SIcon className='size-5' />}
                            </Link>
                        )
                    }) :
                    <>
                    <FormSkeleton className='!p-0 size-5 rounded-full' size={1} />
                    <FormSkeleton className='!p-0 size-5 rounded-full' size={1} />
                    <FormSkeleton className='!p-0 size-5 rounded-full' size={1} />
                    </>
                    }
                    </div>
                </div>
            </div>
        </section>
    )
}

export const NotFound = () => {
    return (
        <div className='flex justify-center items-center h-screen p-5'>
            <Card className='bg-header px-12 py-16'>
                <CardBody className='text-center text-fore'>
                    <FaceFrownIcon className='inline-block size-16 my-4 text-primary' />
                    <Typography variant='h4'>404 - Page Not Found</Typography>
                    <p className='mb-3'>Sorry, the page you are looking for does not exist.</p>
                    <Link to={'/'}>
                        <Button className='bg-primary'>
                            Back to Home
                        </Button>
                    </Link>
                </CardBody>
            </Card>
        </div>
    );
};

export function BreadCrumbs({ role = 'admin', links = [], ...props }) {
    return (
        <Breadcrumbs {...props}>
            <Link to={`/${role}`} className={`text-fore hover:text-primary ${links.length ? 'opacity-60' : ''}`}>
                Dashboard
            </Link>
            {links && links.map((link, key) =>
                <Link href={link.href} key={key} className={`text-fore hover:text-primary ${key === links.length - 1 ? '' : "opacity-60"}`}>
                    {link.name}
                </Link>
            )}
        </Breadcrumbs>
    )
}