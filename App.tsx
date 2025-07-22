import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Button, Text, Card, ProgressBar } from 'react-native-paper';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Login from './src/screens/Login';
import WishedSubjects from './src/screens/WishedSubjects';
import Profile from './src/screens/Profile';
import Planner from './src/screens/Planner';
import Aprobadas from './src/screens/Aprobadas';
import WorkTime from './src/screens/WorkTime';
import materias from './src/mock/materias.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { UserProvider } from './src/screens/Home/UserContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen(props: any) {
  // Prioriza el usuario de los params si existe
  const user = props.route?.params?.user || props.user || { name: 'Usuario', career: 'Sin datos' };
  const wishedSubjects = props.wishedSubjects || [];
  const navigation = props.navigation;
  const totalMaterias = materias.length;
  const [approvedSubjects, setApprovedSubjects] = React.useState<string[]>([]);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  React.useEffect(() => {
    if (props.route?.params?.refresh) {
      setRefreshKey((k: number) => k + 1);
    }
  }, [props.route?.params?.refresh]);
  React.useEffect(() => {
    AsyncStorage.getItem('approvedSubjects').then((data: any) => {
      if (data) setApprovedSubjects(JSON.parse(data));
    });
  }, [refreshKey]);
  React.useEffect(() => {
    if (approvedSubjects.length === totalMaterias && totalMaterias > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [approvedSubjects, totalMaterias]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 38, fontWeight: 'bold', marginBottom: 4, color: '#AE1131', letterSpacing: 0.5 }}>
        ¡Hola, {user.name}! {approvedSubjects.length === totalMaterias && totalMaterias > 0 ? '🎓' : ''}
      </Text>
      <Text style={{ fontSize: 18, color: '#222', marginBottom: 20 }}>{user.career}</Text>
      {showCelebration && (
        <ConfettiCannon count={120} origin={{x: 180, y: 0}} fadeOut={true} explosionSpeed={350} fallSpeed={2500} />
      )}
      <Card style={{ width: 340, marginBottom: 28, borderRadius: 12, elevation: 2 }}>
        <Card.Title title="Progreso en la carrera" titleStyle={{ color: '#AE1131', fontWeight: 'bold', fontSize: 20 }} style={{ marginBottom: -12 }} />
        <Card.Content>
          <ProgressBar progress={totalMaterias > 0 ? approvedSubjects.length / totalMaterias : 0} color="#AE1131" style={{ marginBottom: 12, height: 12, borderRadius: 6 }} indeterminate={false} />
          <Text style={{ marginBottom: 8, color: '#AE1131', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>{approvedSubjects.length} de {totalMaterias} materias aprobadas</Text>
        </Card.Content>
      </Card>
      <Button mode="contained" style={{ marginVertical: 10, width: 260, backgroundColor: '#AE1131', borderRadius: 8 }} labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }} onPress={() => navigation.navigate('Planner')}>Ir al Planificador</Button>
      <Button mode="contained" style={{ marginVertical: 10, width: 260, backgroundColor: '#AE1131', borderRadius: 8 }} labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }} onPress={() => navigation.navigate('WishedSubjects')}>Materias Deseadas</Button>
      <Button mode="contained" style={{ marginVertical: 10, width: 260, backgroundColor: '#AE1131', borderRadius: 8 }} labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }} onPress={() => navigation.navigate('Main', { screen: 'Profile', params: { user } })}>Perfil</Button>
    </View>
  );
}

function MainTabs({ route }: any) {
  // Obtener el usuario desde los params de navegación raíz
  const user = route?.params?.user;
  const wishedSubjects = route?.params?.wishedSubjects;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#AE1131',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Planner') iconName = 'calendar-clock';
          else if (route.name === 'WishedSubjects') iconName = 'checkbox-marked-outline';
          else if (route.name === 'Profile') iconName = 'account-circle';
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" options={{ title: 'Inicio' }}>
        {props => <HomeScreen {...props} user={user} wishedSubjects={wishedSubjects} />}
      </Tab.Screen>
      <Tab.Screen name="Planner" component={Planner} options={{ title: 'Planificador' }} />
      <Tab.Screen name="WishedSubjects" component={WishedSubjects} options={{ title: 'Materias' }} />
      <Tab.Screen name="Profile" options={{ title: 'Perfil' }}>
        {props => <Profile {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="Aprobadas" component={Aprobadas} options={{ title: 'Materias Aprobadas' }} />
              <Stack.Screen name="WorkTime" component={WorkTime} options={{ title: 'Horario Laboral' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
