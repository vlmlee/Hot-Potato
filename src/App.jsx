import {useState} from "react";
import {useMutation, useQuery} from "../convex/_generated/react";

export default function App() {
    const players = useQuery("getPlayers") || [];
    performance.measure('getPlayers to Now', "getPlayers");
    const potatoHolder = useQuery("getPotatoHolder");
    performance.measure('getHolder to Now', 'getHolder', "getPlayers");
    const passPotato = useMutation("passPotato");

    return (
        <main>
            <div>
                {players.map((p) => (<div onClick={() => {
                    passPotato(potatoHolder.player_id, p.id)
                }}
                className={potatoHolder.player_id === p.id ? "potato-holder" : ''}
                >Player {p.id}</div>))}
            </div>
        </main>
    );
}
