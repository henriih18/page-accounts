'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Users, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  email: string;
  credits: number;
  createdAt: string;
  _count: {
    orders: number;
    creditRecharges: number;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rechargeForm, setRechargeForm] = useState({
    amount: '',
    method: 'Administración',
    reference: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!selectedUser || !rechargeForm.amount || parseFloat(rechargeForm.amount) <= 0) {
      toast.error('Por favor ingrese un monto válido');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseFloat(rechargeForm.amount),
          method: rechargeForm.method,
          reference: rechargeForm.reference
        }),
      });

      if (response.ok) {
        toast.success('Créditos recargados exitosamente');
        setRechargeDialogOpen(false);
        setRechargeForm({ amount: '', method: 'Administración', reference: '' });
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al recargar créditos');
      }
    } catch (error) {
      console.error('Error recharging credits:', error);
      toast.error('Error al recargar créditos');
    }
  };

  const openRechargeDialog = (user: User) => {
    setSelectedUser(user);
    setRechargeDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Créditos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${users.reduce((sum, user) => sum + user.credits, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user._count.orders, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recargas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user._count.creditRecharges, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Recargas</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || 'Sin nombre'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.credits > 0 ? "default" : "secondary"}>
                        ${user.credits.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user._count.orders}</TableCell>
                    <TableCell>{user._count.creditRecharges}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => openRechargeDialog(user)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Recargar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recargar Créditos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Usuario</Label>
              <Input
                value={selectedUser ? `${selectedUser.name || 'Sin nombre'} (${selectedUser.email})` : ''}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="amount">Monto a recargar ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={rechargeForm.amount}
                onChange={(e) => setRechargeForm({ ...rechargeForm, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="method">Método de pago</Label>
              <Select
                value={rechargeForm.method}
                onValueChange={(value) => setRechargeForm({ ...rechargeForm, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administración">Administración</SelectItem>
                  <SelectItem value="Transferencia">Transferencia bancaria</SelectItem>
                  <SelectItem value="Billetera digital">Billetera digital</SelectItem>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reference">Referencia (opcional)</Label>
              <Input
                id="reference"
                placeholder="Número de referencia, comprobante, etc."
                value={rechargeForm.reference}
                onChange={(e) => setRechargeForm({ ...rechargeForm, reference: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setRechargeDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleRecharge} className="bg-green-600 hover:bg-green-700">
                Recargar Créditos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}