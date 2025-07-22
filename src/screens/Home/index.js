import React, { useEffect, useState } from 'react';
import { View, Linking, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import Button from '../../component/Button';

import styles from './styles';

const Options = [
  { text: 'Planificar Cursada', route: 'Planner' },
  { text: 'Personalizar Alternativas', route: 'WishedSubjects' },
  { text: 'Perfil', route: 'Profile' },
  {
    text: 'Siga',
    route: 'Siga',
    onClick: () => {
      Linking.openURL('http://siga.frba.utn.edu.ar/');
    }
  }
];

function Home(props) {
  const user = props.user || { name: 'Usuario', career: 'Sin datos' };
  const [approvedSubjects, setApprovedSubjects] = useState([]);
  const navigation = props.navigation;
  const route = props.route;

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('approvedSubjects').then(data => {
        if (data) setApprovedSubjects(JSON.parse(data));
        else setApprovedSubjects([]);
      });
    }, [route.params?.refresh])
  );

  return (
    <View style={styles.container}>
      {user && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#AE1131' }}>Hola, {user.name}</Text>
          <Text style={{ fontSize: 16, color: '#222' }}>Carrera: {user.career}</Text>
          <Text style={{ fontSize: 16, color: '#222', marginTop: 4 }}>Materias aprobadas: {approvedSubjects.length}</Text>
        </View>
      )}
      {Options.map(option => (
        <Button
          key={option.route}
          title={option.text}
          onPress={
            option.onClick ||
            (() => {
              navigation.push(option.route);
            })
          }
        />
      ))}
    </View>
  );
}

export default Home;
