import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import { translateWithAI } from '../services/aiApiService';
import { saveMessage, getConversation } from '../utils/storage';

const ChatTranslatorScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Mensaje de bienvenida al iniciar la app
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: '¡Hola! Soy tu asistente de traducción. Puedes pedirme que traduzca cualquier texto a otro idioma. Por ejemplo:\n\n"Traduce \'Hola mundo\' al inglés"\n"Traducir a francés: Estoy aprendiendo programación"\n"¿Cómo se dice \'buenos días\' en japonés?"',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, []);

  // Cargar conversación guardada
  useEffect(() => {
    const loadSavedMessages = async () => {
      const savedMessages = await getConversation();
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    };
    
    loadSavedMessages();
  }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    await saveMessage(userMessage);
    
    // Desplazar al final del chat
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
    
    // Procesar la traducción
    setIsLoading(true);
    
    try {
      // Llamar a API de IA para traducir
      const aiResponse = await translateWithAI(text);
      
      // Crear mensaje de respuesta
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      // Añadir respuesta a la conversación
      setMessages(prevMessages => [...prevMessages, botMessage]);
      await saveMessage(botMessage);
      
      // Desplazar al final del chat
      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);
      
    } catch (error) {
      console.error('Error with AI translation:', error);
      // Mensaje de error
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      await saveMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveFavorite = async (messageId) => {
    // Implementar lógica para guardar en favoritos
    // Encontrar el mensaje correspondiente y marcarlo como favorito
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg
    );
    
    setMessages(updatedMessages);
    
    // Actualizar en almacenamiento
    const messageToUpdate = messages.find(m => m.id === messageId);
    if (messageToUpdate) {
      await saveMessage({
        ...messageToUpdate,
        isFavorite: !messageToUpdate.isFavorite
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatMessage 
            message={item} 
            onPressStar={() => handleSaveFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.messagesContainer}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4285F4" />
          <Text style={styles.loadingText}>Traduciendo...</Text>
        </View>
      )}
      
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
});

export default ChatTranslatorScreen;