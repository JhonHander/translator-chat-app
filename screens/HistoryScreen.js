import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getHistory, saveMessage } from '../utils/storage';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    
    // Recargar el historial cuando la pantalla recibe el foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (item) => {
    try {
      // Invertir el estado de favorito
      const updatedItem = {
        ...item,
        isFavorite: !item.isFavorite
      };
      
      // Guardar mensaje actualizado
      await saveMessage(updatedItem);
      
      // Actualizar la lista
      loadHistory();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando historial...</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No hay traducciones en el historial</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id || item.timestamp}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.originalText}>{item.original}</Text>
              <Text style={styles.translatedText}>{item.translated}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleToggleFavorite(item)}
            >
              <Text style={[
                styles.favoriteButtonText,
                item.isFavorite ? styles.favoriteActive : styles.favoriteInactive
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
  itemContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  originalText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  translatedText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  favoriteActive: {
    color: 'gold',
  },
  favoriteInactive: {
    color: '#ccc',
  }
});

export default HistoryScreen;