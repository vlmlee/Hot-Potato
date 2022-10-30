import {useEffect, useState} from "react";
import {useMutation, useQuery} from "../convex/_generated/react";
import usePerfHook from "./perf";

export default function App() {
    const perfLogs = usePerfHook();
    const userReceivesPotato = useMutation("receivesPotato");
    const players = useQuery("getPlayers") || [];
    performance.measure('getPlayers to Now', "getPlayers");
    const potatoHolder = useQuery("getPotatoHolder");
    performance.measure('getHolder to Now', 'getHolder', "getPlayers");
    const passPotato = useMutation("passPotato");

    useEffect(() => {
        async function startHotPotato() {
            const randomId = Math.floor(Math.random() * 10);
            await userReceivesPotato(randomId);
        }

        startHotPotato();
    }, []);

    return (
        <main>
            <div>
                {players.map((p) => (<div onClick={() => {
                    passPotato(potatoHolder.player_id, p.id)
                }}
                className={potatoHolder.player_id === p.id ? "potato-holder" : ''}
                >Player {p.id}</div>))}
            </div>
            <div>
                {perfLogs.map(p => (<div>
                    <div>
                        {p.name}
                    </div>
                    <div>
                        {p.duration}
                    </div>
                </div>))}
            </div>
        </main>
    );
}
