(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/store/gameStore.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useGameStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        players: [],
        games: [],
        currentGame: null,
        // Player actions
        addPlayer: (name)=>{
            const newPlayer = {
                id: Date.now().toString(),
                name,
                createdAt: Date.now()
            };
            set((state)=>({
                    players: [
                        ...state.players,
                        newPlayer
                    ]
                }));
            return newPlayer;
        },
        removePlayer: (id)=>{
            set((state)=>({
                    players: state.players.filter((player)=>player.id !== id)
                }));
        },
        getPlayer: (id)=>{
            return get().players.find((player)=>player.id === id);
        },
        // Game actions
        createGame: (playerIds, startingScore)=>{
            const newGame = {
                id: Date.now().toString(),
                playerIds,
                scores: [],
                createdAt: Date.now(),
                startingScore
            };
            set((state)=>({
                    games: [
                        ...state.games,
                        newGame
                    ],
                    currentGame: newGame
                }));
            return newGame;
        },
        endGame: (id)=>{
            set((state)=>{
                const updatedGames = state.games.map((game)=>{
                    if (game.id === id) {
                        return {
                            ...game,
                            endedAt: Date.now()
                        };
                    }
                    return game;
                });
                return {
                    games: updatedGames,
                    currentGame: state.currentGame?.id === id ? null : state.currentGame
                };
            });
        },
        getCurrentGame: ()=>{
            return get().currentGame;
        },
        // Kontrollera om ett kast är giltigt enligt dartreglerna
        checkValidThrow: (playerId, value, type, gameId)=>{
            const { games, currentGame } = get();
            const targetGameId = gameId || currentGame?.id;
            if (!targetGameId) return {
                valid: false,
                message: "Inget aktivt spel"
            };
            const game = games.find((g)=>g.id === targetGameId);
            if (!game) return {
                valid: false,
                message: "Spelet hittades inte"
            };
            // Beräkna nuvarande poäng
            const currentScore = get().getPlayerRemainingScore(playerId, targetGameId);
            // Beräkna värdet av kastet
            let throwValue = value;
            if (type === 'double') throwValue *= 2;
            if (type === 'triple') throwValue *= 3;
            // Beräkna den nya poängen efter kastet
            const newScore = currentScore - throwValue;
            // Kontrollera om kastet leder till "bust" (poäng under 0 eller exakt 1)
            if (newScore < 0) {
                return {
                    valid: false,
                    message: "Bust! Poängen blev under 0."
                };
            }
            if (newScore === 1) {
                return {
                    valid: false,
                    message: "Bust! Poängen blev exakt 1."
                };
            }
            // Kontrollera om det är en giltig checkout (om poängen blir 0)
            if (newScore === 0 && type !== 'double' && type !== 'innerBull') {
                return {
                    valid: false,
                    message: "Ogiltigt! Checkout måste ske på en dubbel."
                };
            }
            return {
                valid: true
            };
        },
        // Score actions
        addScore: (playerId, value, type)=>{
            const { currentGame } = get();
            if (!currentGame) {
                console.error('No active game');
                return;
            }
            // Kontrollera om kastet är giltigt enligt dartreglerna
            const validity = get().checkValidThrow(playerId, value, type, currentGame.id);
            if (!validity.valid) {
                console.warn('Ogiltigt kast:', validity.message);
                return;
            }
            const latestRound = get().getLatestRound(playerId, currentGame.id);
            const newRound = latestRound + 1;
            const newScore = {
                id: Date.now().toString(),
                value,
                type,
                playerId,
                timestamp: Date.now(),
                gameId: currentGame.id,
                round: newRound
            };
            set((state)=>{
                const updatedGame = {
                    ...currentGame,
                    scores: [
                        ...currentGame.scores,
                        newScore
                    ]
                };
                const updatedGames = state.games.map((game)=>{
                    if (game.id === currentGame.id) {
                        return updatedGame;
                    }
                    return game;
                });
                return {
                    games: updatedGames,
                    currentGame: updatedGame
                };
            });
        },
        getPlayerScores: (playerId, gameId)=>{
            const { games, currentGame } = get();
            const targetGameId = gameId || currentGame?.id;
            if (!targetGameId) return [];
            const game = games.find((g)=>g.id === targetGameId);
            if (!game) return [];
            return game.scores.filter((score)=>score.playerId === playerId);
        },
        getLatestRound: (playerId, gameId)=>{
            const playerScores = get().getPlayerScores(playerId, gameId);
            if (playerScores.length === 0) return 0;
            const rounds = playerScores.map((score)=>score.round);
            return Math.max(...rounds);
        },
        getPlayerRemainingScore: (playerId, gameId)=>{
            const { games, currentGame } = get();
            const targetGameId = gameId || currentGame?.id;
            if (!targetGameId) return 0;
            const game = games.find((g)=>g.id === targetGameId);
            if (!game) return 0;
            const startingScore = game.startingScore;
            const playerScores = game.scores.filter((score)=>score.playerId === playerId);
            const scoreSum = playerScores.reduce((sum, score)=>{
                let value = score.value;
                if (score.type === 'double') {
                    value *= 2;
                } else if (score.type === 'triple') {
                    value *= 3;
                }
                return sum + value;
            }, 0);
            return startingScore - scoreSum;
        },
        getPlayerAverageScore: (playerId, gameId)=>{
            const scores = get().getPlayerScores(playerId, gameId);
            if (scores.length === 0) return 0;
            const totalScore = scores.reduce((sum, score)=>{
                let value = score.value;
                if (score.type === 'double') {
                    value *= 2;
                } else if (score.type === 'triple') {
                    value *= 3;
                }
                return sum + value;
            }, 0);
            return Math.round(totalScore / scores.length);
        }
    }), {
    name: 'dart-game-storage'
}));
const __TURBOPACK__default__export__ = useGameStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/DartboardCompactInput.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DartboardCompactInput)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function DartboardCompactInput({ onNumberClick, onBullClick, onMissClick, onScoreSubmit, scoreType, setScoreType, throwCount, disabled }) {
    // Reorganized to 5 rows of 4 columns for symmetry
    const dartboardNumbersGrid = [
        [
            1,
            2,
            3,
            4
        ],
        [
            5,
            6,
            7,
            8
        ],
        [
            9,
            10,
            11,
            12
        ],
        [
            13,
            14,
            15,
            16
        ],
        [
            17,
            18,
            19,
            20
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-black p-2 rounded-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-1.5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between bg-gray-800 rounded-lg p-0.5",
                        children: [
                            "single",
                            "double",
                            "triple"
                        ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setScoreType(type),
                                className: `flex-1 py-0.5 px-1 rounded text-center text-xs mx-0.5 ${scoreType === type ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`,
                                children: type === "single" ? "E" : type === "double" ? "D" : "T"
                            }, type, false, {
                                fileName: "[project]/src/components/DartboardCompactInput.tsx",
                                lineNumber: 42,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/DartboardCompactInput.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/DartboardCompactInput.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between gap-1 mb-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onBullClick(true),
                            disabled: disabled,
                            className: "flex-1 py-0.5 rounded bg-yellow-600 text-white font-medium text-xs",
                            children: "BULL"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DartboardCompactInput.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onBullClick(false),
                            disabled: disabled,
                            className: "flex-1 py-0.5 rounded bg-green-600 text-white font-medium text-xs mx-1",
                            children: "25"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DartboardCompactInput.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onMissClick,
                            disabled: disabled,
                            className: "flex-1 py-0.5 rounded bg-red-600 text-white font-medium text-xs",
                            children: "MISS"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DartboardCompactInput.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DartboardCompactInput.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-1.5",
                    children: dartboardNumbersGrid.map((row, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between gap-1 mb-1",
                            children: row.map((number)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onNumberClick(number),
                                    disabled: disabled,
                                    className: "flex-1 py-0.5 px-0 rounded bg-gray-700 text-white font-medium text-xs mx-0.5",
                                    children: number
                                }, number, false, {
                                    fileName: "[project]/src/components/DartboardCompactInput.tsx",
                                    lineNumber: 87,
                                    columnNumber: 17
                                }, this))
                        }, rowIndex, false, {
                            fileName: "[project]/src/components/DartboardCompactInput.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/DartboardCompactInput.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onScoreSubmit,
                    disabled: disabled && throwCount < 3 || throwCount === 0,
                    className: `w-full py-1 rounded-sm ${disabled && throwCount < 3 || throwCount === 0 ? "bg-gray-600 text-gray-400" : "bg-red-600 text-white"} font-medium text-xs`,
                    children: [
                        "REGISTRERA (",
                        throwCount,
                        "/3)"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DartboardCompactInput.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/DartboardCompactInput.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/DartboardCompactInput.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = DartboardCompactInput;
var _c;
__turbopack_context__.k.register(_c, "DartboardCompactInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/checkoutCalculator.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Definiera typer för ett kast och en checkout-väg
__turbopack_context__.s({
    "calculateCheckout": (()=>calculateCheckout),
    "formatCheckoutPath": (()=>formatCheckoutPath),
    "getRecommendedCheckouts": (()=>getRecommendedCheckouts)
});
// Alla möjliga dubbelsegment (1-20 och bullseye)
const doubles = [
    ...Array.from({
        length: 20
    }, (_, i)=>({
            segment: `D${i + 1}`,
            value: (i + 1) * 2
        })),
    {
        segment: 'DB',
        value: 50
    } // Dubbel bullseye
];
// Alla möjliga trippelsegment (1-20)
const triples = Array.from({
    length: 20
}, (_, i)=>({
        segment: `T${i + 1}`,
        value: (i + 1) * 3
    }));
// Alla möjliga enkla segment (1-20 och bullseye)
const singles = [
    ...Array.from({
        length: 20
    }, (_, i)=>({
            segment: `S${i + 1}`,
            value: i + 1
        })),
    {
        segment: 'SB',
        value: 25
    } // Enkel bullseye (outer bull)
];
// Alla möjliga segment förutom dubbla
const allSegmentsExceptDoubles = [
    ...singles,
    ...triples
];
function calculateCheckout(remainingScore) {
    // Specialfall: Om poängen är 0, finns det ingen checkout
    if (remainingScore <= 0) {
        return [];
    }
    // Specialfall: Om poängen är 1, är det omöjligt att checka ut (bust-regel)
    if (remainingScore === 1) {
        return [
            {
                throws: [
                    {
                        segment: 'D1',
                        value: 2
                    }
                ],
                totalThrows: 1
            }
        ];
    }
    // Specialfall: Om poängen är 2, enda möjligheten är D1
    if (remainingScore === 2) {
        return [
            {
                throws: [
                    {
                        segment: 'D1',
                        value: 2
                    }
                ],
                totalThrows: 1
            }
        ];
    }
    const checkoutPaths = [];
    // En-pils checkout: kolla om poängen kan checkas ut med en dubbel
    const oneThrowDouble = doubles.find((d)=>d.value === remainingScore);
    if (oneThrowDouble) {
        checkoutPaths.push({
            throws: [
                oneThrowDouble
            ],
            totalThrows: 1
        });
    }
    // Två-pilar checkout: kolla alla kombinationer av ett segment följt av en dubbel
    for (const firstThrow of allSegmentsExceptDoubles){
        const scoreAfterFirstThrow = remainingScore - firstThrow.value;
        // Om poängen blir 1 eller under 0, blir det "bust"
        if (scoreAfterFirstThrow <= 1) {
            continue;
        }
        // Hitta dubbel för att checka ut
        const finishingDouble = doubles.find((d)=>d.value === scoreAfterFirstThrow);
        if (finishingDouble) {
            checkoutPaths.push({
                throws: [
                    firstThrow,
                    finishingDouble
                ],
                totalThrows: 2
            });
        }
    }
    // Tre-pilar checkout: kolla alla kombinationer av två segment följda av en dubbel
    // Vi prioriterar att hitta kombinationer där de första två kasten ger höga poäng
    // för att maximera chansen att komma till en enkel dubbel i sista kastet
    for (const firstThrow of allSegmentsExceptDoubles){
        for (const secondThrow of allSegmentsExceptDoubles){
            const scoreAfterTwoThrows = remainingScore - firstThrow.value - secondThrow.value;
            // Om poängen blir 1 eller under 0, blir det "bust"
            if (scoreAfterTwoThrows <= 1) {
                continue;
            }
            // Hitta dubbel för att checka ut
            const finishingDouble = doubles.find((d)=>d.value === scoreAfterTwoThrows);
            if (finishingDouble) {
                checkoutPaths.push({
                    throws: [
                        firstThrow,
                        secondThrow,
                        finishingDouble
                    ],
                    totalThrows: 3
                });
            }
        }
    }
    // Sortera checkout-vägar: först efter antal kast (minst antal först),
    // sedan efter komplexitet (föredra vägar med högre värden på första kasten)
    return checkoutPaths.sort((a, b)=>{
        // Först sortera efter antal kast
        if (a.totalThrows !== b.totalThrows) {
            return a.totalThrows - b.totalThrows;
        }
        // Vid samma antal kast, prioritera vägar med högst första kast
        // eftersom dessa ger större chans att nå en enkel dubbel
        const aFirstValue = a.throws[0].value;
        const bFirstValue = b.throws[0].value;
        return bFirstValue - aFirstValue;
    }).slice(0, 5); // Begränsa till de 5 bästa vägarna
}
function getRecommendedCheckouts(remainingScore) {
    // Hämta alla möjliga checkout-vägar
    const allPaths = calculateCheckout(remainingScore);
    // Om det finns vägar med 1 kast, returnera endast dessa
    const oneThrowPaths = allPaths.filter((path)=>path.totalThrows === 1);
    if (oneThrowPaths.length > 0) {
        return oneThrowPaths.slice(0, 3);
    }
    // Om det finns vägar med 2 kast, returnera endast dessa
    const twoThrowPaths = allPaths.filter((path)=>path.totalThrows === 2);
    if (twoThrowPaths.length > 0) {
        return twoThrowPaths.slice(0, 3);
    }
    // Annars returnera de bästa 3 vägarna (troligen 3-kast vägar)
    return allPaths.slice(0, 3);
}
function formatCheckoutPath(path) {
    return path.throws.map((t)=>t.segment).join(', ');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/CheckoutSuggestion.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CheckoutSuggestion)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$checkoutCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/checkoutCalculator.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function CheckoutSuggestion({ remainingScore, isActive }) {
    _s();
    const [checkoutPaths, setCheckoutPaths] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutSuggestion.useEffect": ()=>{
            // Beräkna checkout-vägar endast om komponenten är aktiv
            if (isActive && remainingScore > 0) {
                const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$checkoutCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRecommendedCheckouts"])(remainingScore);
                setCheckoutPaths(paths);
            } else {
                setCheckoutPaths([]);
            }
        }
    }["CheckoutSuggestion.useEffect"], [
        remainingScore,
        isActive
    ]);
    // Om det inte finns några checkout-vägar eller scoren är 0, visa inget
    if (checkoutPaths.length === 0 || remainingScore === 0) {
        if (remainingScore === 0) {
            return null;
        }
        // Om vi har 1 poäng kvar, visa specialmeddelande
        if (remainingScore === 1) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-yellow-800 font-medium mb-1",
                        children: "Ingen checkout möjlig"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-yellow-700",
                        children: "Med 1 poäng kvar går det inte att checka ut eftersom senaste pilen måste landa i en dubbel."
                    }, void 0, false, {
                        fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-3 bg-gray-50 border border-gray-200 rounded-md p-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-gray-800 font-medium mb-1",
                    children: "Ingen rekommenderad checkout"
                }, void 0, false, {
                    fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-gray-700",
                    children: [
                        "Kunde inte hitta en checkout-väg för ",
                        remainingScore,
                        " poäng med max 3 pilar."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CheckoutSuggestion.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 bg-green-50 border border-green-200 rounded-md p-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-green-800 font-medium mb-1",
                children: [
                    "Checkout-förslag (",
                    checkoutPaths[0].totalThrows,
                    " pilar)"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-1.5",
                children: checkoutPaths.map((path, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-block w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2",
                                children: index + 1
                            }, void 0, false, {
                                fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-green-800 font-medium",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$checkoutCalculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCheckoutPath"])(path)
                            }, void 0, false, {
                                fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-xs text-green-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Kom ihåg: Det sista kastet måste vara en dubbel."
                }, void 0, false, {
                    fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CheckoutSuggestion.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CheckoutSuggestion.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(CheckoutSuggestion, "96+v90vGJZNT6flKVxAo4tSj80k=");
_c = CheckoutSuggestion;
var _c;
__turbopack_context__.k.register(_c, "CheckoutSuggestion");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/game/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>GamePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/gameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DartboardCompactInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DartboardCompactInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CheckoutSuggestion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CheckoutSuggestion.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function GamePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const id = params?.id;
    const [activePlayerId, setActivePlayerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scoreType, setScoreType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("single");
    const [throws, setThrows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { games, addScore, endGame, getPlayer, getPlayerRemainingScore, getPlayerAverageScore, checkValidThrow } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    // Find the game from the store
    const game = games.find((g)=>g.id === id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            // If game doesn't exist, redirect to game page
            if (!game) {
                router.push("/game");
                return;
            }
            // Set active player if not already set
            if (!activePlayerId && game.playerIds && game.playerIds.length > 0) {
                setActivePlayerId(game.playerIds[0]);
            }
        }
    }["GamePage.useEffect"], [
        game,
        activePlayerId,
        router
    ]);
    // Rensa felmeddelandet när spelaren ändras
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            setErrorMessage(null);
        }
    }["GamePage.useEffect"], [
        activePlayerId
    ]);
    // Early return if game is not found
    if (!game) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 text-center",
            children: "Laddar spel..."
        }, void 0, false, {
            fileName: "[project]/src/app/game/[id]/page.tsx",
            lineNumber: 52,
            columnNumber: 12
        }, this);
    }
    const handleNumberClick = (number)=>{
        if (!activePlayerId || throws.length >= 3) return;
        // Validera kast innan det läggs till i vyn
        const throwValue = number;
        const throwType = scoreType;
        const validity = checkValidThrow(activePlayerId, throwValue, throwType, id);
        // Om kastet skulle leda till "bust", visa en varning men låt användaren lägga till det ändå
        // (så att vi kan visa en tydligare varning när de försöker registrera hela rundan)
        if (!validity.valid) {
            setErrorMessage(validity.message || "Ogiltigt kast");
        } else {
            // Rensa tidigare felmeddelanden
            setErrorMessage(null);
        }
        const newThrow = {
            value: number,
            type: scoreType
        };
        setThrows([
            ...throws,
            newThrow
        ]);
    };
    const handleBullClick = (isBullseye)=>{
        if (!activePlayerId || throws.length >= 3) return;
        const type = isBullseye ? "innerBull" : "outerBull";
        const value = isBullseye ? 50 : 25;
        // Validera kast innan det läggs till i vyn
        const validity = checkValidThrow(activePlayerId, value, type, id);
        // Om kastet skulle leda till "bust", visa en varning men låt användaren lägga till det ändå
        if (!validity.valid) {
            setErrorMessage(validity.message || "Ogiltigt kast");
        } else {
            // Rensa tidigare felmeddelanden
            setErrorMessage(null);
        }
        const newThrow = {
            value,
            type
        };
        setThrows([
            ...throws,
            newThrow
        ]);
    };
    const handleMissClick = ()=>{
        if (!activePlayerId || throws.length >= 3) return;
        // Rensa felmeddelande vid miss (eftersom det inte kan leda till bust)
        setErrorMessage(null);
        const newThrow = {
            value: 0,
            type: "single"
        };
        setThrows([
            ...throws,
            newThrow
        ]);
    };
    const handleRemoveThrow = (index)=>{
        const newThrows = [
            ...throws
        ];
        newThrows.splice(index, 1);
        setThrows(newThrows);
        // Rensa felmeddelande när ett kast tas bort
        setErrorMessage(null);
    };
    const handleScoreSubmit = ()=>{
        if (!activePlayerId || throws.length === 0 || !game) return;
        // Kontrollera om någon av kasten skulle leda till bust för att förhindra registrering
        let isBust = false;
        let bustMessage = "";
        // Ackumulera poäng genom att stega igenom alla kast och simulera effekten
        // Använd checkValidThrow för varje steg i simuleringen
        let simulatedRemainingScore = getPlayerRemainingScore(activePlayerId, id);
        for (const throwItem of throws){
            // Simulera kastet och kontrollera validitet
            const validity = checkValidThrow(activePlayerId, throwItem.value, throwItem.type, id);
            if (!validity.valid) {
                isBust = true;
                bustMessage = validity.message || "Ogiltigt kast";
                break;
            }
            // Uppdatera kvarvarande poäng för nästa kast-validering
            let throwValue = throwItem.value;
            if (throwItem.type === 'double') throwValue *= 2;
            if (throwItem.type === 'triple') throwValue *= 3;
            simulatedRemainingScore -= throwValue;
            // Om den simulerade poängen är 0 eller negativ, avbryt (detta är extra kontroll)
            if (simulatedRemainingScore <= 0 && simulatedRemainingScore !== 0) {
                // Om simulerad poäng inte är exakt 0, markera som bust
                // Denna kod bör inte nås om checkValidThrow fungerar korrekt
                if (simulatedRemainingScore !== 0) {
                    isBust = true;
                    bustMessage = "Poängen skulle bli under 0 eller exakt 1.";
                    break;
                }
            }
        }
        if (isBust) {
            // Visa felmeddelande och tillåt inte registrering
            setErrorMessage(bustMessage);
            return;
        }
        // Om ingen bust, registrera alla kast
        throws.forEach((throwItem)=>{
            addScore(activePlayerId, throwItem.value, throwItem.type);
        });
        // Beräkna kvarvarande poäng efter alla kast
        const playerRemainingScore = getPlayerRemainingScore(activePlayerId, id);
        // Kontrollera om spelaren har vunnit (poäng === 0)
        if (playerRemainingScore === 0) {
            endGame(id);
            router.push(`/game/${id}/summary`);
            return;
        }
        // Byt spelare
        if (game.playerIds && game.playerIds.length > 0) {
            const currentPlayerIndex = game.playerIds.indexOf(activePlayerId);
            const nextPlayerIndex = (currentPlayerIndex + 1) % game.playerIds.length;
            setActivePlayerId(game.playerIds[nextPlayerIndex]);
        }
        // Återställ val
        setScoreType("single");
        setThrows([]);
        setErrorMessage(null);
    };
    const calculateScoreValue = (type, value)=>{
        if (type === "double") return value * 2;
        if (type === "triple") return value * 3;
        return value;
    };
    const renderThrowLabel = (throwItem)=>{
        if (throwItem.value === 0) return "Miss";
        if (throwItem.type === "innerBull") return "Bullseye";
        if (throwItem.type === "outerBull") return "Outer Bull";
        return `${throwItem.type === "single" ? "Enkel" : throwItem.type === "double" ? "Dubbel" : "Trippel"} ${throwItem.value}`;
    };
    // Safeguard against null or undefined playerIds
    const playerIds = game.playerIds || [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-6",
                children: "Pågående spel"
            }, void 0, false, {
                fileName: "[project]/src/app/game/[id]/page.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold p-4 bg-gray-100",
                                children: "Spelare"
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/[id]/page.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "divide-y divide-gray-200",
                                children: playerIds.map((playerId)=>{
                                    const player = getPlayer(playerId);
                                    const remainingScore = getPlayerRemainingScore(playerId, id);
                                    const avgScore = getPlayerAverageScore(playerId, id);
                                    const isActive = activePlayerId === playerId;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: `p-4 ${isActive ? "bg-blue-50" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium",
                                                        children: player?.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold",
                                                        children: remainingScore
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/[id]/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: [
                                                    "Snitt: ",
                                                    avgScore > 0 ? avgScore : "-"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/game/[id]/page.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 p-2 bg-blue-100 rounded-md text-sm text-blue-800 mb-2",
                                                        children: "Aktuell spelare"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3",
                                                        children: throws.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-500",
                                                            children: [
                                                                "Inga kast ännu (",
                                                                throws.length,
                                                                "/3)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/game/[id]/page.tsx",
                                                            lineNumber: 243,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white border border-blue-200 rounded-md p-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-blue-800 mb-1 font-medium",
                                                                    children: [
                                                                        "Aktuella kast (",
                                                                        throws.length,
                                                                        "/3):"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                    lineNumber: 248,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: "space-y-1",
                                                                    children: throws.map((throwItem, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            className: "flex justify-between items-center text-sm",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: renderThrowLabel(throwItem)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                                    lineNumber: 254,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-bold mr-2",
                                                                                            children: calculateScoreValue(throwItem.type, throwItem.value)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                                            lineNumber: 256,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>handleRemoveThrow(index),
                                                                                            className: "text-red-500 hover:text-red-700 p-1 text-xs",
                                                                                            children: "×"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                                            lineNumber: 259,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                                    lineNumber: 255,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, index, true, {
                                                                            fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                            lineNumber: 253,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 29
                                                                }, this),
                                                                errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 p-1.5 bg-red-50 border border-red-200 rounded text-xs text-red-700",
                                                                    children: errorMessage
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                                                    lineNumber: 272,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/game/[id]/page.tsx",
                                                            lineNumber: 247,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CheckoutSuggestion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        remainingScore: remainingScore,
                                                        isActive: isActive
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, playerId, true, {
                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/game/[id]/page.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/game/[id]/page.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg shadow-md overflow-hidden mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold p-4 bg-gray-100",
                                    children: activePlayerId ? `${getPlayer(activePlayerId)?.name}s tur (${throws.length}/3)` : "Välj en spelare"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DartboardCompactInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onNumberClick: handleNumberClick,
                                        onBullClick: handleBullClick,
                                        onMissClick: handleMissClick,
                                        onScoreSubmit: handleScoreSubmit,
                                        scoreType: scoreType,
                                        setScoreType: setScoreType,
                                        throwCount: throws.length,
                                        disabled: !activePlayerId || throws.length >= 3
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/game/[id]/page.tsx",
                                        lineNumber: 301,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/game/[id]/page.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/game/[id]/page.tsx",
                            lineNumber: 295,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/game/[id]/page.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/game/[id]/page.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/game/[id]/page.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
_s(GamePage, "w7bSAM8vV/2v0uEO+aobNd2idT0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = GamePage;
var _c;
__turbopack_context__.k.register(_c, "GamePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createStore": (()=>createStore)
});
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}}),
"[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "create": (()=>create),
    "useStore": (()=>useStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, {
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getState())
    }["useStore.useSyncExternalStore[slice]"], {
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getInitialState())
    }["useStore.useSyncExternalStore[slice]"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}}),
"[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "combine": (()=>combine),
    "createJSONStorage": (()=>createJSONStorage),
    "devtools": (()=>devtools),
    "persist": (()=>persist),
    "redux": (()=>redux),
    "subscribeWithSelector": (()=>subscribeWithSelector)
});
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("node_modules/zustand/esm/middleware.mjs")}`;
    }
};
const reduxImpl = (reducer, initial)=>(set, _get, api)=>{
        api.dispatch = (action)=>{
            set((state)=>reducer(state, action), false, action);
            return action;
        };
        api.dispatchFromDevtools = true;
        return {
            dispatch: (...a)=>api.dispatch(...a),
            ...initial
        };
    };
const redux = reduxImpl;
const trackedConnections = /* @__PURE__ */ new Map();
const getTrackedConnectionState = (name)=>{
    const api = trackedConnections.get(name);
    if (!api) return {};
    return Object.fromEntries(Object.entries(api.stores).map(([key, api2])=>[
            key,
            api2.getState()
        ]));
};
const extractConnectionInformation = (store, extensionConnector, options)=>{
    if (store === undefined) {
        return {
            type: "untracked",
            connection: extensionConnector.connect(options)
        };
    }
    const existingConnection = trackedConnections.get(options.name);
    if (existingConnection) {
        return {
            type: "tracked",
            store,
            ...existingConnection
        };
    }
    const newConnection = {
        connection: extensionConnector.connect(options),
        stores: {}
    };
    trackedConnections.set(options.name, newConnection);
    return {
        type: "tracked",
        store,
        ...newConnection
    };
};
const devtoolsImpl = (fn, devtoolsOptions = {})=>(set, get, api)=>{
        const { enabled, anonymousActionType, store, ...options } = devtoolsOptions;
        let extensionConnector;
        try {
            extensionConnector = (enabled != null ? enabled : (__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : void 0) !== "production") && window.__REDUX_DEVTOOLS_EXTENSION__;
        } catch (e) {}
        if (!extensionConnector) {
            return fn(set, get, api);
        }
        const { connection, ...connectionInformation } = extractConnectionInformation(store, extensionConnector, options);
        let isRecording = true;
        api.setState = (state, replace, nameOrAction)=>{
            const r = set(state, replace);
            if (!isRecording) return r;
            const action = nameOrAction === undefined ? {
                type: anonymousActionType || "anonymous"
            } : typeof nameOrAction === "string" ? {
                type: nameOrAction
            } : nameOrAction;
            if (store === undefined) {
                connection == null ? undefined : connection.send(action, get());
                return r;
            }
            connection == null ? undefined : connection.send({
                ...action,
                type: `${store}/${action.type}`
            }, {
                ...getTrackedConnectionState(options.name),
                [store]: api.getState()
            });
            return r;
        };
        const setStateFromDevtools = (...a)=>{
            const originalIsRecording = isRecording;
            isRecording = false;
            set(...a);
            isRecording = originalIsRecording;
        };
        const initialState = fn(api.setState, get, api);
        if (connectionInformation.type === "untracked") {
            connection == null ? undefined : connection.init(initialState);
        } else {
            connectionInformation.stores[connectionInformation.store] = api;
            connection == null ? undefined : connection.init(Object.fromEntries(Object.entries(connectionInformation.stores).map(([key, store2])=>[
                    key,
                    key === connectionInformation.store ? initialState : store2.getState()
                ])));
        }
        if (api.dispatchFromDevtools && typeof api.dispatch === "function") {
            let didWarnAboutReservedActionType = false;
            const originalDispatch = api.dispatch;
            api.dispatch = (...a)=>{
                if ((__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : undefined) !== "production" && a[0].type === "__setState" && !didWarnAboutReservedActionType) {
                    console.warn('[zustand devtools middleware] "__setState" action type is reserved to set state from the devtools. Avoid using it.');
                    didWarnAboutReservedActionType = true;
                }
                originalDispatch(...a);
            };
        }
        connection.subscribe((message)=>{
            var _a;
            switch(message.type){
                case "ACTION":
                    if (typeof message.payload !== "string") {
                        console.error("[zustand devtools middleware] Unsupported action format");
                        return;
                    }
                    return parseJsonThen(message.payload, (action)=>{
                        if (action.type === "__setState") {
                            if (store === undefined) {
                                setStateFromDevtools(action.state);
                                return;
                            }
                            if (Object.keys(action.state).length !== 1) {
                                console.error(`
                    [zustand devtools middleware] Unsupported __setState action format.
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `);
                            }
                            const stateFromDevtools = action.state[store];
                            if (stateFromDevtools === undefined || stateFromDevtools === null) {
                                return;
                            }
                            if (JSON.stringify(api.getState()) !== JSON.stringify(stateFromDevtools)) {
                                setStateFromDevtools(stateFromDevtools);
                            }
                            return;
                        }
                        if (!api.dispatchFromDevtools) return;
                        if (typeof api.dispatch !== "function") return;
                        api.dispatch(action);
                    });
                case "DISPATCH":
                    switch(message.payload.type){
                        case "RESET":
                            setStateFromDevtools(initialState);
                            if (store === undefined) {
                                return connection == null ? undefined : connection.init(api.getState());
                            }
                            return connection == null ? undefined : connection.init(getTrackedConnectionState(options.name));
                        case "COMMIT":
                            if (store === undefined) {
                                connection == null ? undefined : connection.init(api.getState());
                                return;
                            }
                            return connection == null ? undefined : connection.init(getTrackedConnectionState(options.name));
                        case "ROLLBACK":
                            return parseJsonThen(message.state, (state)=>{
                                if (store === undefined) {
                                    setStateFromDevtools(state);
                                    connection == null ? undefined : connection.init(api.getState());
                                    return;
                                }
                                setStateFromDevtools(state[store]);
                                connection == null ? undefined : connection.init(getTrackedConnectionState(options.name));
                            });
                        case "JUMP_TO_STATE":
                        case "JUMP_TO_ACTION":
                            return parseJsonThen(message.state, (state)=>{
                                if (store === undefined) {
                                    setStateFromDevtools(state);
                                    return;
                                }
                                if (JSON.stringify(api.getState()) !== JSON.stringify(state[store])) {
                                    setStateFromDevtools(state[store]);
                                }
                            });
                        case "IMPORT_STATE":
                            {
                                const { nextLiftedState } = message.payload;
                                const lastComputedState = (_a = nextLiftedState.computedStates.slice(-1)[0]) == null ? undefined : _a.state;
                                if (!lastComputedState) return;
                                if (store === undefined) {
                                    setStateFromDevtools(lastComputedState);
                                } else {
                                    setStateFromDevtools(lastComputedState[store]);
                                }
                                connection == null ? undefined : connection.send(null, // FIXME no-any
                                nextLiftedState);
                                return;
                            }
                        case "PAUSE_RECORDING":
                            return isRecording = !isRecording;
                    }
                    return;
            }
        });
        return initialState;
    };
const devtools = devtoolsImpl;
const parseJsonThen = (stringified, f)=>{
    let parsed;
    try {
        parsed = JSON.parse(stringified);
    } catch (e) {
        console.error("[zustand devtools middleware] Could not parse the received json", e);
    }
    if (parsed !== undefined) f(parsed);
};
const subscribeWithSelectorImpl = (fn)=>(set, get, api)=>{
        const origSubscribe = api.subscribe;
        api.subscribe = (selector, optListener, options)=>{
            let listener = selector;
            if (optListener) {
                const equalityFn = (options == null ? undefined : options.equalityFn) || Object.is;
                let currentSlice = selector(api.getState());
                listener = (state)=>{
                    const nextSlice = selector(state);
                    if (!equalityFn(currentSlice, nextSlice)) {
                        const previousSlice = currentSlice;
                        optListener(currentSlice = nextSlice, previousSlice);
                    }
                };
                if (options == null ? undefined : options.fireImmediately) {
                    optListener(currentSlice, currentSlice);
                }
            }
            return origSubscribe(listener);
        };
        const initialState = fn(set, get, api);
        return initialState;
    };
const subscribeWithSelector = subscribeWithSelectorImpl;
const combine = (initialState, create)=>(...a)=>Object.assign({}, initialState, create(...a));
function createJSONStorage(getStorage, options) {
    let storage;
    try {
        storage = getStorage();
    } catch (e) {
        return;
    }
    const persistStorage = {
        getItem: (name)=>{
            var _a;
            const parse = (str2)=>{
                if (str2 === null) {
                    return null;
                }
                return JSON.parse(str2, options == null ? undefined : options.reviver);
            };
            const str = (_a = storage.getItem(name)) != null ? _a : null;
            if (str instanceof Promise) {
                return str.then(parse);
            }
            return parse(str);
        },
        setItem: (name, newValue)=>storage.setItem(name, JSON.stringify(newValue, options == null ? undefined : options.replacer)),
        removeItem: (name)=>storage.removeItem(name)
    };
    return persistStorage;
}
const toThenable = (fn)=>(input)=>{
        try {
            const result = fn(input);
            if (result instanceof Promise) {
                return result;
            }
            return {
                then (onFulfilled) {
                    return toThenable(onFulfilled)(result);
                },
                catch (_onRejected) {
                    return this;
                }
            };
        } catch (e) {
            return {
                then (_onFulfilled) {
                    return this;
                },
                catch (onRejected) {
                    return toThenable(onRejected)(e);
                }
            };
        }
    };
const persistImpl = (config, baseOptions)=>(set, get, api)=>{
        let options = {
            storage: createJSONStorage(()=>localStorage),
            partialize: (state)=>state,
            version: 0,
            merge: (persistedState, currentState)=>({
                    ...currentState,
                    ...persistedState
                }),
            ...baseOptions
        };
        let hasHydrated = false;
        const hydrationListeners = /* @__PURE__ */ new Set();
        const finishHydrationListeners = /* @__PURE__ */ new Set();
        let storage = options.storage;
        if (!storage) {
            return config((...args)=>{
                console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
                set(...args);
            }, get, api);
        }
        const setItem = ()=>{
            const state = options.partialize({
                ...get()
            });
            return storage.setItem(options.name, {
                state,
                version: options.version
            });
        };
        const savedSetState = api.setState;
        api.setState = (state, replace)=>{
            savedSetState(state, replace);
            void setItem();
        };
        const configResult = config((...args)=>{
            set(...args);
            void setItem();
        }, get, api);
        api.getInitialState = ()=>configResult;
        let stateFromStorage;
        const hydrate = ()=>{
            var _a, _b;
            if (!storage) return;
            hasHydrated = false;
            hydrationListeners.forEach((cb)=>{
                var _a2;
                return cb((_a2 = get()) != null ? _a2 : configResult);
            });
            const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? undefined : _b.call(options, (_a = get()) != null ? _a : configResult)) || undefined;
            return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue)=>{
                if (deserializedStorageValue) {
                    if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
                        if (options.migrate) {
                            const migration = options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
                            if (migration instanceof Promise) {
                                return migration.then((result)=>[
                                        true,
                                        result
                                    ]);
                            }
                            return [
                                true,
                                migration
                            ];
                        }
                        console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
                    } else {
                        return [
                            false,
                            deserializedStorageValue.state
                        ];
                    }
                }
                return [
                    false,
                    undefined
                ];
            }).then((migrationResult)=>{
                var _a2;
                const [migrated, migratedState] = migrationResult;
                stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
                set(stateFromStorage, true);
                if (migrated) {
                    return setItem();
                }
            }).then(()=>{
                postRehydrationCallback == null ? undefined : postRehydrationCallback(stateFromStorage, undefined);
                stateFromStorage = get();
                hasHydrated = true;
                finishHydrationListeners.forEach((cb)=>cb(stateFromStorage));
            }).catch((e)=>{
                postRehydrationCallback == null ? undefined : postRehydrationCallback(undefined, e);
            });
        };
        api.persist = {
            setOptions: (newOptions)=>{
                options = {
                    ...options,
                    ...newOptions
                };
                if (newOptions.storage) {
                    storage = newOptions.storage;
                }
            },
            clearStorage: ()=>{
                storage == null ? undefined : storage.removeItem(options.name);
            },
            getOptions: ()=>options,
            rehydrate: ()=>hydrate(),
            hasHydrated: ()=>hasHydrated,
            onHydrate: (cb)=>{
                hydrationListeners.add(cb);
                return ()=>{
                    hydrationListeners.delete(cb);
                };
            },
            onFinishHydration: (cb)=>{
                finishHydrationListeners.add(cb);
                return ()=>{
                    finishHydrationListeners.delete(cb);
                };
            }
        };
        if (!options.skipHydration) {
            hydrate();
        }
        return stateFromStorage || configResult;
    };
const persist = persistImpl;
;
}}),
}]);

//# sourceMappingURL=_35ce9fd4._.js.map