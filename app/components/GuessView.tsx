import { View, Text, ColorValue} from "react-native"
import assert from "@/helpers/assert"
import {useFonts} from 'expo-font'
import { colorCorrectPos, colorDefaultBG, colorInWord } from "../../helpers/constants"
import { GameState } from "@/helpers/GameState"

const GAP = 3

const GuessView = (self: { state: GameState }) => {

  const [_] = useFonts({ComicNeueBold: require('../../assets/fonts/ComicNeue-Bold.ttf')})

  const Cell = (self: {
    letter: string,
    backgroundColor: ColorValue | undefined,
    highlight: boolean,
  }) => {
    assert(self.letter.length === 1 || self.letter.length === 0, 'invallid letter length');
    const borderColor = self.highlight ? "#000" : "#999"
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: self.backgroundColor,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: borderColor,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: "ComicNeueBold",
            fontSize: 50,
          }}
        >{self.letter}</Text>
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column', flex: 2, gap: GAP, margin: GAP }}>
    {
      self.state.buffers.map((row, y) => (
        <View key={y} style={{flexDirection: 'row', flex: 1, gap: GAP}}>
          {
            row.map((char, x)=>{
              const isPastAttempt = y < self.state.cursorRow;
              const isCharInWord = self.state.targetWord.includes(char);
              const isCharInCorrectPosition = self.state.targetWord[x] === char;
              const color =
                isPastAttempt && isCharInCorrectPosition ? colorCorrectPos
              : isPastAttempt && isCharInWord ? colorInWord
              : colorDefaultBG;
              const highlight = y === self.state.cursorRow && x === self.state.cursorColumn;

              return (
                <Cell
                  backgroundColor={color}
                  key={x}
                  letter={char}
                  highlight={highlight}
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
