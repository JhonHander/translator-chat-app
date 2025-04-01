import AsyncStorage from '@react-native-async-storage/async-storage';

const CONVERSATION_KEY = '@translator_conversation';
const FAVORITES_KEY = '@translator_favorites';

// Guardar un mensaje en la conversación
export const saveMessage = async (message) => {
  try {
    // Obtener conversación actual
    const conversation = await getConversation();
    
    // Si el mensaje ya existe (actualización), actualizar
    const index = conversation.findIndex(m => m.id === message.id);
    
    let updatedConversation;
    if (index !== -1) {
      // Actualizar mensaje existente
      updatedConversation = [...conversation];
      updatedConversation[index] = message;
    } else {
      // Añadir nuevo mensaje
      updatedConversation = [...conversation, message];
    }
    
    // Guardar conversación actualizada
    await AsyncStorage.setItem(CONVERSATION_KEY, JSON.stringify(updatedConversation));
    
    // Si es favorito, guardarlo en la lista de favoritos
    if (message.isFavorite) {
      await saveFavorite(message);
    } else if (index !== -1 && conversation[index].isFavorite) {
      // Si ya no es favorito, quitarlo de favoritos
      await removeFavorite(message.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
};

// Obtener la conversación completa
export const getConversation = async () => {
  try {
    const conversationJson = await AsyncStorage.getItem(CONVERSATION_KEY);
    return conversationJson ? JSON.parse(conversationJson) : [];
  } catch (error) {
    console.error('Error getting conversation:', error);
    return [];
  }
};

// Limpiar la conversación
export const clearConversation = async () => {
  try {
    await AsyncStorage.removeItem(CONVERSATION_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing conversation:', error);
    return false;
  }
};

// Guardar un mensaje como favorito
export const saveFavorite = async (message) => {
  try {
    // Obtener favoritos actuales
    const favorites = await getFavorites();
    
    // Verificar si ya existe
    const index = favorites.findIndex(m => m.id === message.id);
    
    if (index !== -1) {
      // Actualizar favorito existente
      const updatedFavorites = [...favorites];
      updatedFavorites[index] = message;
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } else {
      // Añadir nuevo favorito
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, message]));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving favorite:', error);
    return false;
  }
};

// Eliminar un mensaje de favoritos
export const removeFavorite = async (messageId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(m => m.id !== messageId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

// Obtener todos los favoritos
export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};