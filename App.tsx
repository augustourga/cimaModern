import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { View, Linking } from 'react-native';
import Login from './src/screens/Login';
import WishedSubjects from './src/screens/WishedSubjects';
import Profile from './src/screens/Profile';
import Planner from './src/screens/Planner';
import Aprobadas from './src/screens/Aprobadas';
import WorkTime from './src/screens/WorkTime';

const Stack = createNativeStackNavigator();

const Options = [
  { text: 'Planificar Cursada', route: 'Planner' },
  { text: 'Personalizar Alternativas', route: 'WishedSubjects' },
  { text: 'Perfil', route: 'Profile' },
  {
    text: 'Siga',
    route: 'Siga',
    onClick: () => {
      Linking.openURL('http://siga.frba.utn.edu.ar/');
    },
  },
];

function HomeScreen({ navigation, route }: any) {
  const user = route.params?.user;
  const wishedSubjects = route.params?.wishedSubjects || [];
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {Options.map(option => (
        <Button
          key={option.route}
          mode="contained"
          style={{ marginVertical: 8, width: 250, backgroundColor: '#AE1131' }}
          labelStyle={{ color: '#fff' }}
          onPress={
            option.route === 'Profile'
              ? () => navigation.navigate('Profile', { user, wishedSubjects })
              : option.onClick || (() => navigation.navigate(option.route))
          }
        >
          {option.text}
        </Button>
      ))}
    </View>
  );
}

function PlaceholderScreen({ route }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button mode="outlined" disabled>
        {route.name} (En construcción)
      </Button>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'CIMA - Inicio' }} />
            <Stack.Screen name="Planner" component={Planner} />
            <Stack.Screen name="WishedSubjects" component={WishedSubjects} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Aprobadas" component={Aprobadas} options={{ title: 'Materias Aprobadas' }} />
            <Stack.Screen name="Siga" component={PlaceholderScreen} />
            <Stack.Screen name="WorkTime" component={WorkTime} options={{ title: 'Horario Laboral' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
