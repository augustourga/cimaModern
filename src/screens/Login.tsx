import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button, Snackbar, Text, Card } from 'react-native-paper';
import users from '../mock/users.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './Home/UserContext';

export default function Login({ navigation }: any) {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { setUser } = useUser();

  const onSubmit = () => {
    const user = users.find(
      (u) => u.username === inputUsername && u.password === inputPassword
    );
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigation.replace('Main', { user });
    } else {
      setSnackbarMessage('Usuario o Contraseña Incorrecta');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Image source={require('../../CIMA.png')} style={{ width: 180, height: 90, marginBottom: 32, resizeMode: 'contain' }} />
      <Card style={{ width: 320, padding: 24 }}>
        <Card.Title title="CIMA - Login" titleStyle={{ color: '#AE1131', fontWeight: 'bold' }} />
        <Card.Content>
          <TextInput
            label="Usuario"
            value={inputUsername}
            onChangeText={setInputUsername}
            mode="outlined"
            style={{ marginBottom: 16 }}
            theme={{ colors: { primary: '#AE1131' } }}
          />
          <TextInput
            label="Contraseña"
            value={inputPassword}
            onChangeText={setInputPassword}
            secureTextEntry
            mode="outlined"
            style={{ marginBottom: 16 }}
            theme={{ colors: { primary: '#AE1131' } }}
          />
          <Button mode="contained" onPress={onSubmit} style={{ marginBottom: 8, backgroundColor: '#AE1131' }} labelStyle={{ color: '#fff' }}>
            Ingresar
          </Button>
        </Card.Content>
      </Card>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ marginBottom: 32, backgroundColor: '#AE1131' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
} 