import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, TextField, Card, CardContent, 
  CardMedia, Grid, Container, Box, Badge, IconButton, Chip, Rating,
  Avatar, InputAdornment, Fab, BottomNavigation, BottomNavigationAction,
  Paper, Stack, Divider, Skeleton, Slide, Zoom, Fade
} from '@mui/material';
import {
  ShoppingCart, Search, Menu, FilterList, Add, Remove, Delete, 
  Home, Category, Person, FavoriteBorder, Favorite, Star, 
  Notifications, TrendingUp, LocalOffer, FlashOn, Verified
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5'
    },
    secondary: { 
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777'
    },
    background: { 
      default: '#FAFBFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B'
    },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { fontWeight: 400, letterSpacing: '-0.005em' },
    body2: { fontWeight: 400, letterSpacing: '-0.005em' }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)' }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.02)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    }
  }
});

const mockProducts = [
  { id: 1, name: 'NVIDIA RTX 4090 Ti', price: 189999, originalPrice: 219999, category: 'GPU', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500', rating: 4.9, reviews: 3247, inStock: 5, discount: 14, isFavorite: false, trending: true, verified: true },
  { id: 2, name: 'Intel Core i9-14900KS', price: 74999, originalPrice: 84999, category: 'CPU', image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500', rating: 4.8, reviews: 2192, inStock: 12, discount: 12, isFavorite: true, trending: false, verified: true },
  { id: 3, name: 'Corsair Dominator DDR5 64GB', price: 45999, originalPrice: 52999, category: 'RAM', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500', rating: 4.7, reviews: 1634, inStock: 28, discount: 13, isFavorite: false, trending: true, verified: true },
  { id: 4, name: 'Samsung 990 PRO 4TB NVMe', price: 42999, originalPrice: 49999, category: 'Storage', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', rating: 4.9, reviews: 2823, inStock: 15, discount: 14, isFavorite: true, trending: false, verified: true },
];

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([2, 4]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const login = (email, password) => {
    if (email && password) {
      setLoading(true);
      setTimeout(() => {
        setUser({ email, name: email.split('@')[0], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' });
        setCurrentView('shop');
        setLoading(false);
      }, 1500);
      return true;
    }
    return false;
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (currentView === 'login') {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}>
          <Fade in timeout={800}>
            <Card sx={{ 
              maxWidth: 420, 
              width: '100%',
              borderRadius: 6,
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              overflow: 'visible',
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)'
            }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                p: 5,
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }} />
                <Zoom in timeout={1000}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Typography variant="h3" sx={{ fontWeight: 800 }}>
                      CP
                    </Typography>
                  </Box>
                </Zoom>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Sign in to your ComParts account
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Box component="form" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  if (login(formData.get('email'), formData.get('password'))) {
                    // Loading handled in login function
                  }
                }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    margin="normal"
                    required
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: '#F8FAFC'
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    margin="normal"
                    required
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: '#F8FAFC'
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Box>
                
                <Divider sx={{ my: 3 }}>
                  <Chip label="or" size="small" />
                </Divider>
                
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => setCurrentView('signup')}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                  }}
                >
                  Create New Account
                </Button>
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ pb: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Modern Header */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            color: 'text.primary'
          }}
        >
          <Toolbar sx={{ px: 3, py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}>
                <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>
                  CP
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
                  Good morning 👋
                </Typography>
                <Typography variant="h6" fontWeight="700" sx={{ lineHeight: 1.2 }}>
                  {user?.name || 'Guest'}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' }
                }}
              >
                <Search />
              </IconButton>
              
              <IconButton 
                onClick={() => setCurrentView('cart')}
                sx={{ 
                  bgcolor: 'rgba(236, 72, 153, 0.1)',
                  color: 'secondary.main',
                  '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.2)' }
                }}
              >
                <Badge 
                  badgeContent={cartCount} 
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'secondary.main',
                      color: 'white',
                      fontWeight: 600
                    }
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ pt: 3 }}>
          {/* Hero Section with Glassmorphism */}
          <Slide direction="up" in timeout={600}>
            <Card sx={{ 
              mb: 4,
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              color: 'white',
              borderRadius: 5,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 200
            }}>
              <Box sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.2)',
                backdropFilter: 'blur(40px)'
              }} />
              <CardContent sx={{ p: 5, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FlashOn sx={{ mr: 1, color: '#F59E0B' }} />
                  <Chip 
                    label="Flash Sale" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(245, 158, 11, 0.2)',
                      color: '#F59E0B',
                      fontWeight: 600
                    }} 
                  />
                </Box>
                <Typography variant="h3" fontWeight="800" gutterBottom>
                  Gaming Beast RTX 4090
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 400 }}>
                  Experience next-gen gaming with ray tracing and DLSS 3.0
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Shop Now
                </Button>
              </CardContent>
            </Card>
          </Slide>

          {/* Modern Categories */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: 'text.primary' }}>
              Categories
            </Typography>
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
              {['All', 'GPU', 'CPU', 'RAM', 'Storage', 'Motherboard'].map((category, index) => (
                <Zoom in timeout={300 + index * 100} key={category}>
                  <Chip
                    label={category}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    onClick={() => setSelectedCategory(category)}
                    sx={{ 
                      borderRadius: 4,
                      px: 3,
                      py: 2,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      minWidth: 80,
                      bgcolor: selectedCategory === category ? 'primary.main' : 'transparent',
                      color: selectedCategory === category ? 'white' : 'text.primary',
                      borderColor: selectedCategory === category ? 'primary.main' : 'rgba(0,0,0,0.12)',
                      '&:hover': {
                        bgcolor: selectedCategory === category ? 'primary.dark' : 'rgba(99, 102, 241, 0.08)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                </Zoom>
              ))}
            </Stack>
          </Box>

          {/* Products Grid with Staggered Animation */}
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: 'text.primary' }}>
            Trending Products
          </Typography>
          
          <Grid container spacing={3}>
            {mockProducts
              .filter(product => 
                (selectedCategory === 'All' || product.category === selectedCategory) &&
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Slide direction="up" in timeout={400 + index * 100}>
                  <Card sx={{ 
                    borderRadius: 5,
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover .product-image': {
                      transform: 'scale(1.05)'
                    }
                  }}>
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        className="product-image"
                        sx={{ 
                          transition: 'transform 0.3s ease',
                          objectFit: 'cover'
                        }}
                      />
                      
                      {/* Badges */}
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        sx={{ position: 'absolute', top: 12, left: 12 }}
                      >
                        {product.trending && (
                          <Chip
                            icon={<TrendingUp sx={{ fontSize: '1rem' }} />}
                            label="Trending"
                            size="small"
                            sx={{
                              bgcolor: 'rgba(16, 185, 129, 0.9)',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              backdropFilter: 'blur(10px)'
                            }}
                          />
                        )}
                        {product.discount > 10 && (
                          <Chip
                            label={`${product.discount}% OFF`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              backdropFilter: 'blur(10px)'
                            }}
                          />
                        )}
                      </Stack>
                      
                      {/* Favorite Button */}
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          width: 40,
                          height: 40,
                          '&:hover': { 
                            bgcolor: 'white',
                            transform: 'scale(1.1)'
                          }
                        }}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        {favorites.includes(product.id) ? 
                          <Favorite sx={{ color: 'secondary.main', fontSize: '1.3rem' }} /> : 
                          <FavoriteBorder sx={{ fontSize: '1.3rem' }} />
                        }
                      </IconButton>
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {product.verified && (
                          <Verified sx={{ fontSize: '1rem', color: 'primary.main', mr: 0.5 }} />
                        )}
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {product.category}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        fontWeight="600"
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '3em',
                          color: 'text.primary'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating 
                          value={product.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': { color: '#F59E0B' }
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
                          ({product.reviews})
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h5" fontWeight="700" color="primary.main">
                            ₹{product.price.toLocaleString()}
                          </Typography>
                          {product.originalPrice > product.price && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                fontWeight: 500
                              }}
                            >
                              ₹{product.originalPrice.toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {product.inStock} left in stock
                        </Typography>
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addToCart(product)}
                        sx={{ 
                          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                          fontWeight: 600,
                          py: 1.2,
                          borderRadius: 3,
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Modern Bottom Navigation */}
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            borderRadius: '24px 24px 0 0',
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
          }} 
          elevation={0}
        >
          <BottomNavigation
            sx={{ 
              borderRadius: '24px 24px 0 0',
              bgcolor: 'transparent',
              py: 1,
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
                fontWeight: 500,
                '&.Mui-selected': { 
                  color: 'primary.main',
                  fontWeight: 600
                }
              }
            }}
          >
            <BottomNavigationAction 
              label="Store" 
              icon={<Home />} 
              onClick={() => setCurrentView('shop')}
            />
            <BottomNavigationAction 
              label="Categories" 
              icon={<Category />} 
            />
            <BottomNavigationAction 
              label="Cart" 
              icon={
                <Badge 
                  badgeContent={cartCount} 
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'secondary.main',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }
                  }}
                >
                  <ShoppingCart />
                </Badge>
              }
              onClick={() => setCurrentView('cart')}
            />
            <BottomNavigationAction 
              label="Profile" 
              icon={<Person />} 
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;