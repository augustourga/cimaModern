import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import materias from '../mock/materias.json';
import horariosPorMateria from '../mock/horarios.json';

const STORAGE_KEY_WISHED = 'wishedSubjects';
const STORAGE_KEY_APPROVED = 'approvedSubjects';
const STORAGE_KEY_WORKTIME = 'workTime';
const STORAGE_KEY_FAVORITE = 'favoriteAlternative';

type Horario = { dia: string; inicio: string; fin: string; materia?: string };
type Bloqueado = { startTime: string | null; endTime: string | null };

function horarioEnRango(horario: Horario, bloqueado: Bloqueado): boolean {
  if (!bloqueado.startTime || !bloqueado.endTime) return true;
  const [hInicio, mInicio] = horario.inicio.split(':').map(Number);
  const [hFin, mFin] = horario.fin.split(':').map(Number);
  const [hBloqIni, mBloqIni] = bloqueado.startTime.split('T')[1].split(':').map(Number);
  const [hBloqFin, mBloqFin] = bloqueado.endTime.split('T')[1].split(':').map(Number);
  if (hFin < hBloqIni || (hFin === hBloqIni && mFin <= mBloqIni)) return true;
  if (hInicio > hBloqFin || (hInicio === hBloqFin && mInicio >= mBloqFin)) return true;
  return false;
}

function cartesian(arr: Horario[][]): Horario[][] {
  if (arr.length === 0) return [];
  let result: Horario[][] = [[]];
  for (const group of arr) {
    const temp: Horario[][] = [];
    for (const prev of result) {
      for (const item of group) {
        temp.push([...prev, item]);
      }
    }
    result = temp;
  }
  return result;
}

function noSuperpone(combinacion: Horario[]): boolean {
  const porDia: { [dia: string]: Horario[] } = {};
  for (const h of combinacion) {
    const dia: string = String(h.dia);
    if (!porDia[dia]) porDia[dia] = [];
    for (const o of porDia[dia]) {
      if (!(h.fin <= o.inicio || h.inicio >= o.fin)) return false;
    }
    porDia[dia].push(h as Horario);
  }
  return true;
}

