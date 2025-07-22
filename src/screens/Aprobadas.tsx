import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Text, Checkbox, Button, Divider, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import materias from '../mock/materias.json';

const STORAGE_KEY_APPROVED = 'approvedSubjects';

export default function Aprobadas({ navigation }: any) {
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
    navigation.goBack();
  };

  if (loading) return null;

  const totalMaterias = materias.length;
  const selectedMaterias = materias.filter((m) => approvedSubjects.includes(m.label));
  const unselectedMaterias = materias.filter((m) => !approvedSubjects.includes(m.label));

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Selecciona tus materias aprobadas" />
        <Card.Content>
          <ProgressBar progress={totalMaterias > 0 ? approvedSubjects.length / totalMaterias : 0} color="#AE1131" style={{ marginBottom: 12, height: 10, borderRadius: 5 }} indeterminate={false} />
          <Text style={{ marginBottom: 16, color: '#AE1131', fontWeight: 'bold', textAlign: 'center' }}>{approvedSubjects.length} de {totalMaterias} materias aprobadas</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {unselectedMaterias.map((m) => (
              <View key={m.codigo} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Checkbox
                  status={approvedSubjects.includes(m.label) ? 'checked' : 'unchecked'}
                  onPress={() => toggleApproved(m.label)}
                />
                <Text>{m.label}</Text>
              </View>
            ))}
            {selectedMaterias.length > 0 && <>
              <Divider style={{ marginVertical: 12 }} />
              <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Seleccionadas:</Text>
              {selectedMaterias.map((m) => (
                <View key={m.codigo} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Checkbox
                    status={'checked'}
                    onPress={() => toggleApproved(m.label)}
                  />
                  <Text>{m.label}</Text>
                </View>
              ))}
            </>}
          </ScrollView>
          <Button mode="contained" onPress={saveApproved} style={{ marginTop: 16, backgroundColor: '#AE1131' }} labelStyle={{ color: '#fff' }}>
            Guardar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
} 