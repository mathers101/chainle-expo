import { saveToLocalStorage } from "@/lib/saveToLocalStorage";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type PropsWithChildren } from "react";

export const MAX_GUESSES = 5;

type Status = "guessing" | "revealing" | "selecting" | "winner" | "loser";
export type Guess = string[];

interface ChainContextData {
  userGuesses: Guess[];
  correctChain: string[];
  currentChain: string[];
  currentGuess: Guess;
  solvedByIndex: boolean[];
  currentHintIndex?: number;
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

export interface ChainState {
  userGuesses: Guess[];
  currentGuess: Guess | null;
  hints: number[];
  status: Status;
}

interface ChainAction {
  type: string;
  payload?: any;
}

export type SaveData = {
  userGuesses: Guess[];
  hints: number[];
};

const ChainDataContext = createContext<ChainContextData | null>(null);
const ChainApiContext = createContext<ChainContextApi | null>(null);

interface ChainProviderProps {
  correctChain: string[];
  savedData: SaveData | null;
}

export function ChainProvider({ children, correctChain, savedData }: PropsWithChildren<ChainProviderProps>) {
  const defaultInitialState: ChainState = {
    userGuesses: [],
    currentGuess: null,
    hints: [],
    status: "guessing",
  };

  const numSavedGuesses = savedData?.userGuesses.length ?? 0;
  const numSavedHints = savedData?.hints?.length ?? 0;
  const initialStatus = (numSavedGuesses > numSavedHints ? "selecting" : "guessing") as Status;
  const initialGuesses = savedData?.userGuesses ?? [];
  const initialHints = savedData?.hints ?? [];
  // const initialSuffixes =
  //   initialStatus === "selecting"
  //     ? initialGuesses?.at(-1)?.map((word, index) => word.slice(initialHints.filter((hint) => hint === index).length))
  //     : defaultInitialState.currentSuffixes;
  const initialState = {
    ...defaultInitialState,
    currentGuess: null,
    userGuesses: initialGuesses,
    hints: initialHints,
    status: initialStatus,
  };
  function reducer(state: ChainState, action: ChainAction): ChainState {
    switch (action.type) {
      case "setGuess": {
        const { index, guess } = action.payload;
        return {
          ...state,
          currentGuess: state.currentGuess?.map((current, i) => (i === index ? guess : current)) ?? null,
        };
      }
      case "confirmGuess": {
        const { currentGuess } = action.payload;
        const guess = currentGuess.map((word: string) => word.trim().toLowerCase());

        return {
          ...state,
          userGuesses: [...state.userGuesses, guess],
          status: "revealing",
        };
      }
      case "selectHintIndex": {
        const { index } = action.payload;
        return {
          ...state,
          hints: [...state.hints, index],
          currentGuess: null,
          status: "guessing",
        };
      }
      // case "resetGuess": {
      //   return {
      //     ...state,
      //     currentSuffixes: defaultInitialState.currentSuffixes,
      //   };
      // }
      case "setCurrentGuess": {
        return {
          ...state,
          currentGuess: action.payload,
        };
      }
      case "setStatus": {
        return {
          ...state,
          status: action.payload,
        };
      }
      case "resetGame": {
        return defaultInitialState;
      }
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  const [{ userGuesses, currentGuess, hints, status }, dispatch] = useReducer(reducer, initialState);

  const hintsByIndex: number[] = correctChain.map(() => 0);
  for (let hintIndex of hints) {
    hintsByIndex[hintIndex] += 1;
  }

  const solvedByIndex: boolean[] = correctChain.map((_, index) => index === 0 || index === correctChain.length - 1);

  userGuesses.forEach((guess) => {
    for (let i = 1; i < correctChain.length - 1; i++) {
      if (guess[i] === correctChain[i]) {
        solvedByIndex[i] = true;
      }
    }
  });

  const currentChain = correctChain.map((correctWord, index) =>
    solvedByIndex[index] ? correctWord : correctWord.slice(0, hintsByIndex[index] + 1)
  );

  const currentGuessValid = !!currentGuess?.some((s, index) => s.length > currentChain[index].length);

  const numGuesses = userGuesses.length;

  const guessesRemaining = MAX_GUESSES - numGuesses;

  const currentHintIndex = hints?.at(userGuesses.length - 1);

  console.log("currentHintIndex", currentHintIndex);

  const confirmGuess = useCallback(() => {
    dispatch({ type: "confirmGuess", payload: { currentGuess } });
  }, [currentGuess]);

  const setGuess = useCallback(
    (index: number, guess: string) => {
      dispatch({ type: "setGuess", payload: { index, guess, currentChain } });
    },
    [currentChain]
  );

  const selectHintIndex = useCallback((index: number) => {
    dispatch({ type: "selectHintIndex", payload: { index } });
  }, []);

  const resetGame = useCallback(() => dispatch({ type: "resetGame" }), []);
  const resetGuess = useCallback(() => dispatch({ type: "setCurrentGuess", payload: currentChain }), [currentChain]);
  const setStatus = useCallback((status: Status) => {
    dispatch({ type: "setStatus", payload: status });
  }, []);

  // save game state to local storage, check if winner or loser has been determined
  useEffect(() => {
    saveToLocalStorage({ userGuesses, hints });

    if (status === "winner" || status === "loser" || status === "revealing") {
      return;
    }

    if (currentGuess === null) {
      resetGuess();
    }

    if (solvedByIndex.every((solved) => solved)) {
      setStatus("winner");
      return;
    }
    if (guessesRemaining === 0) {
      setStatus("loser");
    }
  }, [userGuesses, hints, status, guessesRemaining, solvedByIndex, setStatus, currentGuess, resetGuess]);

  const data = useMemo(
    () => ({
      correctChain,
      currentGuess: currentGuess ?? [],
      currentHintIndex,
      status,
      currentChain,
      userGuesses,
      currentGuessValid,
      guessesRemaining,
      solvedByIndex,
    }),
    [
      correctChain,
      currentGuess,
      currentHintIndex,
      status,
      currentChain,
      userGuesses,
      currentGuessValid,
      guessesRemaining,
      solvedByIndex,
    ]
  );

  const api = useMemo(
    () => ({
      setGuess,
      confirmGuess,
      resetGame,
      setStatus,
      selectHintIndex,
      resetGuess,
    }),
    [setGuess, setStatus, confirmGuess, resetGame, resetGuess, selectHintIndex]
  );

  return (
    <ChainDataContext.Provider value={data}>
      <ChainApiContext.Provider value={api}>{children}</ChainApiContext.Provider>
    </ChainDataContext.Provider>
  );
}

export function useChainData() {
  const context = useContext(ChainDataContext);
  if (!context) {
    throw new Error("Unknown context");
  }
  return context;
}

export function useChainApi() {
  const context = useContext(ChainApiContext);
  if (!context) {
    throw new Error("Unknown context");
  }
  return context;
}
