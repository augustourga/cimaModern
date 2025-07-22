import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Text, Button as PaperButton } from 'react-native-paper';
import Button from '../../component/Button';
import BlockedDayPicker from './components/BlockedDayPicker';
import styles from './styles';

const STORAGE_KEY = 'workTime';
const dates = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

type BlockedDays = {
  [key: string]: { startTime: string | null; endTime: string | null };
};

export default function WorkTime({ navigation }: any) {
  const [blockedDays, setBlockedDays] = useState<BlockedDays>(
    dates.reduce((accum, value) => ({ ...accum, [value]: { startTime: null, endTime: null } }), {})
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setBlockedDays(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const setStartTime = (day: string) => (time: Date) => {
    setBlockedDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], startTime: time.toISOString() }
    }));
  };

  const setEndTime = (day: string) => (time: Date) => {
    setBlockedDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], endTime: time.toISOString() }
    }));
  };

  const saveLabourHours = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(blockedDays));
    navigation.navigate('Main', { screen: 'Profile' });
  };

  if (loading) return <ActivityIndicator style={styles.activityIndicator} size="large" color="#AE1131" />;

  return (
    <View style={[styles.container, { backgroundColor: '#fff', flex: 1 }]}>
      <Card style={{ margin: 16, marginBottom: 0, borderRadius: 12, elevation: 2 }}>
        <Card.Title title="Configura tu horario laboral" titleStyle={{ color: '#AE1131', fontWeight: 'bold', fontSize: 24 }} />
        <Card.Content>
          <Text style={{ marginBottom: 12, color: '#222', fontSize: 16 }}>
            Selecciona los bloques horarios en los que NO podés cursar por trabajo u otras obligaciones. Estos horarios serán tenidos en cuenta al generar alternativas de cursada.
          </Text>
          {dates.map((day) => (
            <BlockedDayPicker
              key={day}
              day={day}
              setStartTime={setStartTime(day)}
              setEndTime={setEndTime(day)}
              startTime={blockedDays[day].startTime && new Date(blockedDays[day].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              endTime={blockedDays[day].endTime && new Date(blockedDays[day].endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))}
        </Card.Content>
      </Card>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' }}>
        <PaperButton mode="contained" onPress={saveLabourHours} style={{ backgroundColor: '#AE1131', borderRadius: 8 }} labelStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          Guardar
        </PaperButton>
      </View>
    </View>
  );
} 