import React, { useCallback, useState } from "react";
import { Modal, Text, View, Button } from "react-native";

const defaultOpts = {
  closeButtonText: "lukk",
  message: "",
  onClose: () => {},
  startOpen: false,
} as const;

/**
  Wraps the state management of a basic message popup.

  @example
  ```tsx
  const helloPopup = usePopup({ message: "verden!", });

  return (
    <View>
      <Button title="Heisann" onPress={helloPopup.open}/>
      <helloPopup.Component {...helloPopup.props}/>
    </View>
  );
```*/
export const usePopup = (opts: {
  closeButtonText?: string;
  message?: string;
  onClose?: () => void;
  startOpen?: boolean;
}) => {

  const args = {...defaultOpts, ...opts};

  const [isOpen, setIsOpen] = useState(args.startOpen);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onClose = args.onClose
  const open = useCallback(() => setIsOpen(true), [setIsOpen]);

  const props: PopupProps = {
    close,
    closeButtonText: args.closeButtonText,
    isOpen,
    message: args.message,
    onClose,
  };

  return {
    Component, props,
    close, isOpen, open,
  } as const;
};
export default usePopup;

export type PopupProps = {
    closeButtonText: string;
    message: string;
    onClose: () => void;
    isOpen: boolean;
    close: () => void;
}

const Component = ( props: PopupProps ) => {
  const handleClose = () => {
    props.onClose();
    props.close();
  };
  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      visible={props.isOpen}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 100,
          }}
        >{props.message}</Text>
        <Button title={props.closeButtonText} onPress={handleClose}/>
      </View>
    </Modal>
  )
}
