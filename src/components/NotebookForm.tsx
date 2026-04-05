import { ArrowDown, ArrowUp, Download, Loader, Plus, Save, Trash, X } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react"
import { Link } from "react-router-dom";
import type { Notebook } from "../App";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../useLocalStorage";

const NotebookForm = () => {
    const [notebookId, setNotebookId] = useState<string | null>(null);//store notebook id
    const [success, setSuccess] = useState(false);//save action alert
    const titleRef = useRef<HTMLInputElement>(null);
    //const [notebook, setNotebook] = useState<Notebook>();
    const [cellContents, setCellContents] = useState<string[]>(['']);
    const cellRefs = useRef<(HTMLTextAreaElement | null) []>([]);

    // dynamic cell length
    const handleCellLengthChange = (index:number, e:ChangeEvent<HTMLTextAreaElement>) => {
        const cell = e.target;
        const newCellContent = [...cellContents]; //copy exisiting content from cell in focus
        cell.style.height = "auto";
        cell.style.height = `${cell.scrollHeight}px`;
        newCellContent[index] = e.target.value;
        setCellContents(newCellContent); //paste it back to where it was copied from
    }

    // add new empty cell
    const addCell = () => {
        setCellContents([...cellContents, '']);
        //focus on the new empty cell
        setTimeout(() => {
            const lastIndex = cellRefs.current.length - 1;
            if (cellRefs.current[lastIndex]) {
                cellRefs.current[lastIndex]?.focus();
            }
        }, 0);
    }

    //delete cell
    const delCell = (index: number) => {
        const newCellContents = cellContents.filter((_, i) => i !== index); //remove cell at the given index
        const newCellRefs = cellRefs.current.filter((_, i) => i !== index); //remove the ref for that cell
        setCellContents(newCellContents); //update the state with the new cell contents
        cellRefs.current = newCellRefs; //update the refs array
        
        //focus on existing cell after deletion
        setTimeout(() => {
            const newIndex = index === cellContents.length ? index - 1 : index;
            if (newIndex >= 0 && newIndex < cellRefs.current.length) {
                cellRefs.current[newIndex]?.focus(); //focus on the cell at the new index
            }
        }, 0);
    }

    //move cell
    const moveCell = (index1: number, index2: number) => {
        const newCellContents = [...cellContents];
        const newCellRefs = [...cellRefs.current];

        //swapping content...
        const swapContentBuffer = newCellContents[index1];
        newCellContents[index1] = newCellContents[index2];
        newCellContents[index2] = swapContentBuffer;

        //swapping refs
        const swapRefBuffer = newCellRefs[index1];
        newCellRefs[index1] = newCellRefs[index2];
        newCellRefs[index2] = swapRefBuffer;

        //update states and re-render
        setCellContents(newCellContents);
        cellRefs.current = newCellRefs;

        //keep focus on the moved cell
        setTimeout(() => {
            cellRefs.current[index2]?.focus();
        }, 0);
    }

    //trigger add new cell via button click
    const addCellButton = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addCell();
    }

    //trigger delete cell via button click
    const delCellButton = (e:React.MouseEvent<HTMLButtonElement>, index:number) => {
        e.preventDefault();
        delCell(index);
    }
    
    //trigger move cell DOWN via button click
    const moveCellDownButton = (e:React.MouseEvent<HTMLButtonElement>, index:number) => {
        e.preventDefault();
        if (index + 1 < cellContents.length) {//check if current cell is the last one
            moveCell(index, index+1);
        }
    }
    //trigger move cell UP via button click
    const moveCellUpButton = (e:React.MouseEvent<HTMLButtonElement>, index:number) => {
        e.preventDefault();
        if (index - 1 >= 0) {//check if current cell is the first one
            moveCell(index, index-1);
        }
    }

    //Keyboard shortcuts
    const handleKeyboardInput = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
        //ctrl/cmd + enter to add new cell
        if((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            addCell();
        }
        //ctrl/cmd + backspace to delete cell
        if((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
            delCell(index);
        }
    }

    //SAVE NOTEBOOK using custom hook
    const { saveNotebook } = useLocalStorage();
    const handleSaveNotebook = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const id = notebookId || uuidv4(); //reuse or create new id

        //create notebook object
        const newNotebook: Notebook = {
            id,
            title: titleRef.current?.value || "Untitled_Notebook",
            markdown: cellContents,
        };
        //save notebook object to storage
        saveNotebook(newNotebook);

        // if new notebook, store id for future saves
        if(!notebookId) {
            setNotebookId(id);
        }

        //alert user
        setSuccess(true);
        setTimeout(() => {setSuccess(false)}, 2000)
    }

  return (
    <form className="flex flex-col py-4 gap-2 relative" onSubmit={handleSaveNotebook}>
        <section className="border-b border-b-slate-400 pb-4 mb-2 flex items-center justify-between gap-2 md:gap-4">

            {/* Title */}
            <input className="border-2 border-slate-400 text-slate-900 text-xl outline-0 p-2 focus:border-slate-600 rounded-sm w-2/3 md:w-fit" name="title" type="text" placeholder="Title" ref={titleRef} />

            {/* Notebook toolbar */}
            <div className="flex items-center gap-4 md:gap-8 p-2">
                <button type="submit" className="cursor-pointer text-slate-500 hover:text-slate-600 transition-colors">
                    {/* Saving Alert */}
                    {success ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <Save />
                    )}
                </button>
                <button type="button" className="cursor-pointer text-slate-500 hover:text-slate-600 transition-colors"><Download /></button>
                <Link to=".." className="text-slate-500 hover:text-slate-600 transition-colors"><X /></Link>
            </div>

        </section>
        <section className="flex flex-col w-full gap-2">
            {/* Notebook */}
            {cellContents.map((cellContent, index) =>(
                <section key={index} className="flex flex-col w-full border-2 bg-white border-slate-400 rounded-sm z-10">

                    {/* Cell */}
                    <div className="bg-slate-50 rounded-t-xs flex justify-between p-2">

                        {/* Cell index */}
                        <p className="font-bold text-slate-600">
                            [{index+1}]
                        </p>

                        {/* Cell toolbar */}
                        <div className="flex gap-4 items-center text-slate-400">
                            <button onClick={(e) => moveCellUpButton(e, index)}><ArrowUp className="w-5 h-5 hover:text-slate-600" /></button>
                            <button onClick={(e) => moveCellDownButton(e, index)}><ArrowDown className="w-5 h-5 hover:text-slate-600" /></button>
                            <button onClick={(e) => delCellButton(e, index)}><Trash className="w-5 h-5 hover:text-slate-600" /></button>
                        </div>
                    </div>

                    {/* Cell textarea */}
                    <textarea
                        className="focus:ring-2 focus:ring-slate-600 rounded-b-xs text-slate-900 text-xl outline-0 p-2 resize-none overflow-hidden" 
                        name="cell"
                        rows={3}
                        value={cellContent}
                        onChange={(e) => handleCellLengthChange(index, e)}
                        ref={(el) => {cellRefs.current[index] = el}} //ref to each cell
                        onKeyDown={(e) => handleKeyboardInput(e, index)} //for ctrl/cmd + Enter
                    />
                </section>
            ))}

            {/* Add new cell button */}
            <button
                className="border-2 border-slate-50 bg-slate-50 text-slate-400 outline-0 hover:border-slate-400 focus:text-slate-50 focus:bg-slate-400 transition-colors rounded-sm flex justify-center p-2"
                onClick={addCellButton}
            ><Plus /></button>

        </section>
    </form>
  )
}

export default NotebookForm