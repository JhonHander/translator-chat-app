// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { getConversation, saveMessage } from '../utils/storage';

// const HistoryScreen = ({ navigation }) => {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadHistory();
    
//     // Recargar el historial cuando la pantalla recibe el foco
//     const unsubscribe = navigation.addListener('focus', () => {
//       loadHistory();
//     });

//     return unsubscribe;
//   }, [navigation]);

//   const loadHistory = async () => {
//     try {
//       const historyData = await getConversation();
//       setHistory(historyData);
//     } catch (error) {
//       console.error('Error loading history:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleFavorite = async (item) => {
//     try {
//       // Invertir el estado de favorito
//       const updatedItem = {
//         ...item,
//         isFavorite: !item.isFavorite
//       };
      
//       // Guardar mensaje actualizado
//       await saveMessage(updatedItem);
      
//       // Actualizar la lista
//       loadHistory();
//     } catch (error) {
//       console.error('Error toggling favorite:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>Cargando historial...</Text>
//       </View>
//     );
//   }

//   if (history.length === 0) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text>No hay traducciones en el historial</Text>
//       </View>
//     );
//   }

//   // return (
//   //   <View style={styles.container}>
//   //     <FlatList
//   //       data={history}
//   //       keyExtractor={(item) => item.id || item.timestamp}
//   //       renderItem={({ item }) => (
//   //         <View style={styles.itemContainer}>
//   //           <View style={styles.textContainer}>
//   //             <Text style={styles.originalText}>{item.original}</Text>
//   //             <Text style={styles.translatedText}>{item.translated}</Text>
//   //           </View>
//   //           <TouchableOpacity
//   //             style={styles.favoriteButton}
//   //             onPress={() => handleToggleFavorite(item)}
//   //           >
//   //             <Text style={[
//   //               styles.favoriteButtonText,
//   //               item.isFavorite ? styles.favoriteActive : styles.favoriteInactive
//   //             ]}>
//   //               ★
//   //             </Text>
//   //           </TouchableOpacity>
//   //         </View>
//   //       )}
//   //       ItemSeparatorComponent={() => <View style={styles.separator} />}
//   //     />
//   //   </View>
//   // );
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={history}
//         keyExtractor={(item) => item.id || item.timestamp}
//         renderItem={({ item }) => {
//           // Depurar estructura para ver qué contiene
//           console.log('Item en HistoryScreen:', item); 
          
//           // Determinar qué campos mostrar basado en la estructura disponible
//           const originalText = item.original || item.text || '';
//           const translatedText = item.translated || (item.sender === 'bot' ? item.text : '') || '';
          
//           return (
//             <View style={styles.itemContainer}>
//               <View style={styles.textContainer}>
//                 <Text style={styles.originalText}>{originalText}</Text>
//                 <Text style={styles.translatedText}>{translatedText}</Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.favoriteButton}
//                 onPress={() => handleToggleFavorite(item)}
//               >
//                 <Text style={[
//                   styles.favoriteButtonText,
//                   item.isFavorite ? styles.favoriteActive : styles.favoriteInactive
//                 ]}>
//                   ★
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           );
//         }}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   itemContainer: {
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   originalText: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: '#333',
//   },
//   translatedText: {
//     fontSize: 16,
//     fontStyle: 'italic',
//     color: '#666',
//   },
//   favoriteButton: {
//     padding: 10,
//   },
//   favoriteButtonText: {
//     fontSize: 24,
//   },
//   favoriteActive: {
//     color: 'gold',
//   },
//   favoriteInactive: {
//     color: '#ccc',
//   }
// });

// export default HistoryScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getConversation, saveMessage } from '../utils/storage';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      const historyData = await getConversation();
      setHistory(historyData);
      
      // Agrupar mensajes del usuario con respuestas del bot
      const grouped = groupMessages(historyData);
      setGroupedHistory(grouped);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agrupar mensajes relacionados (pregunta-respuesta)
  const groupMessages = (messages) => {
    const grouped = [];
    let currentPair = null;
    
    // Ordenar por timestamp para asegurar secuencia correcta
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    sortedMessages.forEach(message => {
      if (message.sender === 'user') {
        // Si hay un par anterior incompleto, lo añadimos
        if (currentPair) {
          grouped.push(currentPair);
        }
        // Iniciar un nuevo par con el mensaje de usuario
        currentPair = {
          id: message.id,
          userMessage: message,
          botMessage: null,
          timestamp: message.timestamp
        };
      } else if (message.sender === 'bot' && currentPair && !currentPair.botMessage) {
        // Si hay un par actual esperando respuesta, añadir el mensaje del bot
        currentPair.botMessage = message;
        grouped.push(currentPair);
        currentPair = null;
      } else if (message.sender === 'bot') {
        // Mensaje del bot sin pregunta previa
        grouped.push({
          id: message.id,
          userMessage: null,
          botMessage: message,
          timestamp: message.timestamp
        });
      }
    });
    
    // Añadir el último par si quedó incompleto
    if (currentPair) {
      grouped.push(currentPair);
    }
    
    return grouped;
  };

  const handleToggleFavorite = async (message) => {
    if (!message) return;
    
    try {
      const updatedItem = {
        ...message,
        isFavorite: !message.isFavorite
      };
      
      await saveMessage(updatedItem);
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
        data={groupedHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const userText = item.userMessage ? item.userMessage.text : '';
          const botText = item.botMessage ? item.botMessage.text : '';
          const isFavorite = item.botMessage ? item.botMessage.isFavorite : false;
          
          return (
            <View style={styles.conversationContainer}>
              {item.userMessage && (
                <View style={styles.userMessageContainer}>
                  <Text style={styles.messageLabel}>Tu mensaje:</Text>
                  <Text style={styles.userText}>{userText}</Text>
                </View>
              )}
              
              {item.botMessage && (
                <View style={styles.botMessageContainer}>
                  <Text style={styles.messageLabel}>Respuesta:</Text>
                  <Text style={styles.botText}>{botText}</Text>
                  
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleToggleFavorite(item.botMessage)}
                  >
                    <Text style={[
                      styles.favoriteButtonText,
                      isFavorite ? styles.favoriteActive : styles.favoriteInactive
                    ]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
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
  conversationContainer: {
    padding: 15,
  },
  userMessageContainer: {
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  botMessageContainer: {
    backgroundColor: '#e9f5ff',
    padding: 10,
    borderRadius: 8,
    position: 'relative',
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666',
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
  botText: {
    fontSize: 16,
    color: '#333',
    marginRight: 30, // Espacio para el botón de favorito
  },
  separator: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
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