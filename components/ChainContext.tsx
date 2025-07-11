import { saveToLocalStorage } from "@/lib/saveToLocalStorage";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export const MAX_GUESSES = 5;

type Status = "guessing" | "revealing" | "selecting" | "winner" | "loser";
export type Guess = string[];

interface ChainContextData {
  userGuesses: Guess[];
  correctChain: string[];
  currentChain: string[];
  solvedByIndex: boolean[];
  currentHintIndex: number;
  currentGuessValid: boolean;
  status: Status;
  guessesRemaining: number;
}

interface ChainContextApi {
  setGuess: (index: number, guess: string) => void;
  confirmGuess: () => void;
  resetGame: () => void;
  selectHintIndex: (index: number) => void;
  resetGuess: () => void;
  setStatus: (status: Status) => void;
}

interface ChainProviderProps {
  correctChain: string[];
  savedData: SaveData | null;
}

interface ChainState {
  userGuesses: Guess[];
  currentSuffixes: string[];
  hints: number[];
  status: Status;
}

type SaveData = {
  userGuesses: Guess[];
  hints: number[];
};

type ChainAction =
  | { type: "setGuess"; payload: { index: number; guess: string; currentChain: string[] } }
  | { type: "confirmGuess"; payload: { currentGuess: string[] } }
  | { type: "selectHintIndex"; payload: { index: number } }
  | { type: "resetGuess" }
  | { type: "resetGame" }
  | { type: "setStatus"; payload: Status };

const ChainDataContext = createContext<ChainContextData | null>(null);
const ChainApiContext = createContext<ChainContextApi | null>(null);

export function ChainProvider({ children, correctChain, savedData }: PropsWithChildren<ChainProviderProps>) {
  const defaultInitialState: ChainState = {
    userGuesses: [],
    currentSuffixes: correctChain.map(() => ""),
    hints: [],
    status: "guessing",
  };

  const initialState: ChainState = {
    ...defaultInitialState,
    userGuesses: savedData?.userGuesses ?? [],
    hints: savedData?.hints ?? [],
    status: (savedData?.userGuesses.length ?? 0) > (savedData?.hints.length ?? 0) ? "selecting" : "guessing",
  };

  const reducer = (state: ChainState, action: ChainAction): ChainState => {
    switch (action.type) {
      case "setGuess":
        return {
          ...state,
          currentSuffixes: state.currentSuffixes.map((suffix, i) =>
            i === action.payload.index
              ? action.payload.guess.slice(action.payload.currentChain[i]?.length ?? 0)
              : suffix
          ),
        };
      case "confirmGuess":
        return {
          ...state,
          userGuesses: [...state.userGuesses, action.payload.currentGuess.map((w) => w.trim().toLowerCase())],
          currentSuffixes: correctChain.map(() => ""),
          status: "revealing",
        };
      case "selectHintIndex":
        return {
          ...state,
          hints: [...state.hints, action.payload.index],
          status: "guessing",
        };
      case "resetGuess":
        return {
          ...state,
          currentSuffixes: correctChain.map(() => ""),
        };
      case "resetGame":
        return defaultInitialState;
      case "setStatus":
        return {
          ...state,
          status: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, defaultInitialState);

  const hintsByIndex = useMemo(() => {
    const counts = correctChain.map(() => 0);
    state.hints.forEach((idx) => {
      if (counts[idx] !== undefined) counts[idx] += 1;
    });
    return counts;
  }, [state.hints, correctChain]);

  const solvedByIndex = useMemo(() => {
    const solved = correctChain.map((_, i) => i === 0 || i === correctChain.length - 1);
    state.userGuesses.forEach((guess) => {
      guess.forEach((word, i) => {
        if (word === correctChain[i]) solved[i] = true;
      });
    });
    return solved;
  }, [state.userGuesses, correctChain]);

  const currentChain = useMemo(() => {
    return correctChain.map((word, i) => (solvedByIndex[i] ? word : word.slice(0, hintsByIndex[i] + 1)));
  }, [correctChain, solvedByIndex, hintsByIndex]);

  const currentGuess = useMemo(() => {
    return currentChain.map((word, i) => word + state.currentSuffixes[i]);
  }, [currentChain, state.currentSuffixes]);

  const currentGuessValid = useMemo(() => {
    return currentGuess.some((w, i) => w.length > currentChain[i].length);
  }, [currentGuess, currentChain]);

  const guessesRemaining = MAX_GUESSES - state.userGuesses.length;
  const currentHintIndex = state.hints[state.userGuesses.length - 1];

  // Save state and check for win/loss
  useEffect(() => {
    saveToLocalStorage({
      userGuesses: state.userGuesses,
      hints: state.hints,
    });

    if (solvedByIndex.every(Boolean) && state.status !== "revealing") {
      setStatus("winner");
    } else if (guessesRemaining === 0 && state.status !== "revealing") {
      setStatus("loser");
    }
  }, [state.userGuesses, state.hints, solvedByIndex, state.status, guessesRemaining]);

  // API functions
  const setGuess = useCallback(
    (index: number, guess: string) => {
      dispatch({ type: "setGuess", payload: { index, guess, currentChain } });
    },
    [currentChain]
  );

  const confirmGuess = useCallback(() => {
    dispatch({ type: "confirmGuess", payload: { currentGuess } });
  }, [currentGuess]);

  const selectHintIndex = useCallback((index: number) => {
    dispatch({ type: "selectHintIndex", payload: { index } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "resetGame" });
  }, []);

  const resetGuess = useCallback(() => {
    dispatch({ type: "resetGuess" });
  }, []);

  const setStatus = useCallback((status: Status) => {
    dispatch({ type: "setStatus", payload: status });
  }, []);

  const data = useMemo<ChainContextData>(
    () => ({
      correctChain,
      currentChain,
      solvedByIndex,
      currentHintIndex: currentHintIndex ?? -1,
      currentGuessValid,
      status: state.status,
      userGuesses: state.userGuesses,
      guessesRemaining,
    }),
    [
      correctChain,
      currentChain,
      solvedByIndex,
      currentHintIndex,
      currentGuessValid,
      state.status,
      state.userGuesses,
      guessesRemaining,
    ]
  );

  const api = useMemo<ChainContextApi>(
    () => ({
      setGuess,
      confirmGuess,
      resetGame,
      selectHintIndex,
      resetGuess,
      setStatus,
    }),
    [setGuess, confirmGuess, resetGame, selectHintIndex, resetGuess, setStatus]
  );

  return (
    <ChainDataContext.Provider value={data}>
      <ChainApiContext.Provider value={api}>{children}</ChainApiContext.Provider>
    </ChainDataContext.Provider>
  );
}

// Custom hooks
export function useChainData() {
  const context = useContext(ChainDataContext);
  if (!context) throw new Error("useChainData must be used within a ChainProvider");
  return context;
}

export function useChainApi() {
  const context = useContext(ChainApiContext);
  if (!context) throw new Error("useChainApi must be used within a ChainProvider");
  return context;
}
