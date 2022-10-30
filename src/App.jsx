import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '../convex/_generated/react';
import usePerfHook from './perf';

export default function App() {
    const perfLogs = usePerfHook();
    const userReceivesPotato = useMutation('receivesPotato');
    const players = useQuery('getPlayers') || [];
    console.log(players);
    if (window.performance.getEntriesByName('getPlayers').length) {
        window.performance.measure('getPlayers to Now', 'getPlayers');
    }
    const potatoHolder = useQuery('getPotatoHolder');
    console.log(potatoHolder);
    if (window.performance.getEntriesByName('getPlayers').length) {
        window.performance.measure('getHolder to Now', 'getHolder', 'getPlayers');
    }
    const passPotato = useMutation('passPotato');
    const [potatoCount, setPotatoCount] = useState(0);
    const _addPlayer = useMutation('addPlayer');

    useEffect(() => {
        async function startHotPotato() {
            if (players.length) {
                const randomPlayer = players[Math.floor(Math.random() * players.length)];
                await userReceivesPotato(randomPlayer._id.id);
            }
        }

        startHotPotato();
    }, []);

    const addPotato = async e => {
        e.preventDefault();
        setPotatoCount(potatoCount + 1);
    };

    const addPlayer = async e => {
        e.preventDefault();
        await _addPlayer();
    };

    return (
        <main>
            <div>Number of hot potatoes: {potatoCount}</div>
            <div>
                {players.map(p => (
                    <div
                        onClick={() => {
                            if (potatoHolder) {
                                passPotato(potatoHolder?.player_id, p._id.id);
                            }
                        }}
                        className={potatoHolder?.player_id === p._id.id ? 'potato-holder' : ''}>
                        Player {p._id.id}
                    </div>
                ))}
            </div>
            <div>
                {perfLogs.map(p => (
                    <div>
                        <div>{p.name}</div>
                        <div>{p.duration}</div>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={addPlayer}>Add Player</button>
            </div>
            <div>
                <button onClick={addPotato}>Add Potato</button>
            </div>
        </main>
    );
}
