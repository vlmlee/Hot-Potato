import { useEffect, useRef, useState } from 'react';
import { useMutation } from '../convex/_generated/react';
import receivesPotato from '../convex/receivesPotato';

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
        });
        obs.observe({ type: 'measure' });

        async function _initPlayers() {
            await getPlayers();
        }

        _initPlayers();

        return () => {
            obs.disconnect();
        };
    }, []);

    const [players, setPlayers] = useState([]);
    const [potatoHolder, setPotatoHolder] = useState(null);

    const [potatoCount, setPotatoCount] = useState(1);
    const _addPlayer = useMutation('addPlayer');

    const _userReceivesPotato = useMutation('receivesPotato');
    const _getPlayers = useMutation('getPlayers');
    const _getHolder = useMutation('getPotatoHolder');
    const _passPotato = useMutation('passPotato');
    const _removePlayer = useMutation('removePlayer');

    const startHotPotato = async () => {
        let time = performance.now();

        while (performance.now() - time < 10000) {
            if (players.length) {
                const randomPlayer = players[Math.floor(Math.random() * players.length)];
                if (!potatoHolder) {
                    await _userReceivesPotato(randomPlayer._id);
                    await getHolder();
                } else if (potatoHolder?.id.id !== randomPlayer._id.id) {
                    await passPotato(randomPlayer);
                }
            }
        }
    };

    const getPlayers = async e => {
        window.performance.mark('getPlayers');
        const _players = await _getPlayers();
        window.performance.measure('getPlayers to Now', 'getPlayers');
        setPlayers(_ => _players);
        if (!potatoHolder) {
            await getHolder();
        }
    };

    const getHolder = async e => {
        window.performance.mark('getHolder');
        const _potatoHolder = await _getHolder();
        window.performance.measure('getHolder to Now', 'getHolder');
        setPotatoHolder(_ => _potatoHolder);
    };

    const addPotato = async e => {
        e.preventDefault();
        if (potatoCount < players.length / 2 - 1) {
            setPotatoCount(potatoCount + 1);
        }
    };

    const removePotato = async e => {
        e.preventDefault();
        if (potatoCount > 1 && potatoCount <= players.length / 2) {
            setPotatoCount(potatoCount - 1);
        }
    };

    const addPlayer = async e => {
        e.preventDefault();
        window.performance.mark('addPlayer');
        await _addPlayer();
        window.performance.measure('addPlayer to Now', 'addPlayer');
        await getPlayers();
    };

    const removePlayer = async p => {
        window.performance.mark('removePlayer');
        await _removePlayer(p._id);
        window.performance.measure('removePlayer to Now', 'removePlayer');
        await getPlayers();
    };

    const passPotato = async p => {
        if (potatoHolder && potatoHolder?.id.id !== p._id.id) {
            window.performance.mark('passPotato');
            _passPotato(potatoHolder, p._id);
            window.performance.measure('passPotato to Now', 'passPotato');
            await getHolder();
        }
    };

    return (
        <main>
            <div className={'instructions'}>
                <div className={'instructions__number'}>Number of hot potatoes: {potatoCount}</div>
                <div className={'instructions__keys'}>
                    <br />
                    Instructions:
                    <br />* Left-click on a player to pass the hot potato.
                    <br />* Right-click to remove a player.
                    <br />* Add a player by clicking the "Add Player" button.
                    <br />* Add another hot potato by clicking the "Add Potato" button.
                    <br />* Remove a hot potato by clicking the "Remove Potato" button.
                    <br />* Click on "Start Hot Potato" to automate the Hot Potato for 10 seconds.
                </div>
            </div>
            <div>
                <div className={'heading'}>Players</div>
                <div className={'player__container'}>
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
                            className={'player ' + (potatoHolder?.id.id === p._id.id ? 'potato-holder' : '')}>
                            Player {i + 1}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className={'heading'}>Actions</div>
                <div className={'buttons__container'}>
                    <div>
                        <button onClick={getPlayers}>Get Players</button>
                    </div>
                    <div>
                        <button onClick={addPlayer}>Add Player</button>
                    </div>
                    <div>
                        <button onClick={getHolder}>Get Holder</button>
                    </div>
                    <div>
                        <button onClick={addPotato}>Add Potato</button>
                    </div>
                    <div>
                        <button onClick={removePotato}>Remove Potato</button>
                    </div>
                    <div>
                        <button onClick={startHotPotato}>Start Hot Potato</button>
                    </div>
                </div>
            </div>
            <div>
                <div className={'heading__logs'}>Logs</div>
                <div className={'logs'}>
                    <div>
                        <div className={'logs__label'}>Get Players (Collect)</div>
                        <div>{log.current.getPlayers.toFixed(5)}ms</div>
                    </div>
                    <div>
                        <div className={'logs__label'}>Get Holder (Get)</div>
                        <div>{log.current.getHolder.toFixed(5)}ms</div>
                    </div>
                    <div>
                        <div className={'logs__label'}>Pass Potato (Patch x2)</div>
                        <div>{log.current.passPotato.toFixed(5)}ms</div>
                    </div>
                    <div>
                        <div className={'logs__label'}>Add Player (Insert)</div>
                        <div>{log.current.addPlayer.toFixed(5)}ms</div>
                    </div>
                    <div>
                        <div className={'logs__label'}>Remove Player (Delete)</div>
                        <div>{log.current.removePlayer.toFixed(5)}ms</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