function areAlternativesEqual(a: Horario[], b: Horario[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((h, i) => h.materia === b[i].materia && h.dia === b[i].dia && h.inicio === b[i].inicio && h.fin === b[i].fin);
}

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HORA_INICIO = 8;
const HORA_FIN = 22;

function GanttView({ alternativa }: { alternativa: Horario[] }) {
  // Agrupar bloques por día y ordenarlos por hora de inicio
  const bloques: { [dia: string]: { materia: string; inicio: number; fin: number }[] } = {};
  for (const d of DIAS) bloques[d] = [];
  alternativa.forEach((h) => {
    const ini = parseInt(h.inicio.split(":")[0], 10);
    const fin = parseInt(h.fin.split(":")[0], 10);
    bloques[h.dia]?.push({ materia: h.materia || "", inicio: ini, fin: fin });
  });
  // Ordenar bloques por hora de inicio
  for (const d of DIAS) {
    bloques[d].sort((a, b) => a.inicio - b.inicio);
  }
  const colors = ["#90caf9", "#a5d6a7", "#ffe082", "#ffab91", "#ce93d8", "#b0bec5", "#f48fb1", "#bcaaa4"];
  return (
    <ScrollView horizontal style={{ marginVertical: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        {DIAS.map((dia, dIdx) => (
          <View key={dia} style={{ margin: 4, width: 120 }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>{dia}</Text>
            {bloques[dia].length === 0 ? (
              <Text style={{ color: '#bbb', textAlign: 'center', marginTop: 24 }}>Sin cursada</Text>
            ) : (
              bloques[dia].map((b, idx) => (
                <View
                  key={idx}
                  style={{
                    marginBottom: 10,
                    backgroundColor: colors[(dIdx + idx) % colors.length],
                    borderRadius: 6,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13 }}>{b.materia}</Text>
                  <Text style={{ color: '#333', fontSize: 12 }}>{b.inicio}:00 - {b.fin}:00</Text>
                </View>
              ))
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default function Planner() {
  const [wishedSubjects, setWishedSubjects] = useState<string[]>([]);
  const [approvedSubjects, setApprovedSubjects] = useState<string[]>([]);
  const [workTime, setWorkTime] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [alternativas, setAlternativas] = useState<Horario[][]>([]);
  const [favorite, setFavorite] = useState<Horario[] | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY_WISHED),
      AsyncStorage.getItem(STORAGE_KEY_APPROVED),
      AsyncStorage.getItem(STORAGE_KEY_WORKTIME),
      AsyncStorage.getItem(STORAGE_KEY_FAVORITE)
    ]).then(([wished, approved, work, fav]) => {
      if (wished) setWishedSubjects(JSON.parse(wished));
      if (approved) setApprovedSubjects(JSON.parse(approved));
      if (work) setWorkTime(JSON.parse(work));
      if (fav) setFavorite(JSON.parse(fav));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (wishedSubjects.length === 0) {
        setAlternativas([]);
        return;
      }
      const materiasCursar = materias.filter(
        (m) => wishedSubjects.includes(m.label) && !approvedSubjects.includes(m.label)
      );
      const horariosPorMateriaFiltrados = materiasCursar.map((m) => {
        const horarios = (horariosPorMateria as any)[m.label] || [];
        return horarios.filter((h: Horario) => {
          const bloqueado = workTime[h.dia] || { startTime: null, endTime: null };
          return horarioEnRango(h, bloqueado);
        }).map((h: Horario) => ({ ...h, materia: m.label }));
      });
      if (horariosPorMateriaFiltrados.some((h) => h.length === 0)) {
        setAlternativas([]);
        return;
      }
      const combinaciones: Horario[][] = cartesian(horariosPorMateriaFiltrados);
      const alternativasValidas: Horario[][] = combinaciones.filter(noSuperpone).slice(0, 10);
      setAlternativas(alternativasValidas);
    }
  }, [loading, wishedSubjects, approvedSubjects, workTime]);

  useEffect(() => {
    if (!loading && wishedSubjects.length === 0) {
      setAlternativas([]);
    }
  }, [wishedSubjects, loading]);

  const handleFavorite = async (alt: Horario[]) => {
    if (favorite && areAlternativesEqual(favorite, alt)) {
      setFavorite(null);
      await AsyncStorage.removeItem(STORAGE_KEY_FAVORITE);
    } else {
      setFavorite(alt);
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITE, JSON.stringify(alt));
    }
  };

  if (loading) return null;

  // Ordenar: favorita primero si existe
  let alternativasOrdenadas: Horario[][] = alternativas;
  if (wishedSubjects.length === 0) {
    alternativasOrdenadas = [];
  } else if (favorite) {
    const idx = alternativas.findIndex((alt) => areAlternativesEqual(alt, favorite));
    if (idx > -1) {
      alternativasOrdenadas = [alternativas[idx], ...alternativas.slice(0, idx), ...alternativas.slice(idx + 1)];
    }
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Alternativas de Cursada Generadas" />
        <Card.Content>
          {wishedSubjects.length === 0 ? (
            <Text>Selecciona materias deseadas para generar alternativas de cursada.</Text>
          ) : alternativasOrdenadas.length === 0 ? (
            <Text>No se pudo generar alternativas viables con las materias y horarios actuales.</Text>
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              {alternativasOrdenadas.map((alt, idx) => (
                <Card key={idx} style={{ marginBottom: 12, backgroundColor: '#f7f7f7' }}>
                  <Card.Title
                    title={`Alternativa ${idx + 1}${favorite && areAlternativesEqual(alt, favorite) ? ' (Favorita)' : ''}`}
                    right={() => (
                      <IconButton
                        icon={favorite && areAlternativesEqual(alt, favorite) ? 'heart' : 'heart-outline'}
                        iconColor={favorite && areAlternativesEqual(alt, favorite) ? '#E53935' : undefined}
                        onPress={() => handleFavorite(alt)}
                        accessibilityLabel="Marcar como favorita"
                      />
                    )}
                  />
                  <Card.Content>
                    {alt.map((a, j) => (
                      <Text key={j}>{a.materia} - {a.dia} {a.inicio} a {a.fin}</Text>
                    ))}
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          )}
        </Card.Content>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Visualización tipo Gantt (Favorita o primera alternativa)" />
        <Card.Content>
          {wishedSubjects.length === 0 ? (
            <Text>Selecciona materias deseadas para ver el Gantt.</Text>
          ) : alternativasOrdenadas.length === 0 ? (
            <Text>No hay alternativa para mostrar.</Text>
          ) : (
            <GanttView alternativa={alternativasOrdenadas[0]} />
          )}
        </Card.Content>
      </Card>
    </View>
  );
} 