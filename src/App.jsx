import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '../convex/_generated/react';

export default function App() {
    const log = useRef({
        getPlayers: 0,
        getHolder: 0,
        passPotato: 0,
        addPlayer: 0,
        removePlayer: 0
    });
    let init = false;
    useEffect(() => {
        const obs = new PerformanceObserver(items => {
            const _getPlayersEntries = items.getEntriesByName('getPlayers to Now');
            const _getHoldersEntries = items.getEntriesByName('getHolder to Now');
            const _passPotatoEntries = items.getEntriesByName('passPotato to Now');
            const _addPlayerEntries = items.getEntriesByName('addPlayer to Now');
            const _removePlayerEntries = items.getEntriesByName('removePlayer to Now');

            let averageGetPlayers;
            let averageGetHolders;
            let averagePassPotato;
            let averageAddPlayer;
            let averageRemovePlayer;

            if (_getPlayersEntries.length) {
                averageGetPlayers = init
                    ? 0.5 *
                      (log.current.getPlayers +
                          _getPlayersEntries.reduce((acc, cur) => {
                              acc = acc + cur.duration ?? 0;
                              return acc;
                          }, 0) /
                              _getPlayersEntries.length)
                    : _getPlayersEntries.reduce((acc, cur) => acc + cur.duration, 0) / _getPlayersEntries.length;
                log.current.getPlayers = averageGetPlayers;
            }

            if (_getHoldersEntries.length) {
                averageGetHolders = init
                    ? 0.5 *
                      (log.current.getHolder +
                          _getHoldersEntries.reduce((acc, cur) => acc + cur.duration, 0) / _getHoldersEntries.length)
                    : _getHoldersEntries.reduce((acc, cur) => acc + cur.duration, 0) / _getHoldersEntries.length;
                log.current.getHolder = averageGetHolders;
            }

            if (_passPotatoEntries.length) {
                averagePassPotato = init
                    ? 0.5 *
                      (log.current.passPotato +
                          _passPotatoEntries.reduce((acc, cur) => acc + cur.duration, 0) / _passPotatoEntries.length)
                    : _passPotatoEntries.reduce((acc, cur) => acc + cur.duration, 0) / _passPotatoEntries.length;
                log.current.passPotato = averagePassPotato;
            }

            if (_addPlayerEntries.length) {
                averageAddPlayer = init
                    ? 0.5 *
                      (log.current.addPlayer +
                          _addPlayerEntries.reduce((acc, cur) => acc + cur.duration, 0) / _addPlayerEntries.length)
                    : _addPlayerEntries.reduce((acc, cur) => acc + cur.duration, 0) / _addPlayerEntries.length;
                log.current.addPlayer = averageAddPlayer;
            }

            if (_removePlayerEntries.length) {
                averageRemovePlayer = init
                    ? 0.5 *
                      (log.current.removePlayer +
                          _removePlayerEntries.reduce((acc, cur) => acc + cur.duration, 0) /
                              _removePlayerEntries.length)
                    : _removePlayerEntries.reduce((acc, cur) => acc + cur.duration, 0) / _removePlayerEntries.length;
                log.current.removePlayer = averageRemovePlayer;
            }

            init = true;
            window.performance.clearMarks();
        });
        obs.observe({ type: 'measure' });

        return () => {
            obs.disconnect();
        };
    }, []);

    window.performance.mark('getPlayers');
    const players = useQuery('getPlayers') || [];
    window.performance.measure('getPlayers to Now', 'getPlayers');

    window.performance.mark('getHolder');
    const potatoHolder = useQuery('getPotatoHolder');
    window.performance.measure('getHolder to Now', 'getHolder');

    const [potatoCount, setPotatoCount] = useState(0);
    const _addPlayer = useMutation('addPlayer');

    const userReceivesPotato = useMutation('receivesPotato');
    const _passPotato = useMutation('passPotato');
    const _removePlayer = useMutation('removePlayer');

    const startHotPotato = async () => {
        if (players.length) {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            await userReceivesPotato(randomPlayer._id);
        }
    };

    const addPotato = async e => {
        e.preventDefault();
        setPotatoCount(potatoCount + 1);
    };

    const addPlayer = async e => {
        e.preventDefault();
        window.performance.mark('addPlayer');
        await _addPlayer();
        window.performance.measure('addPlayer to Now', 'addPlayer');
    };

    const passPotato = async p => {
        if (potatoHolder && potatoHolder?.id.id !== p._id.id) {
            window.performance.mark('passPotato');
            _passPotato(potatoHolder, p._id);
            window.performance.measure('passPotato to Now', 'passPotato');
        }
    };

    const removePlayer = async p => {
        window.performance.mark('removePlayer');
        await _removePlayer(p._id);
        window.performance.measure('removePlayer to Now', 'removePlayer');
    };

    return (
        <main>
            <div>Number of hot potatoes: {potatoCount}</div>
            <div>
                {players.map((p, i) => (
                    <div
                        key={`${p._id.id}`}
                        onContextMenu={e => {
                            e.preventDefault();
                            removePlayer(p);
                        }}
                        onClick={e => {
                            e.preventDefault();
                            passPotato(p);
                        }}
                        className={potatoHolder?.id.id === p._id.id ? 'potato-holder' : ''}>
                        Player {p._id.id}
                    </div>
                ))}
            </div>
            <div>
                <button onClick={addPlayer}>Add Player</button>
            </div>
            <div>
                <button onClick={addPotato}>Add Potato</button>
            </div>
            <div>
                <button onClick={startHotPotato}>Start Hot Potato</button>
            </div>
            <div>
                Logs
                <div>
                    <div>
                        <div>Get Players (Collect)</div>
                        <div>{log.current.getPlayers}ms</div>
                    </div>
                    <div>
                        <div>Get Holder (Get)</div>
                        <div>{log.current.getHolder}ms</div>
                    </div>
                    <div>
                        <div>Pass Potato (Patch x2)</div>
                        <div>{log.current.passPotato}ms</div>
                    </div>
                    <div>
                        <div>Add Player (Insert)</div>
                        <div>{log.current.addPlayer}ms</div>
                    </div>
                    <div>
                        <div>Remove Player (Delete)</div>
                        <div>{log.current.removePlayer}ms</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
