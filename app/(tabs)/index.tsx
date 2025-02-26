import { useState } from "react";
import { Button, useWindowDimensions, View } from "react-native";
import CustomKeyboard from "../components/CustomKeyboard";
import GuessView from "../components/GuessView";
import assert from "../debug/assert";

const WORD_LENGTH = 5;
const ATTEMPTS = 6

const WORD_LIST = (require("./ord.json") as string).split("\n")
function getRandomWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
}

export default function Index() {

  const stringArrayGrid = (width: number, height: number) => 
    Array.from({length: height}, (_) =>
      Array<string>(width).fill(''))


  const [currAttempt, setCurrAttempt] = useState(0);
  const [buffers, setBuffers] = useState(
    stringArrayGrid(WORD_LENGTH, ATTEMPTS)
  );
  const [disabledLetters, setDisabledLetters] = useState<Array<string>>([]);
  const [word, setWord] = useState(getRandomWord());

  const handleResetPressed = () => {
    setCurrAttempt(0);
    setBuffers(stringArrayGrid(WORD_LENGTH, ATTEMPTS));
    setDisabledLetters([]);
    setWord(getRandomWord());
  }

  assert(currAttempt >= 0, 'invalid currAttempt');
  assert(word.length === WORD_LENGTH, 'the target word is not equal to WORD_LENGTH');

  const handleSubmitPressed = () => {
    if (currAttempt >= ATTEMPTS) { return; }
    const guessArr = buffers[currAttempt];
    const guess = guessArr.join("");
    assert(guess.length <= word.length, "The guess is longer than should be possible");
    if (guess.length !== word.length) { return; }
    const newDisabledLetters = [...disabledLetters];
    newDisabledLetters.push(...guessArr.filter((c) => !word.includes(c)))
    setDisabledLetters(newDisabledLetters)
    setCurrAttempt(currAttempt+1);
  };

  const handleDeletePressed = () => {
    if (currAttempt >= ATTEMPTS) { return; }

    const indexToErase = buffers[currAttempt].findLastIndex((val) => val !== '')
    if (indexToErase === -1) { return; }

    const newCurrBuffer = [...(buffers[currAttempt])];
    const newBuffers = [...buffers];
    newCurrBuffer[indexToErase] = '';
    newBuffers[currAttempt] = newCurrBuffer;

    setBuffers(newBuffers);
  };

  const handleLetterTyped = (letter: string) => {
    assert(letter.length === 1, 'letter is multiple letters');
    if (currAttempt >= ATTEMPTS) { return; }

    const indexToWriteTo = buffers[currAttempt].findIndex((val) => val === '');
    if (indexToWriteTo === -1) { return; }

    const newCurrBuffer = [...(buffers[currAttempt])];
    const newBuffers = [...buffers];
    newCurrBuffer[indexToWriteTo] = letter;
    newBuffers[currAttempt] = newCurrBuffer;

    setBuffers(newBuffers);
  };

  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#eee"
      }}
    >
      <View style={{ flexGrow: 1 }}/>
      <Button title="nytt spill" onPress={handleResetPressed} />
      <View style={{ flexGrow: 1 }}/>
      <GuessView
        buffers={buffers}
        currAttempt={currAttempt}
        nAttempts={ATTEMPTS}
        nLetters={WORD_LENGTH}
        targetWord={word}
        viewWidth={width}
      />
      <View style={{ flexGrow: 1 }}/>
      <CustomKeyboard
        disabledLetters={disabledLetters}
        onDeletePressed={handleDeletePressed}
        onLetterTyped={handleLetterTyped}
        onSubmitPressed={handleSubmitPressed}
        viewWidth={width}
      />
      <View style={{ flexGrow: 1 }}/>
    </View>
  );
}
