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
  Alert,
  Switch,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {communityApi} from '../api/api';

// LGPD COMPLIANCE: This screen NEVER sends personal data.
// All price reports are anonymous. shareAnonymously is opt-in.
export default function CommunityScreen() {
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [marketId, setMarketId] = useState('');
  const [shareAnonymously, setShareAnonymously] = useState(true);
  const [searchProductId, setSearchProductId] = useState('');

  const {data: pricesData, isLoading} = useQuery({
    queryKey: ['community-prices', searchProductId],
    queryFn: () => communityApi.getPrices({productId: searchProductId}),
    enabled: !!searchProductId,
    retry: false,
  });

  const {mutate: reportPrice, isPending} = useMutation({
    mutationFn: (data: any) => communityApi.reportPrice(data),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Preco reportado com sucesso!');
      setProductId('');
      setPrice('');
      setMarketId('');
      queryClient.invalidateQueries({queryKey: ['community-prices']});
    },
    onError: () => {
      Alert.alert('Erro', 'Falha ao reportar preco');
    },
  });

  const handleReport = () => {
    if (!productId || !price) {
      Alert.alert('Erro', 'Preencha o ID do produto e o preco');
      return;
    }
    const priceValue = parseFloat(price.replace(',', '.'));
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Erro', 'Preco invalido');
      return;
    }
    // LGPD: Sending only price data, no personal info
    reportPrice({
      productId,
      price: priceValue,
      marketId: marketId || undefined,
      shareAnonymously,
    });
  };

  const prices = pricesData?.data || [];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={prices}
        keyExtractor={(item, index) => item.id || String(index)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Preco Colaborativo</Text>
            <Text style={styles.subtitle}>
              Ajude a comunidade compartilhando precos. Seus dados pessoais nunca sao divulgados.
            </Text>

            <View style={styles.lgpdBadge}>
              <Text style={styles.lgpdText}>
                Conformidade LGPD: Nenhum dado pessoal e armazenado
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Reportar Preco</Text>
              <TextInput
                style={styles.input}
                placeholder="ID do Produto"
                value={productId}
                onChangeText={setProductId}
                placeholderTextColor="#95A5A6"
              />
              <TextInput
                style={styles.input}
                placeholder="Preco (ex: 3,99)"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="#95A5A6"
              />
              <TextInput
                style={styles.input}
                placeholder="ID do Mercado (opcional)"
                value={marketId}
                onChangeText={setMarketId}
                placeholderTextColor="#95A5A6"
              />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Compartilhar anonimamente</Text>
                <Switch
                  value={shareAnonymously}
                  onValueChange={setShareAnonymously}
                  trackColor={{false: '#BDC3C7', true: '#2ECC71'}}
                  thumbColor="#FFFFFF"
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleReport}
                disabled={isPending}>
                {isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Reportar Preco</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
              <Text style={styles.cardTitle}>Buscar Precos</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.input}
                  placeholder="ID do Produto"
                  value={searchProductId}
                  onChangeText={setSearchProductId}
                  placeholderTextColor="#95A5A6"
                />
              </View>
            </View>

            {isLoading && (
              <ActivityIndicator color="#2ECC71" style={styles.loader} />
            )}

            {prices.length > 0 && (
              <Text style={styles.resultsTitle}>
                {prices.length} preco(s) encontrado(s)
              </Text>
            )}
          </>
        }
        renderItem={({item}) => (
          <View style={styles.priceItem}>
            <View>
              <Text style={styles.priceMarket}>
                {item.market?.name || 'Mercado nao informado'}
              </Text>
              <Text style={styles.priceDate}>
                {new Date(item.reportedAt || item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <Text style={styles.priceValue}>
              R$ {(item.price || 0).toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          searchProductId && !isLoading ? (
            <Text style={styles.emptyText}>Nenhum preco encontrado</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  content: {padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8},
  subtitle: {fontSize: 14, color: '#7F8C8D', marginBottom: 16, lineHeight: 20},
  lgpdBadge: {
    backgroundColor: '#EBF5FB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  lgpdText: {fontSize: 13, color: '#2C3E50', fontWeight: '600'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 16},
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {fontSize: 15, color: '#2C3E50'},
  button: {
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'},
  searchSection: {marginBottom: 16},
  searchRow: {},
  loader: {marginVertical: 16},
  resultsTitle: {fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 12},
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  priceMarket: {fontSize: 15, color: '#2C3E50'},
  priceDate: {fontSize: 12, color: '#95A5A6', marginTop: 2},
  priceValue: {fontSize: 18, fontWeight: 'bold', color: '#2ECC71'},
  emptyText: {textAlign: 'center', color: '#7F8C8D', marginTop: 20, fontSize: 16},
});
