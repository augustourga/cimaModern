import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Checkbox, Button, Text, Card, Snackbar } from 'react-native-paper';
import materias from '../mock/materias.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wishedSubjects';
const STORAGE_KEY_APPROVED = 'approvedSubjects';

export default function WishedSubjects({ navigation }: any) {
  const [selected, setSelected] = useState<string[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [approvedSubjects, setApprovedSubjects] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setSelected(JSON.parse(data));
    });
    AsyncStorage.getItem(STORAGE_KEY_APPROVED).then((data) => {
      if (data) setApprovedSubjects(JSON.parse(data));
    });
  }, []);

  const toggleSubject = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const saveSubjects = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setSnackbarVisible(true);
    navigation.navigate('Main', { screen: 'Home', params: { wishedSubjects: selected } });
  };

  // Excluir materias aprobadas
  const materiasDisponibles = materias.filter((m) => !approvedSubjects.includes(m.label));

  return (
    <View style={{ flex: 1, padding: 0, backgroundColor: '#fff' }}>
      <Card style={{ margin: 16, marginBottom: 0 }}>
        <Card.Title title="Materias que deseas cursar" titleStyle={{ color: '#AE1131', fontWeight: 'bold', fontSize: 24 }} />
        <Card.Content>
          <ScrollView style={{ maxHeight: 400, marginBottom: 80 }}>
            {materiasDisponibles.map((m) => (
              <View key={m.codigo} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Checkbox
                  status={selected.includes(m.label) ? 'checked' : 'unchecked'}
                  onPress={() => toggleSubject(m.label)}
                  color="#AE1131"
                />
                <Text style={{ fontSize: 18, marginLeft: 8, color: '#222' }}>{m.label}</Text>
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' }}>
        <Button mode="contained" onPress={saveSubjects} style={{ backgroundColor: '#AE1131', borderRadius: 8 }} labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          Guardar
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{ backgroundColor: '#AE1131' }}
      >
        Materias guardadas localmente
      </Snackbar>
    </View>
  );
} 