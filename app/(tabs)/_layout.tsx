import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF85A1' }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Amor', 
          headerShown: false, // Opcional: oculta el header para que se vea más limpio
          tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="notitas" 
        options={{ 
          title: 'Notitas', 
          tabBarIcon: ({ color }) => <FontAwesome name="comment" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="planes" 
        options={{ 
          title: 'Planes', 
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}