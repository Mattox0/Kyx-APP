/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                "background": "#231C38",
                "border": "#2F3247",
                "container": "#3B344D",
                "white": "#FFFFFF",
                "pink": "#F6339A",
                "cyan": "#06B6D4",
                "yellow": "#F59E0B",
                "gray": "#99A1AF",
                "green": "#24936E",
                "red": "#AE2525",
            }
        },
    },
    plugins: [],
}

