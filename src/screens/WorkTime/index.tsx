import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    navigation.navigate('Profile');
  };

  if (loading) return <ActivityIndicator style={styles.activityIndicator} size="large" color="#AE1131" />;

  return (
    <View style={styles.container}>
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
      <Button title="Guardar" onPress={saveLabourHours} color="#AE1131" />
    </View>
  );
} 