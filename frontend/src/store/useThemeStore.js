import { create } from "zustand";

export const useThemeStore = create((set) => {
    const savedTheme = localStorage.getItem("chat-theme") || "coffee"; // Default theme if none found
    document.documentElement.setAttribute("data-theme", savedTheme); // Apply immediately
    return {
        theme : localStorage.getItem("chat-theme") || "coffee",
        setTheme : (theme) => {
            localStorage.setItem("chat-theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
            set({theme});
        }
    }
});