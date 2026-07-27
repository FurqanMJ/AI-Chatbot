import { useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function InputBox({ sendMessage }) {

    const [text, setText] = useState("");

    const textareaRef = useRef();

    const resize = () => {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
            textareaRef.current.scrollHeight + "px";
    };

    const handleSend = () => {

        if(!text.trim()) return;

        // console.log("sending:", text);

        sendMessage(text);

        setText("");

        textareaRef.current.style.height="50px";

    };

    return (

        <div className="input-area">

            <textarea

                ref={textareaRef}

                rows={1}

                value={text}

                placeholder="Message AI..."

                onChange={(e)=>{

                    setText(e.target.value);

                    resize();

                }}

                onKeyDown={(e)=>{

                    if(e.key==="Enter"&&!e.shiftKey){

                        e.preventDefault();

                        handleSend();

                    }

                }}

            ></textarea>

            <button onClick={handleSend}>

                <FaPaperPlane/>

            </button>

        </div>

    );

}