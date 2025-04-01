import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu mensaje aquí..."
        value={text}
        onChangeText={setText}
        multiline
        maxHeight={100}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[styles.sendButton, (!text.trim() || isLoading) && styles.disabledButton]} 
        onPress={handleSend}
        disabled={!text.trim() || isLoading}
      >
        <MaterialIcons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4285F4',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  disabledButton: {
    backgroundColor: '#bdbdbd',
  },
});

export default MessageInput;