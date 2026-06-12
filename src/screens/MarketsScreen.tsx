import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {marketsApi} from '../api/api';

export default function MarketsScreen() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const {data, isLoading} = useQuery({
    queryKey: ['markets', query],
    queryFn: () =>
      query
        ? marketsApi.search(query)
        : marketsApi.getAll(),
    retry: false,
  });

  const markets = data?.data || [];

  const handleSearch = () => {
    setQuery(search.trim());
  };

  const renderMarket = ({item}: {item: any}) => (
    <View style={styles.marketCard}>
      <View style={styles.marketHeader}>
        <Text style={styles.marketName}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.chain || 'Independente'}</Text>
        </View>
      </View>
      {item.address && (
        <Text style={styles.marketAddress}>{item.address}</Text>
      )}
      {item.city && (
        <Text style={styles.marketCity}>
          {item.city}{item.state ? ', ' + item.state : ''}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mercados</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Buscar mercados..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#95A5A6"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color="#2ECC71" size="large" />
      ) : (
        <FlatList
          data={markets}
          renderItem={renderMarket}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {query ? 'Nenhum mercado encontrado' : 'Nenhum mercado cadastrado'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  header: {padding: 20, paddingBottom: 12},
  title: {fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 16},
  searchRow: {flexDirection: 'row', gap: 12},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#FFFFFF',
  },
  searchBtn: {
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {color: '#FFFFFF', fontWeight: 'bold', fontSize: 15},
  loader: {marginTop: 40},
  list: {padding: 20, paddingTop: 8},
  marketCard: {
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
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketName: {fontSize: 16, fontWeight: 'bold', color: '#2C3E50', flex: 1},
  badge: {
    backgroundColor: '#EBF5FB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {fontSize: 12, color: '#2ECC71', fontWeight: '600'},
  marketAddress: {fontSize: 14, color: '#7F8C8D', marginBottom: 4},
  marketCity: {fontSize: 14, color: '#95A5A6'},
  emptyText: {textAlign: 'center', color: '#7F8C8D', marginTop: 40, fontSize: 16},
});
