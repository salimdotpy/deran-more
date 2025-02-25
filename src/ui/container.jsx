import React from "react";
import { Card } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import Header from "./header";

export default function MainLayout({ children, sitename }) {
  return (
    <React.Fragment>
        <Header sitename={sitename} />
        <main className="pt-16">
            {children}
        </main>
    </React.Fragment>
  );
}

export function AuthLayout({ children, phrase='Get Started Now' }) {
  return (
    <main role='main'>
      <section id='' className='flex flex-wrap w-full'>
        <div className='hidden w-0 lg:flex grow justify-center items-center'>
          <div className='md:ml-20 lg:ml-32 ml-44'>
            <Link to={'/'}>
              <img src={'/images/logoIcon/logo.png'} className="mb-5 size-10 lg:size-14" alt={`Company Logo`} />
            </Link>
            <h2 className='text-[40px] font-thin 2xl:text-4xl font-sans'>
              {phrase}
            </h2>
          </div>
        </div>
        <div className='w-full bg-header lg:w-[660px] py-5 px-6 min-h-screen flex flex-wrap justify-center items-center'>
          <Card color="transparent" shadow={false} className='w-full max-w-[500px] text-fore'>
            <Link to={'/'}>
              <img src={'/images/logoIcon/logo.png'} className="mb-20 size-14 lg:hidden" alt={`Company Logo`} />
            </Link>
            {children}
          </Card>
        </div>
      </section>
    </main>
  );
}