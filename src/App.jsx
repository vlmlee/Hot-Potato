import {useState} from "react";
import {useMutation, useQuery} from "../convex/_generated/react";

export default function App() {
    // const messages = useQuery("listMessages") || [];
    // const sendMessage = useMutation("sendMessage");
    // const selectedMessage = useQuery("getMessage", 'based');
    // const [message, setMessage] = useState(selectedMessage);
    //
    // const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
    //
    // const updateMessage = (e) => {
    //     e.preventDefault();
    //     sendMessage(e.target.value, name);
    //     setMessage(e.target.value);
    // };

    return (
        <main>
            <h1>Convex Chat</h1>
            <p className="badge">
                <span>{name}</span>
            </p>
            {/*<ul>*/}
            {/*    {messages.map(message => (*/}
            {/*        <li key={message._id}>*/}
            {/*            <span>{message.author}:</span>*/}
            {/*            <span>{message.body}</span>*/}
            {/*            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            {/*<input onChange={(e) => updateMessage(e)} value={message.body}/>*/}
        </main>
    );
}
