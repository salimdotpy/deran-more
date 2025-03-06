import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { KeyIcon, MagnifyingGlassIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Badge, Card, Dialog, DialogBody, IconButton, Input, List, ListItem, Menu, MenuHandler, MenuItem, MenuList, Tooltip, Typography } from '@material-tailwind/react';
import { BiHelpCircle, BiLastPage, BiLogOut } from 'react-icons/bi';
import React from 'react';
import { links } from './sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogout } from '../../utils/firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import { useAdmin } from '../../hooks';
import { FormSkeleton } from '../sections';

const Header = ({open, onClose}) => {
    const [openSearch, setOpenSearch] = React.useState(false);
    const [searchLink, setSearchLink] = React.useState(getSearchLinks());
    
    const {user, loading} = useAuth();
    const { admin,  isLoading, error} = useAdmin(user);
    const navigate = useNavigate();
    
    const handleOpenSearch = () => {setOpenSearch(!openSearch)};
    const cls = '!text-fore peer-focus:pl-0 peer-focus:before:!border-primary/90 peer-focus:after:!border-primary/90';
    
    const handleSearch = (e) => {
        const value = e.target.value;
        const result = getSearchLinks().filter((link) => {
            return link.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
        });
        setSearchLink(result);
    }

    const handleLogout = async () => {
        await adminLogout();
        toast.success("You've logged out successfully!");
        navigate("auth/admin");
    }

    return (
        <div className='flex basis-full items-center h-full px-4'>
            <div className='flex items-center xl:hidden'>
                <IconButton variant='text' className='text-fore'onClick={()=>onClose(!open)}>
                    <BiLastPage className='size-5'/>
                </IconButton>
            </div>
            <div className='grow flex justify-end items-center gap-3 w-full p-0 h-full'>
                <Tooltip content="Search">
                    <IconButton variant='text' className='text-fore' onClick={handleOpenSearch}>
                        <MagnifyingGlassIcon className='size-5'/>
                    </IconButton>
                </Tooltip>
                <Menu placement='bottom-end' dismiss={{itemPress: false}}>
                    <MenuHandler>
                        <div className='flex items-center'>
                        {(1===1) ?
                        <Badge content={0} withBorder className="top-2 right-1.5 bg-primary">
                            <IconButton variant='text'>
                                <BellIcon className='size-5 text-fore'/>
                            </IconButton>
                        </Badge> :
                        <IconButton variant='text'>
                            <BellIcon className='size-5 text-fore'/>
                        </IconButton>
                        }
                        </div>
                    </MenuHandler>
                    <MenuList className="bg-header md:max-w-[400px] text-fore border-none outline-none">
                        <div className="line-clamp-2 border-none border-0">
                            <div className='flex justify-between items-center'>
                                <p className='font-semibold'>Notifications</p>
                                <Tooltip content='Mark all as read' placement='left'>
                                    <IconButton variant='text' className='rounded-full'>
                                        <CheckCircleIcon className='size-5 text-primary' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <small className="text-fore/75">You have 0 unread messages</small>
                        </div>
                        <hr className='my-2 border-fore/15' />
                        <div className='max-h-72 overflow-y-auto'></div>
                        <hr className='my-2 border-fore/15' />
                        <div className='text-center'>
                            <Link to='/admin/notification' className='font-semibold text-primary'>View All</Link>
                        </div>
                    </MenuList>
                </Menu>
                <Menu placement='bottom-end'>
                    <MenuHandler>
                        <IconButton className="flex shrink-0 justify-center items-center shadow size-10 bg-primary/30 text-fore rounded-full">
                            <Typography variant="h4">A</Typography>
                        </IconButton>
                    </MenuHandler>
                    <MenuList className="bg-header text-fore border-none outline-none">
                        <div className="line-clamp-2 border-none outline-none uppercase">
                            <p className="font-semibold">
                            {!isLoading ? admin?.name : <FormSkeleton className='!p-0' size={1} />}
                            </p>
                            <p className="text-fore/75">
                            {!isLoading ? admin?.username : <FormSkeleton className='!p-0' size={1} />}
                            </p>
                        </div>
                        <hr className='my-2 border-fore/15' />
                        <MenuItem className='flex items-center gap-2'>
                            <UserIcon className='size-4' />
                            <Typography variant='small' className=''>Profile</Typography>
                        </MenuItem>
                        <MenuItem className='flex items-center gap-2' onClick={()=>navigate()}>
                            <KeyIcon className='size-4' />
                            <Typography variant='small' className=''>Password</Typography>
                        </MenuItem>
                        <Link to='https://wa.me/+2348076738293?text=Hi, from *DERAN MORE* type your message here'>
                            <MenuItem className='flex items-center gap-2'>
                                <BiHelpCircle className='size-4' />
                                <Typography variant='small' className=''>Help</Typography>
                            </MenuItem>
                        </Link>
                        <hr className='my-2 border-fore/15' />
                        <MenuItem className='flex items-center gap-2' onClick={handleLogout}>
                            <BiLogOut className='size-4' />
                            <Typography variant='small' className=''>Sign Out</Typography>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
            <Dialog open={openSearch} handler={handleOpenSearch} size="sm" className='bg-header -mt-[10%]'>
                <DialogBody className="grid place-items-center gap-4 relative text-fore" size="sm">
                <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handleOpenSearch} />
                <Card color="transparent" shadow={false} className='w-full max-w-[500px] text-fore'>
                    <form className="mt-8 mb-2 text-fore" method='post'>
                        <div className="mb-1 flex flex-col gap-6">
                            <Input type='text' label='Search' id='search' onKeyUp={handleSearch} labelProps={{ className: cls }} containerProps={{ className: 'min-w-0 flex-1' }} className='text-fore focus:border-primary/90 placeholder:opacity-100' icon={<MagnifyingGlassIcon className="size-5" />} />
                        </div>
                    </form>
                    <List className='m-0 p-0 text-fore text-sm h-40 overflow-y-auto'>
                        {searchLink.map((link, key) => 
                        <Link to={link.href} key={key}>
                            <ListItem className="py-2 m-0 focus:bg-primary/30 hover:text-primary focus:text-primary">
                                {link.name}
                            </ListItem>
                        </Link>
                        )}
                    </List>
                </Card>
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default Header;

const getSearchLinks = ()=>{
    let newList = []
    links.forEach(element => {
        if(element.menu){
            element.menu.forEach(menu => {newList.push({name: menu.name, href: menu.href})})
        } else if(element.head === undefined){
            newList.push({name: element.name, href: element.href})
        }
    });
    newList = newList.sort((a, b) => {
        let x = a.name.toLowerCase(), y = b.name.toLowerCase();
        if (x < y) { return -1 }
        if (x > y) { return 1 }
        return 0
    });
    return newList;
}