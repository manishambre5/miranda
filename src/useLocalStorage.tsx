import { useEffect, useState } from "react";
import type { Notebook } from "./App";

export const useLocalStorage = () => {

    const [storedNotebooks, setStoredNotebooks] = useState<Notebook[]>([]);

    // load all notebooks from localStorage on mount
    useEffect(() => {
        const notebooks: Notebook[] = [];

        Object.keys(localStorage).forEach(key => {
            const item = localStorage.getItem(key);
            if (!item) return;

            try {
                const parsed = JSON.parse(item);
                if (parsed?.id && parsed?.title && Array.isArray(parsed?.markdown)) {
                    notebooks.push(parsed);
                }
            } catch {}
        });

        setStoredNotebooks(notebooks);
    }, []);

    // save or update notebook in localStorage
    const saveNotebook = (notebook: Notebook) => {
        try {
            localStorage.setItem(notebook.id, JSON.stringify(notebook));
            setStoredNotebooks(prev => [...prev.filter(n => n.id !== notebook.id), notebook]);
            console.log("Notebook saved successfully!");
        } catch (error) {
            console.error("Failed to save notebook:", error);
        }
    };

    // get notebook by id
    const getNotebook = (id: string) => {
        try {
            const item = localStorage.getItem(id);
            if(!item) return null;
            return JSON.parse(item) as Notebook;
        } catch {
            return null;
        }
    }

    return { storedNotebooks, saveNotebook, getNotebook };
}