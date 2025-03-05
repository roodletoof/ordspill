import { useReducer } from "react";
import assert from "@/helpers/assert";
import { Event, fireEvent, fireEventWithPayload, newEvent, newEventWithPayload } from "./event"

export const WORD_LENGTH = 5 as const;
export const ATTEMPTS = 6 as const;

export const WORD_LIST = (require("./ord.json") as string).split("\n")
function getRandomWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
}

export type GameState = {
  buffers: Grid;
  cursorColumn: number;
  cursorRow: number;
  eventGameFinished: Event<{won: boolean}>;
  eventWrongInput: Event;
  isGameFinished: boolean;
  knownLettersInCorrectPositions: Set<string>;
  knownLettersInWord: Set<string>;
  knownLettersNotInWord: Set<string>;
  targetWord: string;
};

const reducer = (state: GameState, action: Actions): GameState => {
  switch (action.type) {
    case "Delete"     : return handleDelete(state);
    case "GiveHint"   : return handleGiveHint(state);
    case "NewGame"    : return initialState();
    case "Submit"     : return handleSubmit(state);
    case "TypedLetter": return handleTypedLetter(state, action.payload);
  }
}

export type Actions
  = Action<"Delete">
  | Action<"GiveHint">
  | Action<"NewGame">
  | Action<"Submit">
  | Action<"TypedLetter", string>
;

const initialState = (): GameState => {
  return {
    buffers: [
      ['', '', '', '', '', ] as Row,
      ['', '', '', '', '', ] as Row,
      ['', '', '', '', '', ] as Row,
      ['', '', '', '', '', ] as Row,
      ['', '', '', '', '', ] as Row,
      ['', '', '', '', '', ] as Row,
    ] as Grid,
    cursorColumn: 0,
    cursorRow: 0,
    eventGameFinished: newEventWithPayload<{won: boolean}>(),
    eventWrongInput: newEvent(),
    isGameFinished: false,
    knownLettersInCorrectPositions: new Set(),
    knownLettersInWord: new Set(),
    knownLettersNotInWord: new Set(),
    targetWord: getRandomWord(),
  }
}

const handleTypedLetter = (state: GameState, letter: string ): GameState => {
  assert(letter.length === 1, "letter is not a letter")
  if (state.isGameFinished) return state;
  if (
    (state.cursorRow >= ATTEMPTS) ||
    (state.cursorColumn >= WORD_LENGTH)
  ) {
    return wrongInputState(state);
  }
  return {
    ...state,
    buffers: setLetterAt(state.buffers, state.cursorRow, state.cursorColumn, letter),
    cursorColumn: state.cursorColumn + 1,
  };
}

const handleDelete = (state: GameState): GameState => {
  if (state.isGameFinished) return state;
  if (state.cursorColumn === 0) {
    return wrongInputState(state);
  }
  const newCursorColumn = state.cursorColumn - 1;
  return {
    ...state,
    buffers: setLetterAt(state.buffers, state.cursorRow, newCursorColumn, ''),
    cursorColumn: newCursorColumn,
  }
}

const handleSubmit = (state: GameState): GameState => {
  if (state.isGameFinished) return state;
  const guessArr = state.buffers[state.cursorRow];
  const guess = guessArr.join('');
  if (guess.length !== state.targetWord.length || !WORD_LIST.includes(guess)) {
    return wrongInputState(state);
  }
  const targetWordArr = state.targetWord.split("");
  const newKnown = new Set(state.knownLettersInWord);
  const newKnownCorrPos = new Set(state.knownLettersInCorrectPositions);
  const newDisabled = new Set(state.knownLettersNotInWord);
  guessArr.forEach(
    (c, i) => {
      if (targetWordArr.includes(c)) {
        newKnown.add(c);
      } else {
        newDisabled.add(c);
      }
      if (targetWordArr[i] === c) {newKnownCorrPos.add(c)}
    }
  );
  const isCorrect = guess === state.targetWord;
  const isFinished = state.cursorRow === (ATTEMPTS - 1) || isCorrect;
  return {
    ...state,
    eventGameFinished:
      isFinished ?
        fireEventWithPayload(state.eventGameFinished, {won: isCorrect}) :
        state.eventGameFinished,
    isGameFinished: isFinished,
    knownLettersInCorrectPositions: newKnownCorrPos,
    knownLettersInWord: newKnown,
    knownLettersNotInWord: newDisabled,
    cursorRow: state.cursorRow + 1,
    cursorColumn: 0,
  };
}

const handleGiveHint = (state: GameState): GameState => {
  const unknown = shuffleArray(state.targetWord.split("")).find((c) => !state.knownLettersInWord.has(c));
  if (unknown === undefined) {
    return wrongInputState(state);
  }
  const newKnownLettersInWord = new Set(state.knownLettersInWord);
  newKnownLettersInWord.add(unknown);
  return {...state, knownLettersInWord: newKnownLettersInWord};
}

const wrongInputState = (state: GameState): GameState => {
  return {
    ...state,
    eventWrongInput: fireEvent(state.eventWrongInput),
  };
}

const setLetterAt = (grid: Grid, row: number, column: number, char: string): Grid => {
  assert(char.length === 1 || char.length === 0, 'grid character is actually a string');
  const newBuffers = [...grid] as Grid;
  const newRow = [...(newBuffers[row])] as Row;
  newRow[column] = char;
  newBuffers[row] = newRow;
  return newBuffers;
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export type Action<T extends string, P = undefined> = {
  type: T;
} & ([P] extends [undefined] ? {} : {payload: P});
export type FixedArray<T, N extends number> = [T, ...T[]] & { length: N };
export type Row = FixedArray<string, typeof WORD_LENGTH>;
export type Grid = FixedArray<Row, typeof ATTEMPTS>;

const useGameStateReducer = () => useReducer(reducer, initialState())
export default useGameStateReducer;
