import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import materias from '../mock/materias.json';

export default function Profile({ route, navigation }: any) {
  const user = route.params?.user || { name: 'Usuario', career: 'Sin datos' };
  const [approvedSubjects, setApprovedSubjects] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('approvedSubjects').then((data) => {
      if (data) setApprovedSubjects(JSON.parse(data));
    });
  }, []);

  const totalMaterias = materias.length;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Card style={{ width: 320, marginBottom: 24 }}>
        <Card.Title title="Perfil" />
        <Card.Content>
          <Text variant="titleMedium">Nombre: {user.name}</Text>
          <Text variant="titleMedium">Carrera: {user.career}</Text>
        </Card.Content>
      </Card>
      <Button style={{ marginTop: 24, backgroundColor: '#AE1131' }} mode="contained" labelStyle={{ color: '#fff' }} onPress={() => navigation.navigate('Aprobadas')}>
        Configura tus materias aprobadas
      </Button>
      <Button style={{ marginTop: 16, backgroundColor: '#AE1131' }} mode="contained" labelStyle={{ color: '#fff' }} onPress={() => navigation.navigate('WorkTime')}>
        Configura tu horario laboral
      </Button>
      <Button style={{ marginTop: 16 }} mode="outlined" onPress={() => navigation.replace('Login')}>
        Cerrar sesión
      </Button>
    </View>
  );
} 