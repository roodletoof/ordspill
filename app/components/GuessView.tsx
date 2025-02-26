import { View, Text, ColorValue} from "react-native"
import assert from "../debug/assert"
import {useFonts} from 'expo-font'
import { colorCorrectPos, colorDefaultBG, colorInWord } from "../constants"

const GuessView = ({
  buffers,
  currAttempt,
  nAttempts,
  nLetters,
  viewWidth,
  targetWord,
}: {
  buffers: Array<Array<string>>
  currAttempt: number
  nAttempts: number
  nLetters: number
  viewWidth: number
  targetWord: string
}) => {
  assert(buffers.length === nAttempts, "nAttempts is wrong for given buffers");
  buffers.forEach(
    (buf) => assert(buf.length === nLetters, "nLetters is wrong for given buffers")
  );
  assert(targetWord.length === nLetters, "target word has wrong number of letters");

  const [_] = useFonts({ComicNeueBold: require('../../assets/fonts/ComicNeue-Bold.ttf')})
  // TODO wait until the fonts are actually loaded

  const Cell = ({
    letter,
    backgroundColor
  }: {
    letter: string,
    backgroundColor: ColorValue | undefined
  }) => {
    assert(letter.length === 1 || letter.length === 0, 'invallid letter length');

    const margin = 2
    const widthAndHeight =
      viewWidth / nLetters
    - margin*2 / nLetters
    - margin*2

    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: backgroundColor,
          borderRadius: 5,
          borderWidth: 2,
          height: widthAndHeight,
          justifyContent: 'center',
          margin: margin,
          width: widthAndHeight,
        }}
      >
        <Text
          style={{
            fontFamily: "ComicNeueBold",
            fontSize: widthAndHeight / 2,
          }}
        >{letter}</Text>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column' }}>
    {
      buffers.map((row, y) => (
        <View key={y} style={{flexDirection: 'row'}}>
        {
          row.map((char, x)=>{
            const isPastAttempt = y < currAttempt;
            const isCharInWord = targetWord.includes(char);
            const isCharInCorrectPosition = targetWord[x] === char;
            const color =
              isPastAttempt && isCharInCorrectPosition ? colorCorrectPos
            : isPastAttempt && isCharInWord ? colorInWord
            : colorDefaultBG;

            return (
              <Cell
                backgroundColor={color}
                key={x}
                letter={char}
              />)
          })
        }
        </View>
      ))
    }
    </View>
  );
}

export default GuessView
