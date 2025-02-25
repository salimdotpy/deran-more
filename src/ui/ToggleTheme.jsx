import React, { useEffect, useState } from 'react';

import { IconButton } from '@material-tailwind/react';
import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/solid';

const ToggleTheme = ({ label = true, className= '', iconOnly = false }) => {
    const [theme, setTheme] = useState(false);
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
        if (localStorage?.getItem('theme') === 'dark') {
            setTheme(true);
        }
    }, []);

    useEffect(() => {
        if (theme) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('theme', theme ? 'dark' : 'light');
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => !prev);
    };

    return (
        <React.Fragment>
            {domLoaded && (
                iconOnly ?
                    <IconButton variant='outlined' className={`rounded-full border-primary ${className}`} onClick={toggleTheme}>
                        {theme ?
                            <MoonIcon className="size-6 text-white" strokeWidth={2} /> :
                            <SunIcon className="size-6" strokeWidth={2} />}
                    </IconButton> :
                    <div className={`flex items-center gap-x-3 shrink-0 ${className}`}>
                        <div className={`w-12 h-6 flex justify-between relative items-center rounded-full p-1 px-1.5 text-[12px] cursor-pointer ${theme ? 'bg-green-500' : 'bg-gray-300'}`} onClick={toggleTheme}>
                            <div className={`bg-white w-4 h-4 absolute rounded-full shadow-md duration-300 hover:ring ring-primary ease-in-out ${theme ? 'translate-x-6 ring-4' : ''}`}></div>
                            <span>🌙</span>
                            <span>🔆</span>
                        </div>
                        {label && <div className='shrink-0 text-sm'>{theme ? 'Dark Mode' : 'Light Mode'}</div>}
                    </div>
            )}
        </React.Fragment>
    );
};

export default ToggleTheme;
