"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Moon, Sun, ShoppingCart, User, Menu, X, Star, Check, Play, Search, Plus, Minus } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ShoppingCart as ShoppingCartComponent } from "@/components/shopping-cart";

interface StreamingAccount {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  duration: string;
  quality: string;
  screens: number;
  active: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [streamingAccounts, setStreamingAccounts] = useState<StreamingAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<StreamingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const accountsPerPage = 9;

  useEffect(() => {
    setMounted(true);
    fetchStreamingAccounts();
    if (session?.user?.id) {
      fetchUserCredits();
    }
  }, [session]);

  useEffect(() => {
    const filtered = streamingAccounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [searchTerm, streamingAccounts]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (response.ok) {
        const userData = await response.json();
        setUserCredits(userData.credits || 0);
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  const fetchStreamingAccounts = async () => {
    try {
      const response = await fetch("/api/streaming-accounts");
      if (response.ok) {
        const accounts = await response.json();
        setStreamingAccounts(accounts);
        setFilteredAccounts(accounts);
        
        const initialQuantities: { [key: string]: number } = {};
        accounts.forEach((account: StreamingAccount) => {
          initialQuantities[account.id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error("Error fetching streaming accounts:", error);
      toast.error("Error al cargar las cuentas de streaming");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAddToCart = async (account: StreamingAccount) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const quantity = quantities[account.id] || 1;
    
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streamingAccountId: account.id,
          quantity: quantity,
          saleType: "FULL"
        }),
      });

      if (response.ok) {
        toast.success(`${quantity} cuenta(s) de ${account.name} agregada(s) al carrito`);
        fetchUserCredits();
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al agregar al carrito");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error al agregar al carrito");
    }
  };

  const updateQuantity = (accountId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [accountId]: Math.max(1, (prev[accountId] || 1) + delta)
    }));
  };

  const navigateToDashboard = () => {
    if (session) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/auth/signin");
    }
  };

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const startIndex = (currentPage - 1) * accountsPerPage;
  const endIndex = startIndex + accountsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-green-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">StreamHub</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar cuentas de streaming..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#accounts" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Cuentas
              </a>
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Características
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Contacto
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {status === "authenticated" ? (
                <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300" onClick={navigateToDashboard}>
                  <User className="w-4 h-4" />
                  <span>Mi Panel</span>
                </Button>
              ) : (
                <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300" onClick={() => router.push("/auth/signin")}>
                  <User className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </Button>
              )}

              <Button 
                className="bg-green-600 hover:bg-green-700 text-white relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar cuentas de streaming..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-4">
                <a href="#accounts" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                  Cuentas
                </a>
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                  Características
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                  Contacto
                </a>
                {status === "authenticated" ? (
                  <Button variant="ghost" className="justify-start text-gray-700 dark:text-gray-300" onClick={navigateToDashboard}>
                    <User className="w-4 h-4 mr-2" />
                    Mi Panel
                  </Button>
                ) : (
                  <Button variant="ghost" className="justify-start text-gray-700 dark:text-gray-300" onClick={() => router.push("/auth/signin")}>
                    <User className="w-4 h-4 mr-2" />
                    Iniciar sesión
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            🎬 La mejor selección de streaming
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Accede a todo el contenido que amas
            <span className="block text-green-600 dark:text-green-400">a un precio increíble</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Disfruta de Netflix, Disney+, HBO Max y más plataformas de streaming por una fracción del costo. 
            Calidad garantizada y entrega instantánea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3" onClick={() => document.getElementById('accounts')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver todas las cuentas
            </Button>
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-3">
              Cómo funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Streaming Accounts Grid */}
      <section id="accounts" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Elige tu plataforma favorita
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Todas las cuentas incluyen entrega instantánea y soporte 24/7
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Mostrando {filteredAccounts.length} resultados para "{searchTerm}"
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {currentAccounts.map((account, index) => (
                <Card key={account.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {index === 0 && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                      {account.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {account.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${account.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/ {account.duration}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{account.quality}</span>
                        <span className="mx-2">•</span>
                        <span>{account.screens} pantallas</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(account.id, -1)}
                        disabled={(quantities[account.id] || 1) <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {quantities[account.id] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(account.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm" 
                      onClick={() => handleAddToCart(account)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al Carrito ({quantities[account.id] || 1})
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              La mejor experiencia de streaming a tu alcance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Calidad garantizada
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Todas nuestras cuentas son verificadas y funcionales
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Entrega instantánea
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recibe tus credenciales inmediatamente después del pago
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Soporte 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Estamos aquí para ayudarte en cualquier momento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StreamHub</span>
              </div>
              <p className="text-gray-400">
                Tu proveedor de confianza para cuentas de streaming premium.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#accounts" className="hover:text-green-400 transition-colors">Cuentas</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Soporte</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Reembolso</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@streamhub.com</li>
                <li>WhatsApp: +1234567890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 StreamHub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Mi Carrito</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <ShoppingCartComponent 
                  userCredits={userCredits}
                  onPurchaseComplete={() => {
                    setCartOpen(false);
                    fetchUserCredits();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}