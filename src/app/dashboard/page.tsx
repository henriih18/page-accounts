"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Calendar, ShoppingBag, LogOut, Settings, CreditCard, Package } from "lucide-react";
import { toast } from "sonner";
import { UserOrders } from "@/components/user-orders";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success("Perfil actualizado exitosamente");
        setIsEditing(false);
      } else {
        toast.error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  const handleChangePassword = () => {
    toast.info("Función de cambiar contraseña próximamente");
  };

  const handle2FA = () => {
    toast.info("Autenticación de dos factores próximamente");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      toast.info("Función de eliminar cuenta próximamente");
    }
  };

  const handleNotificationChange = (type: string) => {
    toast.info(`Preferencias de ${type} actualizadas`);
  };

  const mockOrders = [
    {
      id: "1",
      service: "Netflix Premium",
      status: "active",
      purchaseDate: "2024-01-15",
      expiryDate: "2024-02-15",
      price: 9.99,
    },
    {
      id: "2",
      service: "Disney+ Premium",
      status: "expired",
      purchaseDate: "2023-12-01",
      expiryDate: "2024-01-01",
      price: 7.99,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-green-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Mi Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")}>
                Inicio
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-2xl">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {session.user.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {session.user.email}
                  </CardDescription>
                  <Badge 
                    variant={session.user.role === "ADMIN" ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {session.user.role === "ADMIN" ? "Administrador" : "Usuario"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde: Enero 2024</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Compras: {mockOrders.length}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                      <CreditCard className="w-4 h-4" />
                      <span>Método de pago: No configurado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="orders">Mis Compras</TabsTrigger>
                  <TabsTrigger value="settings">Configuración</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>Información Personal</span>
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          {isEditing ? "Cancelar" : "Editar"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            disabled={!isEditing}
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                            Guardar cambios
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <UserOrders />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="w-5 h-5" />
                        <span>Configuración de la cuenta</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Preferencias de notificación
                        </h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              defaultChecked 
                              onChange={() => handleNotificationChange("correo electrónico")}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Notificaciones por correo electrónico
                            </span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              defaultChecked 
                              onChange={() => handleNotificationChange("recordatorios")}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Recordatorios de expiración
                            </span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              onChange={() => handleNotificationChange("promociones")}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Promociones y ofertas especiales
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Seguridad
                        </h4>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
                            Cambiar contraseña
                          </Button>
                          <Button variant="outline" className="w-full justify-start" onClick={handle2FA}>
                            Autenticación de dos factores
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                          Eliminar cuenta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
  );
}