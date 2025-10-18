"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Edit, Trash2, Eye, EyeOff, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface AccountProfile {
  id: string;
  streamingAccountId: string;
  profileName: string;
  profilePin?: string;
  isAvailable: boolean;
  soldToUserId?: string;
  soldAt?: string;
  createdAt: string;
  streamingAccount: {
    name: string;
    type: string;
  };
  soldToUser?: {
    name: string;
    email: string;
  };
}

interface StreamingAccount {
  id: string;
  name: string;
  type: string;
  saleType: "FULL" | "PROFILES";
}

export function ProfileManagement() {
  const [profiles, setProfiles] = useState<AccountProfile[]>([]);
  const [accounts, setAccounts] = useState<StreamingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profilePin, setProfilePin] = useState("");
  const [editingProfile, setEditingProfile] = useState<AccountProfile | null>(null);

  useEffect(() => {
    fetchProfiles();
    fetchAccounts();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/admin/profiles");
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Error al cargar perfiles");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/streaming-accounts");
      if (response.ok) {
        const data = await response.json();
        // Filter accounts that sell by profiles
        setAccounts(data.filter((account: StreamingAccount) => account.saleType === "PROFILES"));
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleAddProfile = async () => {
    if (!selectedAccount || !profileName) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    try {
      const response = await fetch("/api/admin/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streamingAccountId: selectedAccount,
          profileName,
          profilePin: profilePin || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Perfil creado exitosamente");
        setShowAddDialog(false);
        setSelectedAccount("");
        setProfileName("");
        setProfilePin("");
        fetchProfiles();
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al crear perfil");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error al crear perfil");
    }
  };

  const handleUpdateProfile = async (profileId: string, updates: Partial<AccountProfile>) => {
    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success("Perfil actualizado exitosamente");
        setEditingProfile(null);
        fetchProfiles();
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar perfil");
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este perfil?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Perfil eliminado exitosamente");
        fetchProfiles();
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al eliminar perfil");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Error al eliminar perfil");
    }
  };

  const toggleProfileAvailability = async (profile: AccountProfile) => {
    if (!profile.isAvailable) {
      toast.error("No se puede modificar un perfil ya vendido");
      return;
    }

    handleUpdateProfile(profile.id, { isAvailable: !profile.isAvailable });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestión de Perfiles
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Perfiles
            </CardTitle>
            <CardDescription>
              Administra los perfiles disponibles para venta
            </CardDescription>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Perfil</DialogTitle>
                <DialogDescription>
                  Crea un nuevo perfil para una cuenta de streaming
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Cuenta de Streaming</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileName">Nombre del Perfil</Label>
                  <Input
                    id="profileName"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePin">PIN del Perfil (opcional)</Label>
                  <Input
                    id="profilePin"
                    value={profilePin}
                    onChange={(e) => setProfilePin(e.target.value)}
                    placeholder="Ej: 1234"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProfile}>
                  Agregar Perfil
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay perfiles configurados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Comienza agregando perfiles a las cuentas de streaming
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Perfil
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>PIN</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vendido a</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {editingProfile?.id === profile.id ? (
                        <Input
                          value={editingProfile.profileName}
                          onChange={(e) => setEditingProfile({
                            ...editingProfile,
                            profileName: e.target.value
                          })}
                          className="w-32"
                        />
                      ) : (
                        profile.profileName
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium">{profile.streamingAccount.name}</p>
                        <p className="text-sm text-gray-500">{profile.streamingAccount.type}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {editingProfile?.id === profile.id ? (
                        <Input
                          value={editingProfile.profilePin || ""}
                          onChange={(e) => setEditingProfile({
                            ...editingProfile,
                            profilePin: e.target.value
                          })}
                          placeholder="PIN"
                          className="w-20"
                        />
                      ) : (
                        profile.profilePin || "-"
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={profile.isAvailable ? "default" : "secondary"}
                        className={profile.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {profile.isAvailable ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Disponible
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Vendido
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {profile.soldToUser ? (
                        <div>
                          <p className="font-medium">{profile.soldToUser.name}</p>
                          <p className="text-sm text-gray-500">{profile.soldToUser.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">No vendido</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingProfile?.id === profile.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateProfile(profile.id, {
                                profileName: editingProfile.profileName,
                                profilePin: editingProfile.profilePin
                              })}
                            >
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProfile(null)}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProfile(profile)}
                              disabled={!profile.isAvailable}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProfileAvailability(profile)}
                              disabled={!profile.isAvailable}
                            >
                              {profile.isAvailable ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProfile(profile.id)}
                              disabled={!profile.isAvailable}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}