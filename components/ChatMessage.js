import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatMessage = ({ message, onPressStar }) => {
  const isUserMessage = message.sender === 'user';
  
  // Formato de fecha simple sin usar formatDate
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <View style={[
      styles.container,
      isUserMessage ? styles.userContainer : styles.botContainer
    ]}>
      <View style={[
        styles.bubble,
        isUserMessage ? styles.userBubble : styles.botBubble,
        message.isError && styles.errorBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUserMessage ? styles.userText : styles.botText,
          message.isError && styles.errorText
        ]}>
          {message.text}
        </Text>
        
        {!isUserMessage && (
          <TouchableOpacity
            style={styles.starButton} 
            onPress={() => onPressStar && onPressStar()}
          >
            <MaterialIcons 
              name={message.isFavorite ? "star" : "star-border"} 
              size={20} 
              color={message.isFavorite ? "#FFD700" : "#999"} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.timestamp}>
        {formatTimestamp(message.timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    minWidth: 80,
  },
  userBubble: {
    backgroundColor: '#4285F4',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorBubble: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  errorText: {
    color: '#c62828',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginHorizontal: 4,
  },
  starButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
});

export default ChatMessage;


// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { formatDate } from '../utils/helpers';

// const ChatMessage = ({ message, onPressStar }) => {
//   const isUserMessage = message.sender === 'user';
  
//   return (
//     <View style={[
//       styles.container,
//       isUserMessage ? styles.userContainer : styles.botContainer
//     ]}>
//       <View style={[
//         styles.bubble,
//         isUserMessage ? styles.userBubble : styles.botBubble,
//         message.isError && styles.errorBubble
//       ]}>
//         <Text style={[
//           styles.messageText,
//           isUserMessage ? styles.userText : styles.botText,
//           message.isError && styles.errorText
//         ]}>
//           {message.text}
//         </Text>
        
//         {!isUserMessage && (
//           <TouchableOpacity
//             style={styles.starButton} 
//             onPress={() => onPressStar && onPressStar()}
//           >
//             <MaterialIcons 
//               name={message.isFavorite ? "star" : "star-border"} 
//               size={20} 
//               color={message.isFavorite ? "#FFD700" : "#999"} 
//             />
//           </TouchableOpacity>
//         )}
//       </View>
      
//       <Text style={styles.timestamp}>
//         {formatDate(message.timestamp)}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 8,
//     maxWidth: '85%',
//   },
//   userContainer: {
//     alignSelf: 'flex-end',
//   },
//   botContainer: {
//     alignSelf: 'flex-start',
//   },
//   bubble: {
//     padding: 12,
//     borderRadius: 18,
//     minWidth: 80,
//   },
//   userBubble: {
//     backgroundColor: '#4285F4',
//     borderBottomRightRadius: 5,
//   },
//   botBubble: {
//     backgroundColor: '#fff',
//     borderBottomLeftRadius: 5,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   errorBubble: {
//     backgroundColor: '#ffebee',
//     borderColor: '#ffcdd2',
//   },
//   messageText: {
//     fontSize: 16,
//     lineHeight: 20,
//   },
//   userText: {
//     color: '#fff',
//   },
//   botText: {
//     color: '#333',
//   },
//   errorText: {
//     color: '#c62828',
//   },
//   timestamp: {
//     fontSize: 11,
//     color: '#999',
//     marginTop: 4,
//     marginHorizontal: 4,
//   },
//   starButton: {
//     position: 'absolute',
//     bottom: 8,
//     right: 8,
//   },
// });

// export default ChatMessage;

// // const ChatMessage = ({ message, onPress }) => {
// //     return (
// //         <TouchableOpacity onPress={onPress} style={styles.container}>
// //         <View style={styles.messageContainer}>
// //             <Text style={styles.sender}>{message.sender}</Text>
// //             <Text style={styles.text}>{message.text}</Text>
// //             <Text style={styles.timestamp}>{formatDate(message.timestamp)}</Text>
// //         </View>
// //         <MaterialIcons name="arrow-forward" size={24} color="black" />
// //         </TouchableOpacity>
// //     );
// //     }
