import {create} from "zustand";

export const useThemeStore = create((set) => ({
	theme: localStorage.getItem("bf-theme") || "coffee",
	setTheme: (theme) =>{
		localStorage.setItem("bf-theme", theme);
		set({theme});
	},
}));