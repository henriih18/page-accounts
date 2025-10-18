"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  streamingAccountId: string;
  quantity: number;
  saleType: "FULL" | "PROFILES";
  priceAtTime: number;
  streamingAccount: {
    id: string;
    name: string;
    type: string;
    quality: string;
    screens: number;
  };
}

interface Cart {
  id: string;
  totalAmount: number;
  items: CartItem[];
}

interface ShoppingCartProps {
  userCredits: number;
  onPurchaseComplete?: () => void;
}

export function ShoppingCart({ userCredits, onPurchaseComplete }: ShoppingCartProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Producto eliminado del carrito");
        fetchCart();
      } else {
        toast.error("Error al eliminar del carrito");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Error al eliminar del carrito");
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCart();
      } else {
        toast.error("Error al actualizar cantidad");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Error al actualizar cantidad");
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    if (userCredits < cart.totalAmount) {
      toast.error("Créditos insuficientes");
      return;
    }

    setCheckingOut(true);

    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Compra realizada exitosamente!");
        setCart({ ...cart, items: [], totalAmount: 0 });
        onPurchaseComplete?.();
      } else {
        toast.error(data.error || "Error al procesar la compra");
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("Error al procesar la compra");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mi Carrito
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

  if (!cart || cart.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mi Carrito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400 mt-2">
              Agrega productos para comenzar a comprar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Mi Carrito
          <Badge variant="secondary">{cart.items.length}</Badge>
        </CardTitle>
        <CardDescription>
          Revisa tus productos antes de pagar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium">{item.streamingAccount.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.streamingAccount.type} • {item.streamingAccount.quality}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={item.saleType === "FULL" ? "default" : "secondary"}>
                    {item.saleType === "FULL" ? "Cuenta Completa" : "Por Perfil"}
                  </Badge>
                  <span className="text-sm font-medium text-green-600">
                    ${item.priceAtTime.toFixed(2)} c/u
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tus créditos:</span>
            <span className={userCredits >= cart.totalAmount ? "text-green-600" : "text-red-600"}>
              ${userCredits.toFixed(2)}
            </span>
          </div>
          
          {userCredits < cart.totalAmount && (
            <Alert variant="destructive">
              <AlertDescription>
                No tienes suficientes créditos. Necesitas ${(cart.totalAmount - userCredits).toFixed(2)} más.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span className="text-lg text-green-600">
              ${cart.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={checkingOut || userCredits < cart.totalAmount}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {checkingOut ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar con Créditos
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}