import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function Button({ title, onPress, style, ...props }) {
  return (
    <TouchableOpacity onPress={onPress} style={style} {...props}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
