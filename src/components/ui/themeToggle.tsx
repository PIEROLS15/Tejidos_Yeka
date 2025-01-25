"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    // Efecto para inicializar el tema desde localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
            }
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
        setMounted(true);
    }, []);

    // Efecto para manejar cambios en el tema
    useEffect(() => {
        if (mounted) {
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("theme", theme);
        }
    }, [theme, mounted]);

    const handleChangeTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex items-center">
            <label className="relative inline-block w-[56px] h-[30px] cursor-pointer">
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={handleChangeTheme}
                    className="sr-only peer"
                />
                <div className={`
                    absolute inset-0 transition-all duration-300 rounded-full
                    ${theme === 'dark' ? 'dark:bg-secondary bg-secondary' : 'bg-gray-200'}
                `}>
                    <div className={`
                        absolute top-[2px] left-[2px]
                        transition-all duration-300
                        ${theme === 'dark' ? 'translate-x-[26px]' : ''}
                    `}>
                        <span className="dark:hidden bg-white rounded-full p-2 flex items-center justify-center w-[26px] h-[26px]">
                            <FaSun className="text-[#969AA1] w-3 h-3" />
                        </span>
                        <span className="hidden dark:inline-block bg-white rounded-full p-2 items-center justify-center w-[26px] h-[26px]">
                            <FaMoon className="text-[#969AA1] w-3 h-3" />
                        </span>
                    </div>
                </div>
            </label>
        </div>
    );
};

export default ThemeToggle;