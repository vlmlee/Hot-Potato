import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '../convex/_generated/react';
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
    const [potatoHolders, setPotatoHolder] = useState([]);
    const [potatoCount, setPotatoCount] = useState(1);

    const queriedPlayers = useQuery('queryPlayers') || [];
    const queriedHolders = useQuery('queryHolders') || [];

    const _addPlayer = useMutation('addPlayer');
    const _receivesPotato = useMutation('receivesPotato');
    const _getPlayers = useMutation('getPlayers');
    const _getHolders = useMutation('getPotatoHolders');
    const _passPotato = useMutation('passPotato');
    const _removePlayer = useMutation('removePlayer');
    const _removePotato = useMutation('removePotato');

    const startHotPotato = async () => {
        let time = performance.now();

        while (performance.now() - time < 10000) {
            if (players.length) {
                const _potatoHolders = await _getHolders();

                if (!_potatoHolders.length) {
                    const randomPlayer = players[Math.floor(Math.random() * players.length)];
                    await _receivesPotato(randomPlayer._id);
                    await getHolders();
                } else if (_potatoHolders.length < potatoCount) {
                    let i = _potatoHolders.length;

                    while (i < potatoCount) {
                        const randomPlayer = players[Math.floor(Math.random() * players.length)];
                        if (
                            _potatoHolders.findIndex(potatoHolder => potatoHolder?.id.id === randomPlayer._id.id) === -1
                        ) {
                            await _receivesPotato(randomPlayer._id);
                            await getHolders();
                            i++;
                        }
                    }
                } else {
                    let i = 0;

                    while (i < potatoCount) {
                        const randomPlayer = players[Math.floor(Math.random() * players.length)];
                        if (
                            _potatoHolders.findIndex(potatoHolder => potatoHolder.id.id === randomPlayer._id.id) === -1
                        ) {
                            await passPotato(randomPlayer);
                            await getHolders();
                            i++;
                        }
                    }
                }
            }
        }
    };

    const getPlayers = async e => {
        window.performance.mark('getPlayers');
        const _players = await _getPlayers();
        window.performance.measure('getPlayers to Now', 'getPlayers');
        setPlayers(_ => _players);
        if (!potatoHolders.length) {
            await getHolders();
        }
    };

    const getHolders = async e => {
        window.performance.mark('getHolder');
        const _potatoHolders = await _getHolders();
        window.performance.measure('getHolder to Now', 'getHolder');
        setPotatoHolder(_ => _potatoHolders);
        setPotatoCount(_ => _potatoHolders.length);
    };

    const addPotato = async e => {
        e.preventDefault();
        if (potatoCount < players.length / 2 - 1) {
            setPotatoCount(prev => prev + 1);
            let i = 0;
            while (i < 1) {
                const randomPlayer = players[Math.floor(Math.random() * players.length)];
                if (potatoHolders.findIndex(potatoHolder => potatoHolder?.id.id === randomPlayer._id.id) === -1) {
                    await _receivesPotato(randomPlayer._id);
                    await getPlayers();
                    await getHolders();
                    i++;
                }
            }
        }
    };

    const removePotato = async e => {
        e.preventDefault();
        if (potatoCount > 1 && potatoCount <= players.length) {
            setPotatoCount(prev => prev - 1);
            const _potatoHolders = await _getHolders();
            const randomPotatoHolder = _potatoHolders[Math.floor(Math.random() * _potatoHolders.length)];
            await _removePotato(randomPotatoHolder);
            await getPlayers();
            await getHolders();
        }
    };

    const addPlayer = async e => {
        e.preventDefault();
        window.performance.mark('addPlayer');
        await _addPlayer();
        window.performance.measure('addPlayer to Now', 'addPlayer');
        await getPlayers();
        await getHolders();
    };

    const removePlayer = async p => {
        window.performance.mark('removePlayer');
        await _removePlayer(p._id);
        window.performance.measure('removePlayer to Now', 'removePlayer');
        await getPlayers();
        await getHolders();
    };

    const passPotato = async p => {
        const _potatoHolders = await _getHolders();
        const isAlreadyHolding = _potatoHolders.findIndex(potatoHolder => potatoHolder?.id.id === p._id.id) !== -1;
        if (_potatoHolders.length && !isAlreadyHolding) {
            const randomPotatoHolder = _potatoHolders[Math.floor(Math.random() * _potatoHolders.length)];
            window.performance.mark('passPotato');
            await _passPotato(randomPotatoHolder, p._id);
            window.performance.measure('passPotato to Now', 'passPotato');
            await getHolders();
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
                    <br />* There can only be at most (n/2)-1 potatoes.
                    <br />* Remove a hot potato by clicking the "Remove Potato" button.
                    <br />* If there are 0 potatoes, you cannot start the automated Hot Potato.
                    <br />* Click on "Start Hot Potato" to automate the Hot Potato for 10 seconds.
                    <br />* You are welcomed to intercept the automation by adding and removing players, adding and
                    removing potatoes, or trying to interrupt the potato elsewhere, such as opening another window.
                </div>
            </div>
            <div>
                <div className={'heading'}>Players</div>
                <div className={'player__container'}>
                    {queriedPlayers.map((p, i) => (
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
                            className={
                                'player ' +
                                (queriedHolders.findIndex(potatoHolder => potatoHolder?.id.id === p._id.id) !== -1
                                    ? 'potato-holder'
                                    : '')
                            }>
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
                        <button onClick={getHolders}>Get Holders</button>
                    </div>
                    <div>
                        <button onClick={addPotato}>Add Potato</button>
                    </div>
                    <div>
                        <button onClick={removePotato}>Remove Potato</button>
                    </div>
                    <div>
                        <button
                            disabled={potatoCount === 0}
                            className={potatoCount === 0 ? 'red' : ''}
                            onClick={potatoCount !== 0 ? startHotPotato : null}>
                            Start Hot Potato
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div className={'heading__logs'}>Average latency</div>
                <div className={'logs'}>
                    <div>
                        <div className={'logs__label'}>Get Players (Query All)</div>
                        <div>{log.current.getPlayers.toFixed(5)}ms</div>
                    </div>
                    <div>
                        <div className={'logs__label'}>Get Holders (Get One or a Few)</div>
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
