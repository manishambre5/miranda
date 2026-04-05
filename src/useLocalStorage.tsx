import { useState } from "react";
import type { Notebook } from "./App";

export const useLocalStorage = () => {

    const [storedNotebooks, setStoredNotebooks] = useState<Notebook[]>([]);

    const saveNotebook = (notebook: Notebook) => {
        try {
            localStorage.setItem(notebook.id, JSON.stringify(notebook));
            setStoredNotebooks(prev => [...prev.filter(n => n.id !== notebook.id), notebook]);
            console.log("Notebook saved successfully!");
        } catch (error) {
            console.error("Failed to save notebook:", error);
        }
    };

    console.log(saveNotebook);

    return { storedNotebooks, saveNotebook };
}