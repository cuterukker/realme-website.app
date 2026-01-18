import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    ram: 'all',
    storage: 'all',
    category: 'all'
  });
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('realme-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState({});

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('realme-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
  };

  useEffect(() => {
    const sampleProducts = [
      {
        id: 1,
        name: "Realme GT Neo 5",
        price: 32999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt-neo5.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop",
        specs: ["Snapdragon 8+ Gen 1", "12GB RAM", "256GB Storage", "144Hz AMOLED", "50MP Camera"],
        ram: "12GB",
        storage: "256GB",
        category: "flagship",
        featured: true,
        badge: "Bestseller"
      },
      {
        id: 2,
        name: "Realme 11 Pro+",
        price: 27999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-11-pro-plus.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop",
        specs: ["Dimensity 7050", "8GB RAM", "256GB Storage", "200MP Camera", "100W Charging"],
        ram: "8GB",
        storage: "256GB",
        category: "premium",
        featured: true,
        badge: "New"
      },
      {
        id: 3,
        name: "Realme Narzo 60 Pro",
        price: 21999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-60-pro.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop",
        specs: ["Dimensity 7050", "12GB RAM", "256GB Storage", "100W Charging", "120Hz Display"],
        ram: "12GB",
        storage: "256GB",
        category: "midrange",
        featured: true,
        badge: "Value"
      },
      {
        id: 4,
        name: "Realme C55",
        price: 12999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-c55.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1598327105854-c8674faddf74?w=800&auto=format&fit=crop",
        specs: ["Helio G88", "6GB RAM", "128GB Storage", "64MP Camera", "33W Charging"],
        ram: "6GB",
        storage: "128GB",
        category: "budget",
        featured: false
      },
      {
        id: 5,
        name: "Realme GT 2 Pro",
        price: 39999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt2-pro.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop",
        specs: ["Snapdragon 8 Gen 1", "12GB RAM", "256GB Storage", "LTPO AMOLED", "150MP Camera"],
        ram: "12GB",
        storage: "256GB",
        category: "flagship",
        featured: false
      },
      {
        id: 6,
        name: "Realme 10 Pro",
        price: 18999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-10-pro.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1546054451-aa264c0c9936?w=800&auto=format&fit=crop",
        specs: ["Snapdragon 695", "8GB RAM", "128GB Storage", "108MP Camera", "67W Charging"],
        ram: "8GB",
        storage: "128GB",
        category: "midrange",
        featured: false
      },
      {
        id: 7,
        name: "Realme 9 Pro+",
        price: 23999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-9-pro-plus.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop",
        specs: ["Dimensity 920", "8GB RAM", "128GB Storage", "90Hz AMOLED", "50MP Sony IMX766"],
        ram: "8GB",
        storage: "128GB",
        category: "premium",
        featured: false
      },
      {
        id: 8,
        name: "Realme Narzo 50 Pro",
        price: 16999,
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-50-pro.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop",
        specs: ["Helio G96", "6GB RAM", "64GB Storage", "50W Charging", "90Hz Display"],
        ram: "6GB",
        storage: "64GB",
        category: "budget",
        featured: false
      }
    ];
    
    setProducts(sampleProducts);
    setFilteredProducts(sampleProducts);
  }, []);


  const handleImageError = (productId) => {
    setImageError(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  
  useEffect(() => {
    let filtered = products.filter(product => {
      const priceMatch = 
        (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || product.price <= Number(filters.maxPrice));
      const ramMatch = filters.ram === 'all' || product.ram === filters.ram;
      const storageMatch = filters.storage === 'all' || product.storage === filters.storage;
      const categoryMatch = filters.category === 'all' || product.category === filters.category;
      
      return priceMatch && ramMatch && storageMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
  }, [filters, products]);

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
  
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = theme === 'dark' ? '✓' : '✓ Added';
    button.style.background = theme === 'dark' ? '#10b981' : '#10b981';
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
    }, 1000);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      ram: 'all',
      storage: 'all',
      category: 'all'
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'products', 'comparison', 'stats'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('realme-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
  
      <div className={`theme-transition ${isTransitioning ? 'active' : ''}`}></div>

      <div className="App">
      
        <nav className="navbar">
          <div className="container">
            <a href="#hero" className="logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
              <img 
                src="https://www.freepnglogos.com/uploads/realme-logo-png/realme-logo-symbol-phone-5g-hd-logo-0.png" 
                alt="Realme Logo" 
                className="logo-img" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Realme_logo.svg/2560px-Realme_logo.svg.png";
                }}
              />
              <span className="logo-text">Realme</span>
            </a>
            
            <div className="nav-controls">
              <button 
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                <i className="sun">☀️</i>
                <i className="moon">🌙</i>
              </button>
              
              <button 
                className="menu-btn" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span style={{fontSize: '24px'}}>{isMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
            
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li>
                <a 
                  href="#features"
                  className={activeSection === 'features' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#products"
                  className={activeSection === 'products' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('products'); }}
                >
                  Products
                </a>
              </li>
              <li>
                <a 
                  href="#comparison"
                  className={activeSection === 'comparison' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollToSection('comparison'); }}
                >
                  Comparison
                </a>
              </li>
              <li>
                <a 
                  href="#cart"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    alert(`Cart Summary:\nItems: ${getCartCount()}\nTotal: ₹${getCartTotal().toLocaleString()}`);
                  }}
                >
                  Cart <span className="cart-count">{getCartCount()}</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

      
        <section className="hero" id="hero">
          <div className="container">
            <div className="hero-content slide-up">
              <h1>Professional Performance, {theme === 'dark' ? 'Dark' : 'Light'} Mode</h1>
              <p>Experience the perfect balance of cutting edge technology and elegant simplicity with realme smartphones.</p>
              
              <div className="theme-preview">
                <div 
                  className={`theme-card light ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <div className="theme-icon">☀️</div>
                  <div>Light Mode</div>
                </div>
                <div 
                  className={`theme-card dark ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="theme-icon">🌙</div>
                  <div>Dark Mode</div>
                </div>
              </div>
              
              <div className="hero-cta">
                <button 
                  className="btn" 
                  onClick={() => scrollToSection('products')}
                >
                  Explore Products
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={toggleTheme}
                >
                  Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                </button>
              </div>
            </div>
            <div className="phone-showcase fade-in">
              <img 
                src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&auto=format&fit=crop" 
                alt="Realme Flagship Smartphone" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1598327105854-c8674faddf74?w=1200&auto=format&fit=crop";
                }}
              />
            </div>
          </div>
        </section>

      
        <section className="features" id="features">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Professional Features</h2>
                <p className="section-subtitle">Engineered for performance, designed for professionals</p>
              </div>
            </div>
            <div className="features-grid">
              {[
                { 
                  icon: theme === 'dark' ? "🌙" : "☀️", 
                  title: "Adaptive Display", 
                  desc: "Smart display technology that adjusts brightness and color temperature based on ambient light and time of day." 
                },
                { 
                  icon: "⚡", 
                  title: "Enterprise Performance", 
                  desc: "Flagship processors with optimized cooling for sustained performance during demanding tasks." 
                },
                { 
                  icon: "🛡️", 
                  title: "Security Suite", 
                  desc: "Multi-layer security with hardware-level protection and enterprise-grade encryption." 
                },
                { 
                  icon: "📱", 
                  title: "Productivity Tools", 
                  desc: "Advanced multitasking features, desktop mode, and professional-grade accessories support." 
                },
                { 
                  icon: "🌐", 
                  title: "Global Connectivity", 
                  desc: "5G support with worldwide band compatibility and enterprise VPN optimization." 
                },
                { 
                  icon: "🔋", 
                  title: "Power Management", 
                  desc: "Intelligent battery optimization with fast charging and power-saving modes for business travel." 
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      
        <section className="products-section" id="products">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Professional Series</h2>
                <p className="section-subtitle">Select the perfect device for your professional needs</p>
              </div>
              <div className="section-controls">
                <span className="text-muted">{filteredProducts.length} products</span>
                <button 
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>

          
            <div className="filter-section">
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Price Range (₹)</label>
                  <div className="price-inputs">
                    <input
                      type="text"
                      name="minPrice"
                      placeholder="Min"
                      className="price-input"
                      value={filters.minPrice}
                      onChange={handlePriceChange}
                    />
                    <span className="text-muted">to</span>
                    <input
                      type="text"
                      name="maxPrice"
                      placeholder="Max"
                      className="price-input"
                      value={filters.maxPrice}
                      onChange={handlePriceChange}
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>RAM</label>
                  <select 
                    name="ram" 
                    className="filter-select"
                    value={filters.ram} 
                    onChange={handleFilterChange}
                  >
                    <option value="all">All RAM Options</option>
                    <option value="6GB">6GB</option>
                    <option value="8GB">8GB</option>
                    <option value="12GB">12GB</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Storage</label>
                  <select 
                    name="storage" 
                    className="filter-select"
                    value={filters.storage} 
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Storage Options</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Category</label>
                  <select 
                    name="category" 
                    className="filter-select"
                    value={filters.category} 
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Categories</option>
                    <option value="flagship">Flagship</option>
                    <option value="premium">Premium</option>
                    <option value="midrange">Mid Range</option>
                    <option value="budget">Budget</option>
                  </select>
                </div>
              </div>
            </div>

          
            <div className="cart-summary">
              <div className="cart-details">
                <div className="cart-item-count">
                  <span>Cart Items:</span>
                  <strong>{getCartCount()}</strong>
                </div>
                <div className="cart-total">
                  Total: ₹{getCartTotal().toLocaleString()}
                </div>
              </div>
              {cart.length > 0 && (
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    if (window.confirm(`Clear ${getCartCount()} items from cart?`)) {
                      setCart([]);
                    }
                  }}
                >
                  Clear Cart
                </button>
              )}
            </div>

            
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <h3>No products match your criteria</h3>
                <p>Try adjusting your filters or browse our complete collection</p>
                <button 
                  className="btn" 
                  onClick={clearFilters}
                  style={{marginTop: '16px'}}
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="product-card fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="product-image-container">
                      <img 
                        src={imageError[product.id] ? product.fallbackImage : product.image}
                        alt={product.name}
                        className="product-image"
                        onError={() => handleImageError(product.id)}
                        loading="lazy"
                      />
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="product-category">{product.category.toUpperCase()}</span>
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-price">₹{product.price.toLocaleString()}</div>
                      <ul className="product-specs">
                        {product.specs.slice(0, 3).map((spec, idx) => (
                          <li key={idx}>{spec}</li>
                        ))}
                      </ul>
                      <div className="product-actions">
                        <button 
                          className="btn" 
                          onClick={(e) => addToCart(product, e)}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="btn btn-outline"
                          onClick={() => {
                            const details = product.specs.join('\n• ');
                            alert(`${product.name}\n\nSpecifications:\n• ${details}`);
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      
        <section className="comparison-section" id="comparison">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Model Comparison</h2>
                <p className="section-subtitle">Compare specifications to find your perfect match</p>
              </div>
            </div>
            
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Realme GT Neo 5</th>
                    <th>Realme 11 Pro+</th>
                    <th>Realme Narzo 60 Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="highlight">Processor</td>
                    <td>Snapdragon 8+ Gen 1</td>
                    <td>Dimensity 7050</td>
                    <td>Dimensity 7050</td>
                  </tr>
                  <tr>
                    <td className="highlight">RAM & Storage</td>
                    <td>12GB + 256GB</td>
                    <td>8GB + 256GB</td>
                    <td>12GB + 256GB</td>
                  </tr>
                  <tr>
                    <td className="highlight">Display</td>
                    <td>6.74" 144Hz AMOLED</td>
                    <td>6.7" 120Hz AMOLED</td>
                    <td>6.7" 120Hz AMOLED</td>
                  </tr>
                  <tr>
                    <td className="highlight">Camera</td>
                    <td>50MP + 8MP + 2MP</td>
                    <td>200MP + 8MP + 2MP</td>
                    <td>100MP + 8MP + 2MP</td>
                  </tr>
                  <tr>
                    <td className="highlight">Battery</td>
                    <td>5000mAh, 150W</td>
                    <td>5000mAh, 100W</td>
                    <td>5000mAh, 100W</td>
                  </tr>
                  <tr>
                    <td className="highlight">Price</td>
                    <td>₹32,999</td>
                    <td>₹27,999</td>
                    <td>₹21,999</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      
        <section className="stats-section" id="stats">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title" style={{color: 'var(--text-inverse)'}}>Enterprise Trust</h2>
                <p className="section-subtitle" style={{color: 'var(--text-tertiary)'}}>Trusted by professionals worldwide</p>
              </div>
            </div>
            <div className="stats-grid">
              {[
                { number: "98%", label: "Enterprise Satisfaction Rate" },
                { number: "50M+", label: "Professional Users" },
                { number: "150+", label: "Countries Served" },
                { number: "24/7", label: "Enterprise Support" },
                { number: "99.2%", label: "Device Reliability" },
                { number: "<2h", label: "Average Support Response" }
              ].map((stat, index) => (
                <div key={index} className="stat-card fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>Realme Professional</h3>
                <p className="footer-contact">
                  Enterprise grade smartphones designed for professionals who demand performance, reliability, and elegance.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link" onClick={(e) => e.preventDefault()}>in</a>
                  <a href="#" className="social-link" onClick={(e) => e.preventDefault()}>f</a>
                  <a href="#" className="social-link" onClick={(e) => e.preventDefault()}>𝕏</a>
                  <a href="#" className="social-link" onClick={(e) => e.preventDefault()}>▶</a>
                </div>
              </div>
              
              <div className="footer-section">
                <h3>Products</h3>
                <ul className="footer-links">
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Professional Series</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Enterprise Solutions</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Accessories</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Business Services</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>Support</h3>
                <ul className="footer-links">
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Enterprise Support</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Technical Documentation</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Warranty & Services</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Contact Sales</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>Contact</h3>
                <ul className="footer-links footer-contact">
                  <li>
                    <span style={{minWidth: '20px'}}>📞</span>
                    <span>Enterprise Sales: 1800-102-2777</span>
                  </li>
                  <li>
                    <span style={{minWidth: '20px'}}>✉️</span>
                    <span>enterprise@realme.com</span>
                  </li>
                  <li>
                    <span style={{minWidth: '20px'}}>🏢</span>
                    <span>Realme Enterprise Solutions<br />Global Headquarters</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="copyright">
                © {new Date().getFullYear()} Realme. All rights reserved. Enterprise Solutions Division.
                <br />
                <small style={{color: '#666', fontSize: '12px'}}>
                  Current theme: {theme === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode
                </small>
              </div>
              <div className="legal-links">
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Compliance</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;