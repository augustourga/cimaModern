import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Checkbox, Button, Divider, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import materias from '../mock/materias.json';
import { CommonActions, useNavigation } from '@react-navigation/native';

const STORAGE_KEY_APPROVED = 'approvedSubjects';

export default function Aprobadas({ navigation: navProp }: any) {
  const navigation = useNavigation();
  const [approvedSubjects, setApprovedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY_APPROVED).then((data) => {
      if (data) setApprovedSubjects(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const toggleApproved = (label: string) => {
    setApprovedSubjects((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const saveApproved = async () => {
    await AsyncStorage.setItem(STORAGE_KEY_APPROVED, JSON.stringify(approvedSubjects));
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      console.error('No hay usuario en AsyncStorage.');
      return;
    }
    navigation.navigate('Main', { screen: 'Home', params: { refresh: Date.now() } });
  };

  if (loading) return null;

  const totalMaterias = materias.length;
  const selectedMaterias = materias.filter((m) => approvedSubjects.includes(m.label));
  const unselectedMaterias = materias.filter((m) => !approvedSubjects.includes(m.label));

  return (
    <View style={{ flex: 1, padding: 0, backgroundColor: '#fff' }}>
      <Card style={{ margin: 16, marginBottom: 0 }}>
        <Card.Title title="Selecciona tus materias aprobadas" titleStyle={{ color: '#AE1131', fontWeight: 'bold', fontSize: 24 }} />
        <Card.Content>
          <ProgressBar progress={totalMaterias > 0 ? approvedSubjects.length / totalMaterias : 0} color="#AE1131" style={{ marginBottom: 12, height: 10, borderRadius: 5 }} indeterminate={false} />
          <Text style={{ marginBottom: 16, color: '#AE1131', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>{approvedSubjects.length} de {totalMaterias} materias aprobadas</Text>
          <ScrollView style={{ maxHeight: 400, marginBottom: 80 }}>
            {unselectedMaterias.map((m) => (
              <View key={m.codigo} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Checkbox
                  status={approvedSubjects.includes(m.label) ? 'checked' : 'unchecked'}
                  onPress={() => toggleApproved(m.label)}
                  color="#AE1131"
                />
                <Text style={{ fontSize: 18, marginLeft: 8, color: '#222' }}>{m.label}</Text>
              </View>
            ))}
            {selectedMaterias.length > 0 && <>
              <Divider style={{ marginVertical: 12 }} />
              <Text style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>Seleccionadas:</Text>
              {selectedMaterias.map((m) => (
                <View key={m.codigo} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Checkbox
                    status={'checked'}
                    onPress={() => toggleApproved(m.label)}
                    color="#AE1131"
                  />
                  <Text style={{ fontSize: 18, marginLeft: 8, color: '#222' }}>{m.label}</Text>
                </View>
              ))}
            </>}
          </ScrollView>
        </Card.Content>
      </Card>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' }}>
        <Button mode="contained" onPress={saveApproved} style={{ backgroundColor: '#AE1131', borderRadius: 8 }} labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          Guardar
        </Button>
      </View>
    </View>
  );
} 