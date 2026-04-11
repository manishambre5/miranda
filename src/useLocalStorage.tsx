import { useEffect, useState } from "react";
import type { Notebook } from "./App";

export const useLocalStorage = () => {

    const [storedNotebooks, setStoredNotebooks] = useState<Notebook[]>([]);

    // load all notebooks from localStorage on mount
    useEffect(() => {
        //Create the quick start guide manual notebook
        //quickStartGuideNotebook();

        const notebooks: Notebook[] = Object.keys(localStorage)
            .filter(key => key.startsWith('miranda'))
            .map(key => {
                const item = localStorage.getItem(key);
                if (!item) return null;

                try {
                    const parsed = JSON.parse(item);
                    if (parsed?.id && parsed?.title && Array.isArray(parsed?.markdown)) {
                        return parsed;
                    }
                } catch (error) {
                    console.error('Error parsing notebook:', error);
                }

                return null;
            }).filter(Boolean); //remove null values
        setStoredNotebooks(notebooks);
    }, []);

    // save or update notebook in localStorage
    const saveNotebook = (notebook: Notebook) => {
        try {
            //save in localStorage
            localStorage.setItem(notebook.id, JSON.stringify(notebook));
            console.log("Notebook saved successfully!");
            
            // fetch saved notebook immediately to ensure state is in sync
            setStoredNotebooks(prev => {
                const index = prev.findIndex(n => n.id === notebook.id);
                if (index !== -1) {
                    // replace the existing notebook
                    const updatedNotebooks = [...prev];
                    updatedNotebooks[index] = notebook;
                    return updatedNotebooks;
                } else {
                    // append if it's a new notebook
                    return [...prev, notebook];
                }
            });
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

    // delete notebook from localStorage
    const deleteNotebook = (id: string) => {
        try {
            //remove from localStorage
            localStorage.removeItem(id);

            //remove from state to keep state in sync
            setStoredNotebooks((prevNotebooks) => {
                const updatedNotebooks = prevNotebooks.filter(notebook => notebook.id !== id);
                return updatedNotebooks;
            });
        } catch (error) {
            console.log('Error removing notebook from localStorage', error);
            return null;
        }
    }

    // toggle favourite flag in localStorage
    const favouriteNotebook = (id: string) => {
        try {
            // Retrieve the notebook from localStorage
            const item = localStorage.getItem(id);
            if (!item) return;

            // Parse the notebook and toggle the flag
            const notebook: Notebook = JSON.parse(item);
            notebook.fav = !notebook.fav;

            // Save the updated notebook back to localStorage
            localStorage.setItem(id, JSON.stringify(notebook));

            //change flag in state to keep state in sync
            // Update the state to reflect the change in the UI
            setStoredNotebooks((prevNotebooks) => {
                const updatedNotebooks = prevNotebooks.map((nb) => 
                    nb.id === id ? { ...nb, fav: notebook.fav } : nb
                );
                return updatedNotebooks;
            });
        } catch (error) {
            console.log('Error toggling favorite flag in localStorage', error);
            return null;
        }
    }

    return { storedNotebooks, saveNotebook, getNotebook, deleteNotebook, favouriteNotebook };
}