import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const q = query(collection(db, 'products'), limit(10));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <Card.Cover source={{ uri: item.imageUrl || 'https://via.placeholder.com/300' }} />
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodyMedium" style={styles.price}>₹{item.price}</Text>
        <Text variant="bodySmall" numberOfLines={2}>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => navigation.navigate('ProductDetail', { product: item })}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        onSubmitEditing={() => navigation.navigate('Products', { searchQuery })}
      />
      
      <Text variant="headlineSmall" style={styles.sectionTitle}>
        Featured Products
      </Text>
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        refreshing={loading}
        onRefresh={fetchFeaturedProducts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 15,
  },
  sectionTitle: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    maxWidth: '48%',
  },
  price: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginVertical: 5,
  },
});