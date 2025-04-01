import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatTranslatorScreen from '../screens/ChatTranslatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Translator"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4285F4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#4285F4',
      }}
    >
      <Drawer.Screen 
        name="Translator" 
        component={ChatTranslatorScreen} 
        options={{
          title: 'Traductor IA',
          drawerIcon: ({color, size}) => (
            <MaterialIcons name="translate" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          title: 'Historial',
          drawerIcon: ({color, size}) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
          title: 'Favoritos',
          drawerIcon: ({color, size}) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;