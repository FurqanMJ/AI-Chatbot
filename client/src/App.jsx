import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/chat.css";
import "./styles/input.css";
import "./styles/markdown.css";
import "./styles/message.css";
import "./styles/typing.css";

import Sidebar from "./components/layout/Sidebar";
import ChatWindow from "./components/layout/ChatWindow";

export default function App(){

    return(

<div className="app">

<Sidebar/>

<ChatWindow/>

</div>

);

}