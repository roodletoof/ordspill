import { useEffect, useRef, useState } from "react";
import { Animated, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputKeyPressEventData, View } from "react-native";
import { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const MARGIN = 5;
const SIZE = 50
const WORD_LENGTH = 5;
const WORD_LIST = (require("./ord.json") as string).split("\n")

function assert(condition: boolean, message: string = "assertion failed"): void {
  if (!condition) {
    throw new Error(message);
  }
}

const wordleLine = (letters: string) => {
  assert(letters.length <= WORD_LENGTH, "the given letters are larger than WORD_LENGTH");
  // TODO figure out this piece of shit

  return (
    <View style={styles.container}>
      {[...letters.split(""), ...Array(WORD_LENGTH - letters.length).fill("")].map((letter, key) => (
        <TextInput
        style={styles.letterBox}
        value={letter.toUpperCase()}
        editable={false}
        key={key}
        />
      ))}
    </View>
  )
}

const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

const WordleInput = () => {
  const [ letters, setLetters ] = useState("");
  const [ attempt, setAttempt ] = useState(0);
  const attempts = useRef(Array<string>(5).fill(""));

  const shakeAnimation = useSharedValue(0);
  useEffect(() => {
    shakeAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 50 }), withTiming(0, { duration: 50 })),
      4
    )
  }, [letters]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${shakeAnimation.value}deg`}]
  }));

  const handleChangeText = (newLetters: string) => {
    attempts.current[attempt] = newLetters
    setLetters(newLetters)
  }

  const handleSubmitEditing = () => {
    const currentAttempt = attempts.current[attempt]
    if (currentAttempt.length < 5) {
      // TODO
    }

    setAttempt(attempt+1)
    setLetters("")
  }

  return (
    <Animated.View style={animatedStyle}>
      <Text>{word}</Text>
      {wordleLine(attempts.current[0])}
      {wordleLine(attempts.current[1])}
      {wordleLine(attempts.current[2])}
      {wordleLine(attempts.current[3])}
      {wordleLine(attempts.current[4])}
      <TextInput
        value={letters}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={WORD_LENGTH}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
        style={styles.inputBox}
        returnKeyType="none"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: MARGIN,
  },
  inputBox: {
    borderColor: "#000",
    borderRadius: 5,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: "bold",
    height: SIZE,
    marginHorizontal: MARGIN,
    marginVertical: MARGIN,
    textAlign: "center",
    width: SIZE*WORD_LENGTH + MARGIN*2*(WORD_LENGTH-1),
  },
  letterBox: {
    borderColor: "#000",
    borderRadius: 5,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: "bold",
    height: SIZE,
    marginHorizontal: MARGIN,
    textAlign: "center",
    textAlignVertical: "center",
    width: SIZE,
  },
})
  

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {WordleInput()}
    </View>
  );
}
