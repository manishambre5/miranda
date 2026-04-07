export const quickStartGuideNotebook = () => {
    const defaultNotebookId = "miranda-quick-start-guide";

    // checking if it already exists
    const existingNotebook = localStorage.getItem(defaultNotebookId);
    if (existingNotebook) return;

    // create a default "Quick Start Guide" notebook
    const defaultNotebook = {
    id: defaultNotebookId,
    title: "Quick Start Guide",
    markdown: [
        "# Welcome to the Miranda Notebooks!\nThis is a brief guide (work in progress) to get you started...",
        "Keyboard shortcuts:\n - cmd/ctrl + Enter: Create a new notebook / cell\n - cmd/ctrl + Backspace: Delete cell\n - cmd/ctrl + ↓: Move cell downwards\n - cmd/ctrl + ↑: Move cell upwards\n - cmd/ctrl + k: Search\n",
    ],
    fav: true,
    };

    localStorage.setItem(defaultNotebookId, JSON.stringify(defaultNotebook));
};