"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/auth/login/page";
import RegisterModal from "@/components/auth/register/page";
import DesktopNavbar from "@/components/layout/shop/navbar/navbarDesktop";
import MobileNavbar from "@/components/layout/shop/navbar/navbarMobile";
import Loader from '@/components/loader';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const { data: session } = useSession();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const closeRegisterModal = () => setIsRegisterModalOpen(false);

    return (
        <nav className="bg-primary text-white">
            <div className="max-w-[1440px] mx-auto">
                <Loader duration={1500} />
                <DesktopNavbar
                    session={session}
                    isDropdownOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                    openLoginModal={openLoginModal}
                    openRegisterModal={openRegisterModal}
                />

                <MobileNavbar
                    session={session}
                    isDropdownOpen={isDropdownOpen}
                    isMobileMenuOpen={isMobileMenuOpen}
                    toggleDropdown={toggleDropdown}
                    toggleMobileMenu={toggleMobileMenu}
                    openLoginModal={openLoginModal}
                    openRegisterModal={openRegisterModal}
                />
            </div>

            <LoginModal isOpen={isLoginModalOpen} closeModal={closeLoginModal} />
            <RegisterModal isOpen={isRegisterModalOpen} closeModal={closeRegisterModal} />
        </nav>
    );
}

export default Navbar;