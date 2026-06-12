import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import {purchasesApi} from '../api/api';

export default function HomeScreen() {
  const user = auth().currentUser;

  const {data: inflationData} = useQuery({
    queryKey: ['inflation'],
    queryFn: () => purchasesApi.getInflationReport(),
    retry: false,
  });

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => auth().signOut(),
      },
    ]);
  };

  const inflationPercent = inflationData?.data?.inflationPercent;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ola,</Text>
            <Text style={styles.userName}>
              {user?.displayName || user?.email || 'Usuario'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {inflationPercent !== undefined && (
          <View style={[styles.card, inflationPercent > 0 ? styles.cardRed : styles.cardGreen]}>
            <Text style={styles.cardTitle}>Inflacao Pessoal</Text>
            <Text style={styles.cardValue}>
              {inflationPercent > 0 ? '+' : ''}{inflationPercent.toFixed(2)}%
            </Text>
            <Text style={styles.cardSubtitle}>
              {inflationPercent > 0
                ? 'Seus gastos aumentaram'
                : 'Voce esta economizando!'}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso Rapido</Text>
          <View style={styles.grid}>
            <View style={styles.quickCard}>
              <Text style={styles.quickCardIcon}>🛒</Text>
              <Text style={styles.quickCardText}>Nova Compra</Text>
            </View>
            <View style={styles.quickCard}>
              <Text style={styles.quickCardIcon}>📊</Text>
              <Text style={styles.quickCardText}>Historico</Text>
            </View>
            <View style={styles.quickCard}>
              <Text style={styles.quickCardIcon}>🏪</Text>
              <Text style={styles.quickCardText}>Mercados</Text>
            </View>
            <View style={styles.quickCard}>
              <Text style={styles.quickCardIcon}>👥</Text>
              <Text style={styles.quickCardText}>Comunidade</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dica do Dia</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Compare precos em diferentes mercados para economizar ate 30% nas suas compras mensais!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  content: {padding: 20},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {fontSize: 14, color: '#7F8C8D'},
  userName: {fontSize: 20, fontWeight: 'bold', color: '#2C3E50'},
  logoutBtn: {padding: 8},
  logoutText: {color: '#E74C3C', fontWeight: '600'},
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardGreen: {backgroundColor: '#2ECC71'},
  cardRed: {backgroundColor: '#E74C3C'},
  cardTitle: {color: '#FFFFFF', fontSize: 14, opacity: 0.9},
  cardValue: {color: '#FFFFFF', fontSize: 40, fontWeight: 'bold', marginVertical: 8},
  cardSubtitle: {color: '#FFFFFF', fontSize: 14, opacity: 0.9},
  section: {marginBottom: 24},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  quickCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickCardIcon: {fontSize: 32, marginBottom: 8},
  quickCardText: {fontSize: 14, color: '#2C3E50', fontWeight: '600'},
  tipCard: {
    backgroundColor: '#EBF5FB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  tipText: {color: '#2C3E50', lineHeight: 22},
});
