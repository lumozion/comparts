import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import toast from 'react-hot-toast';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
      }));
      setOrders(ordersData);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 150 },
    { field: 'customerName', headerName: 'Customer', width: 150 },
    { field: 'total', headerName: 'Total', width: 100, valueFormatter: (params) => `₹${params.value}` },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    { field: 'createdAt', headerName: 'Date', width: 120 },
    { field: 'trackingId', headerName: 'Tracking ID', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.row.status === 'pending' && (
            <Button
              size="small"
              variant="contained"
              onClick={() => updateOrderStatus(params.row.id, 'confirmed')}
            >
              Confirm
            </Button>
          )}
          {params.row.status === 'confirmed' && (
            <Button
              size="small"
              variant="contained"
              onClick={() => updateOrderStatus(params.row.id, 'shipped')}
            >
              Ship
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>

      <DataGrid
        rows={orders}
        columns={columns}
        loading={loading}
        autoHeight
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Box>
  );
}