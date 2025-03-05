import { useFonts } from 'expo-font';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import { colorCorrectPos, colorDefaultBG, colorDelete, colorDisabled, colorInWord, colorSubmit } from '../../helpers/constants';
import { Actions, GameState } from '@/helpers/GameState';
import { Dispatch } from 'react';


const DELETE = 'slett'
const SUBMIT = 'gjett'
const GAP = 3

const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å', ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ø', 'æ', ],
    [  DELETE, 'z', 'x', 'c', 'v', 'b', 'n', 'm', SUBMIT,   ],
];
Object.freeze(keys);
keys.forEach(innerArray => Object.freeze(innerArray));

const CustomKeyboard = ({
  state,
  dispatch,
}: {
  state: GameState,
  dispatch: Dispatch<Actions>
}) => {

  const [_] = useFonts({ComicNeueRegular: require('../../assets/fonts/ComicNeue-Regular.ttf')})

  const dimensions = useWindowDimensions()

  const Key = (self: { keyName: string, }) => {
    const isEnabled = !(state.knownLettersNotInWord.has(self.keyName))
    const isDeleteKey = self.keyName === DELETE
    const isSubmitKey = self.keyName === SUBMIT
    const isWideKey = isDeleteKey || isSubmitKey

    const handlePress =
      isDeleteKey ? (_: any) => dispatch({type: "Delete"}) :
      isSubmitKey ? (_: any) => dispatch({type: "Submit"}) :
      (_: any) => { dispatch({type: "TypedLetter", payload: self.keyName} ) }

    const backgroundColor =
      isDeleteKey ? colorDelete :
      isSubmitKey ? colorSubmit :
      state.knownLettersInCorrectPositions.has(self.keyName) ? colorCorrectPos :
      state.knownLettersInWord.has(self.keyName) ? colorInWord :
      isEnabled ? colorDefaultBG:
      colorDisabled ;

    const keyWidth = isWideKey ? 2 + 100 / dimensions.width : 1

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          alignItems: 'center',
          backgroundColor: backgroundColor,
          borderRadius: 5,
          borderWidth: 2,
          justifyContent: 'center',
          flex: keyWidth,
        }}
      >
        <Text
          style={{
            fontFamily: "ComicNeueRegular",
            fontSize: 24,
          }}
        >{self.keyName}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <View style={{
      flexDirection: 'column',
      flex: 1,
      gap: GAP,
      margin: GAP,
    }} >
    {
      keys.map((row, i) => (
        <View key={i} style={{
          flexDirection: 'row',
          flex: 1,
          gap: GAP,
        }} >
        {
          row.map((char, j)=>(
            <Key
              keyName={char}
              key={j}
            />
          ))
        }
        </View>
      ))
    }
    </View>
  )
}

export default CustomKeyboard;
