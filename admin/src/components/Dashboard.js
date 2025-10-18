import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory,
  Category,
  ShoppingCart,
  People,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../services/AuthContext';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import DashboardStats from './DashboardStats';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, component: 'dashboard' },
  { text: 'Products', icon: <Inventory />, component: 'products' },
  { text: 'Categories', icon: <Category />, component: 'categories' },
  { text: 'Orders', icon: <ShoppingCart />, component: 'orders' },
  { text: 'Users', icon: <People />, component: 'users' },
];

export default function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const { logout, user } = useAuth();

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <DashboardStats />;
      case 'products':
        return <ProductsManager />;
      case 'orders':
        return <OrdersManager />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ComParts Admin
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedComponent === item.component}
                  onClick={() => setSelectedComponent(item.component)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderComponent()}
      </Box>
    </Box>
  );
}