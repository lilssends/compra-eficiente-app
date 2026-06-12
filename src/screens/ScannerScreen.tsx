import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {productsApi, communityApi} from '../api/api';

export default function ScannerScreen() {
  const [barcode, setBarcode] = useState('');
  const [searchBarcode, setSearchBarcode] = useState('');

  const {data: productData, isLoading, refetch} = useQuery({
    queryKey: ['product', searchBarcode],
    queryFn: () => productsApi.getByBarcode(searchBarcode),
    enabled: !!searchBarcode,
    retry: false,
  });

  const {data: pricesData} = useQuery({
    queryKey: ['community-prices', searchBarcode],
    queryFn: () => communityApi.getPrices({productId: productData?.data?.id}),
    enabled: !!productData?.data?.id,
    retry: false,
  });

  const handleSearch = () => {
    if (!barcode.trim()) {
      Alert.alert('Erro', 'Digite um codigo de barras');
      return;
    }
    setSearchBarcode(barcode.trim());
  };

  const product = productData?.data;
  const prices = pricesData?.data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Scanner de Produtos</Text>
        <Text style={styles.subtitle}>
          Pesquise por codigo de barras para ver precos
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite o codigo de barras"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="number-pad"
            placeholderTextColor="#95A5A6"
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={handleSearch}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.searchBtnText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {product && (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBarcode}>
              Codigo: {product.barcode}
            </Text>
            {product.brand && (
              <Text style={styles.productBrand}>Marca: {product.brand}</Text>
            )}
            {product.category && (
              <Text style={styles.productCategory}>
                Categoria: {product.category}
              </Text>
            )}
          </View>
        )}

        {prices && prices.length > 0 && (
          <View style={styles.pricesSection}>
            <Text style={styles.pricesTitle}>Precos da Comunidade</Text>
            {prices.map((price: any, index: number) => (
              <View key={index} style={styles.priceItem}>
                <Text style={styles.priceMarket}>
                  {price.market?.name || 'Mercado nao informado'}
                </Text>
                <Text style={styles.priceValue}>
                  R$ {price.price?.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!product && !isLoading && searchBarcode && (
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>
              Produto nao encontrado para o codigo: {searchBarcode}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA'},
  content: {padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8},
  subtitle: {fontSize: 14, color: '#7F8C8D', marginBottom: 24},
  searchRow: {flexDirection: 'row', gap: 12, marginBottom: 24},
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
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8},
  productBarcode: {fontSize: 14, color: '#7F8C8D', marginBottom: 4},
  productBrand: {fontSize: 14, color: '#7F8C8D', marginBottom: 4},
  productCategory: {fontSize: 14, color: '#7F8C8D'},
  pricesSection: {marginTop: 16},
  pricesTitle: {fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12},
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  priceMarket: {fontSize: 15, color: '#2C3E50'},
  priceValue: {fontSize: 15, fontWeight: 'bold', color: '#2ECC71'},
  notFound: {alignItems: 'center', padding: 32},
  notFoundText: {color: '#7F8C8D', textAlign: 'center'},
});
