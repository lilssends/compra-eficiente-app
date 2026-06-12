import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {purchasesApi} from '../api/api';

export default function PurchasesScreen() {
  const {data: purchasesData, isLoading} = useQuery({
    queryKey: ['purchases'],
    queryFn: () => purchasesApi.getAll(),
    retry: false,
  });

  const {data: inflationData} = useQuery({
    queryKey: ['inflation'],
    queryFn: () => purchasesApi.getInflationReport(),
    retry: false,
  });

  const purchases = purchasesData?.data || [];
  const inflation = inflationData?.data;

  const renderPurchase = ({item}: {item: any}) => {
    const date = new Date(item.purchaseAt || item.createdAt);
    const formattedDate = date.toLocaleDateString('pt-BR');

    return (
      <View style={styles.purchaseCard}>
        <View style={styles.purchaseHeader}>
          <Text style={styles.purchaseDate}>{formattedDate}</Text>
          <Text style={styles.purchaseTotal}>
            R$ {(item.totalValue || 0).toFixed(2)}
          </Text>
        </View>
        {item.market && (
          <Text style={styles.purchaseMarket}>{item.market.name}</Text>
        )}
        {item.items && item.items.length > 0 && (
          <Text style={styles.purchaseItems}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'itens'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Compras</Text>

        {inflation && (
          <View style={[
            styles.inflationCard,
            inflation.inflationPercent > 0 ? styles.inflationNeg : styles.inflationPos
          ]}>
            <Text style={styles.inflationLabel}>Inflacao Pessoal</Text>
            <Text style={styles.inflationValue}>
              {inflation.inflationPercent > 0 ? '+' : ''}
              {(inflation.inflationPercent || 0).toFixed(2)}%
            </Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color="#2ECC71" size="large" />
      ) : (
        <FlatList
          data={purchases}
          renderItem={renderPurchase}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma compra registrada ainda
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  header: {padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 16},
  inflationCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inflationPos: {backgroundColor: '#D5F5E3'},
  inflationNeg: {backgroundColor: '#FADBD8'},
  inflationLabel: {fontSize: 14, color: '#2C3E50', fontWeight: '600'},
  inflationValue: {fontSize: 20, fontWeight: 'bold', color: '#2C3E50'},
  loader: {marginTop: 40},
  list: {padding: 20, paddingTop: 0},
  purchaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  purchaseDate: {fontSize: 14, color: '#7F8C8D'},
  purchaseTotal: {fontSize: 18, fontWeight: 'bold', color: '#2ECC71'},
  purchaseMarket: {fontSize: 15, color: '#2C3E50', marginBottom: 4},
  purchaseItems: {fontSize: 13, color: '#95A5A6'},
  emptyText: {textAlign: 'center', color: '#7F8C8D', marginTop: 40, fontSize: 16},
});
