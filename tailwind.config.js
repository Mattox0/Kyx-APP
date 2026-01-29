/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                "bg-background": "#231C38",
                "bg-container": "#3B344D",
                "text-primary": "#FFFFFF",
                "accent-pink": "#F6339A",
                "accent-cyan": "#06B6D4",
                "accent-yellow": "#F59E0B",
                "color-gray": "#99A1AF",
                "color-green": "#24936E",
                "color-red": "#AE2525",
            }
        },
    },
    plugins: [],
}

