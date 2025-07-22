import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import materias from '../mock/materias.json';
import { useUser } from './Home/UserContext';

export default function Profile(props: any) {
  const { user } = useUser();
  const [approvedSubjects, setApprovedSubjects] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('approvedSubjects').then((data) => {
      if (data) setApprovedSubjects(JSON.parse(data));
    });
  }, []);

  const totalMaterias = materias.length;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Card style={{ width: 340, marginBottom: 28, borderRadius: 12, elevation: 2 }}>
        <Card.Title title="Perfil" titleStyle={{ color: '#AE1131', fontWeight: 'bold', fontSize: 24 }} style={{ marginBottom: -12 }} />
        <Card.Content>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 6 }}>Nombre: <Text style={{ fontWeight: 'normal' }}>{user.name}</Text></Text>
          <Text style={{ fontSize: 18, color: '#AE1131', marginBottom: 12 }}>Carrera: <Text style={{ color: '#222' }}>{user.career}</Text></Text>
        </Card.Content>
      </Card>
      <Button style={{ marginTop: 24, backgroundColor: '#AE1131', borderRadius: 8 }} mode="contained" labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }} onPress={() => props.navigation.navigate('Aprobadas')}>
        Configura tus materias aprobadas
      </Button>
      <Button style={{ marginTop: 16, backgroundColor: '#AE1131', borderRadius: 8 }} mode="contained" labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }} onPress={() => props.navigation.navigate('WorkTime')}>
        Configura tu horario laboral
      </Button>
      <Button style={{ marginTop: 16, borderRadius: 8 }} mode="outlined" labelStyle={{ fontSize: 18, fontWeight: 'bold' }} onPress={() => props.navigation.replace('Login')}>
        Cerrar sesión
      </Button>
    </View>
  );
} 