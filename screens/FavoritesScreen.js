import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getFavorites, removeFavorite } from '../utils/storage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
    
    // Recargar los favoritos cuando la pantalla recibe el foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId) => {
    try {
      await removeFavorite(itemId);
      // Actualizar la lista después de eliminar
      loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando favoritos...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No hay traducciones guardadas como favoritas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id || item.timestamp}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.originalText}>{item.original}</Text>
              <Text style={styles.translatedText}>{item.translated}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleRemoveFavorite(item.id)}
            >
              <Text style={styles.favoriteButtonText}>★</Text>
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
    color: 'gold',
  }
});

export default FavoritesScreen;