import React, { useEffect, useState } from "react";
import Header from "./header";
import { Aside, Sidebar } from "./sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) {
        setOpen(false);
      }
    });
  }, []);
  return (
    <div className="h-screen">
      {domLoaded &&
        <>
          <aside className="h-screen z-[500] hidden xl:block w-[260px] shadow-xl fixed top-0 left-0">
            <Sidebar />
          </aside>
          <header className="fixed z-[500] top-0 h-[60px] shadow-xl bg-header w-full xl:w-[calc(100%-260px)] xl:ml-[260px]">
            <Header open={open} onClose={setOpen} />
          </header>
          <main className="w-full xl:w-[calc(100%-260px)] xl:ml-[260px] p-6 pt-20 bg-back">
            {children}
          </main>
          <Aside open={open} onClose={setOpen} />
        </>
      }
    </div>
  );
}