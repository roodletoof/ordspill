import { useFonts } from 'expo-font';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import { colorDefaultBG, colorDelete, colorSubmit } from '../constants';


const DELETE = 'slett'
const SUBMIT = 'gjett'

const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'å', ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ø', 'æ', ],
    [DELETE, 'z', 'x', 'c', 'v', 'b', 'n', 'm', SUBMIT],
];
Object.freeze(keys);
keys.forEach(innerArray => Object.freeze(innerArray));
const keysInUpperRow = keys[0].length

const CustomKeyboard = ({
  disabledLetters,
  onDeletePressed,
  onLetterTyped,
  onSubmitPressed,
  viewWidth,
}: {
    disabledLetters: string[];
    onDeletePressed: () => void;
    onLetterTyped: (key: string) => void;
    onSubmitPressed: () => void;
    viewWidth: number;
}) => {

  const [_] = useFonts({ComicNeueRegular: require('../../assets/fonts/ComicNeue-Regular.ttf')})

  const Key = ({ keyName, }: { keyName: string, }) => {
    const isEnabled = !(disabledLetters.includes(keyName))
    const isDeleteKey = keyName === DELETE
    const isSubmitKey = keyName === SUBMIT
    const isWideKey = isDeleteKey || isSubmitKey

    const handlePress =
      isDeleteKey ? (_: GestureResponderEvent) => onDeletePressed() :
      isSubmitKey ? (_: GestureResponderEvent) => onSubmitPressed() :
      (_: GestureResponderEvent) => { if (isEnabled) onLetterTyped(keyName) }

    const backgroundColor =
      isDeleteKey ? colorDelete :
      isSubmitKey ? colorSubmit:
      colorDefaultBG

    const margin = 2

    const slimKeyWidth =
      viewWidth / keysInUpperRow
    - margin*2 / keysInUpperRow
    - margin*2

    const wideKeyWidth =
      slimKeyWidth * 2
    + margin * 2

    const keyWidth = isWideKey ? wideKeyWidth : slimKeyWidth
    const opacity = isEnabled ? 1 : 0
    const keyHeight = slimKeyWidth * 2

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          alignItems: 'center',
          backgroundColor: backgroundColor,
          borderRadius: 5,
          borderWidth: 2,
          height: keyHeight,
          justifyContent: 'center',
          margin: margin,
          opacity: opacity,
          width: keyWidth,
        }}
      >
        <Text
          style={{
            fontFamily: "ComicNeueRegular",
            fontSize: keyHeight / 3,
          }}
        >{keyName}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <View style={{flexDirection: 'column'}} >
    {
      keys.map((row, i) => (
        <View key={i} style={{flexDirection: 'row'}} >
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
