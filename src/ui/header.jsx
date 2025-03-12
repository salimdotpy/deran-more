
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { Drawer, IconButton, List, ListItem, Navbar } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ToggleTheme from './ToggleTheme';
import { useDidMount } from '../hooks';
import { fetchSetting } from '../utils';

const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/#services' },
    { name: 'Payment', href: '/#payment' },
    { name: 'Contact', href: '/#contact' },
]

const Header = ({ sitename }) => {
    const [open, setOpen] = useState(false);
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    const [images, setImages] = useState(null);
    const [seo, setSeo] = useState(null);
    const didMount = useDidMount();
    const fetchData = async () => {
        const snapshot = await fetchSetting('logo_favicon.image');
        setImages(snapshot);
        const snapshot2 = await fetchSetting('seo.data');
        setSeo(snapshot2);
    };

    useEffect(() => {
        fetchData();
        return ()=>{
            setImages(null);
            setSeo(null);
        }
    }, []);
  
    useEffect(() => {
      window.addEventListener("resize", () => {
        if(window.innerWidth >= 960) {
          setOpen(false);
        }
      });
    }, []);
    
    return (
        <React.Fragment>
            <header className='fixed z-20 inset-x-0 top-0 w-full shadow-md bg-header'>
                <Navbar className="mx-auto shadow-none rounded-none inset-x-0 max-w-screen-2xl px-4 py-2 lg:px-8 bg-header text-fore border-none">
                    <div className="flex items-center gap-x-2">
                        <Link to="/" className="me-auto font-bold text-primary">
                            <div className='flex items-center gap-2'>
                                <img src={`${didMount && images ? images.logo :'/images/logoIcon/logo.png'}`} alt='company logo' className='size-12 p-1 rounded-full bg-white' />
                                <span className="hidden lg:block font-[tahoma]">
                                    {didMount && seo ? seo.social_title : 'DeranMore'}
                                </span>
                            </div>
                        </Link>
                        <div className='hidden lg:block'>
                            <NavList />
                        </div>
                        <ToggleTheme className='hidden lg:flex pr-3' iconOnly={true} />
                        <IconButton className="rounded-full bg-primary lg:hidden"  onClick={openDrawer}>
                            <Bars3Icon className="size-4" strokeWidth={2} />
                        </IconButton>
                    </div>
                </Navbar>
            </header>
            <SideDrawer open={open} onClose={closeDrawer} sitename={sitename} />
        </React.Fragment>
    );
};

export default Header;

function NavList() {
    return (
        <List className="lg:flex min-w-0 lg:flex-row lg:p-1 lg:px-6">
            {links.map((link, key) =>
            (link.href.startsWith('/') ?
                <a href={link.href} key={key} className="text-primary">
                    <ListItem className="flex items-center gap-2 py-3 pr-4">{link.name}</ListItem>
                </a> :
                <Link to={link.href} key={key} className="text-primary">
                    <ListItem className="flex items-center gap-2 py-3 pr-4">{link.name}</ListItem>
                </Link>
            )
            )}
        </List>
    )
}

const SideDrawer = ({ open, onClose, sitename }) => {
    return(
        <Drawer open={open} onClose={onClose} placement="right" className="overflow-y-auto flex flex-col bg-header">
            <div className='flex items-center font-semibold gap-x-3 justify-end p-3 border-b border-primary/60'>
                <IconButton className="rounded-full bg-primary" onClick={onClose}>
                    <XMarkIcon className="size-5" strokeWidth={2} />
                </IconButton>
            </div>
            <div className='overflow-y-auto'>
                <NavList />
                <div className="font-medium text-primary lg:hidden px-2.5">
                    <ListItem className="flex items-center justify-between gap-2 py-2 pr-4">
                        <span>Theme mode</span>
                        <ToggleTheme label={false} />
                    </ListItem>
                </div>
            </div>
            <div className='text-center font-semibold mt-auto py-3 bg-primary text-white'>
                &copy; {sitename || 'DeranMore'}
            </div>
        </Drawer>
    );
}