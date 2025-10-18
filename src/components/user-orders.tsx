"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  User,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  streamingAccountId: string;
  accountEmail: string;
  accountPassword: string;
  profileName?: string;
  saleType: "FULL" | "PROFILES";
  quantity: number;
  totalPrice: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
  streamingAccount: {
    name: string;
    type: string;
    quality: string;
    screens: number;
  };
}

export function UserOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCredentials, setVisibleCredentials] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const toggleCredentialsVisibility = (orderId: string) => {
    setVisibleCredentials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copiado al portapapeles`);
    } catch (error) {
      toast.error("Error al copiar");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completado
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Expirado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Mis Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Mis Pedidos
          </CardTitle>
          <CardDescription>
            Historial de tus compras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Compra tus primeras cuentas de streaming para verlas aquí
            </p>
            <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700">
              Explorar Cuentas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Mis Pedidos
        </CardTitle>
        <CardDescription>
          Historial de tus compras y credenciales
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.streamingAccount.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span>{order.streamingAccount.type}</span>
                      <span>•</span>
                      <span>{order.streamingAccount.quality}</span>
                      <span>•</span>
                      <span>{order.streamingAccount.screens} pantallas</span>
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-sm text-gray-500 mt-1">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      Comprado: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={isExpired(order.expiresAt) ? "text-red-500" : ""}>
                      Expira: {new Date(order.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={order.saleType === "FULL" ? "default" : "secondary"}>
                    {order.saleType === "FULL" ? "Cuenta Completa" : "Por Perfil"}
                  </Badge>
                  
                  {order.profileName && (
                    <Badge variant="outline">
                      Perfil: {order.profileName}
                    </Badge>
                  )}
                  
                  <Badge variant="outline">
                    Cantidad: {order.quantity}
                  </Badge>
                </div>

                {/* Credentials Section */}
                {order.status === "COMPLETED" && (
                  <>
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Credenciales de Acceso</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCredentialsVisibility(order.id)}
                        >
                          {visibleCredentials.has(order.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {visibleCredentials.has(order.id) ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm font-medium">Email:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono">{order.accountEmail}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(order.accountEmail, "Email")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm font-medium">Contraseña:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono">{order.accountPassword}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(order.accountPassword, "Contraseña")}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {order.profileName && (
                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <span className="text-sm font-medium">Perfil:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono">{order.profileName}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(order.profileName!, "Perfil")}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Alert>
                          <Eye className="w-4 h-4" />
                          <AlertDescription>
                            Haz clic en el icono del ojo para ver tus credenciales
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </>
                )}

                {order.status === "PENDING" && (
                  <Alert>
                    <Clock className="w-4 h-4" />
                    <AlertDescription>
                      Tu pedido está siendo procesado. Las credenciales estarán disponibles pronto.
                    </AlertDescription>
                  </Alert>
                )}

                {isExpired(order.expiresAt) && order.status === "COMPLETED" && (
                  <Alert variant="destructive">
                    <XCircle className="w-4 h-4" />
                    <AlertDescription>
                      Esta cuenta ha expirado. Renueva tu acceso para seguir disfrutando del contenido.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}