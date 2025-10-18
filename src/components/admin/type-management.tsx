'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Eye, EyeOff, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface StreamingType {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    accounts: number;
  };
}

export default function TypeManagement() {
  const [types, setTypes] = useState<StreamingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<StreamingType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#10b981',
    active: true
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/admin/streaming-types');
      if (response.ok) {
        const data = await response.json();
        setTypes(data);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
      toast.error('Error al cargar tipos de streaming');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: StreamingType) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      icon: type.icon || '',
      color: type.color || '#10b981',
      active: type.active
    });
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#10b981',
      active: true
    });
    setCreateDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedType) return;

    try {
      const response = await fetch(`/api/admin/streaming-types/${selectedType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Tipo de streaming actualizado exitosamente');
        setEditDialogOpen(false);
        setSelectedType(null);
        fetchTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar tipo de streaming');
      }
    } catch (error) {
      console.error('Error updating type:', error);
      toast.error('Error al actualizar tipo de streaming');
    }
  };

  const handleCreateType = async () => {
    try {
      const response = await fetch('/api/admin/streaming-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Tipo de streaming creado exitosamente');
        setCreateDialogOpen(false);
        fetchTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al crear tipo de streaming');
      }
    } catch (error) {
      console.error('Error creating type:', error);
      toast.error('Error al crear tipo de streaming');
    }
  };

  const handleDelete = async (typeId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tipo de streaming?')) return;

    try {
      const response = await fetch(`/api/admin/streaming-types/${typeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Tipo de streaming eliminado exitosamente');
        fetchTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar tipo de streaming');
      }
    } catch (error) {
      console.error('Error deleting type:', error);
      toast.error('Error al eliminar tipo de streaming');
    }
  };

  const toggleTypeStatus = async (type: StreamingType) => {
    try {
      const response = await fetch(`/api/admin/streaming-types/${type.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...type, active: !type.active }),
      });

      if (response.ok) {
        toast.success(`Tipo de streaming ${!type.active ? 'activado' : 'desactivado'} exitosamente`);
        fetchTypes();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al cambiar estado del tipo');
      }
    } catch (error) {
      console.error('Error toggling type status:', error);
      toast.error('Error al cambiar estado del tipo');
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Tipos de Streaming</h2>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tipos</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{types.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {types.filter(t => t.active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {types.filter(t => !t.active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Streaming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Icono</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Cuentas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {type.description || 'Sin descripción'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {type.icon ? (
                        <span className="text-lg">{type.icon}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {type.color ? (
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: type.color }}
                          ></div>
                          <span className="text-sm">{type.color}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{type._count.accounts}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={type.active ? "default" : "secondary"}>
                        {type.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTypeStatus(type)}
                        >
                          {type.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(type)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(type.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={type._count.accounts > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo de Streaming</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Netflix, Disney+, etc."
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del servicio"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icono (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🎬, 🎮, 📺, etc."
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#10b981"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Tipo activo</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>
                Actualizar Tipo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Tipo de Streaming</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-name">Nombre</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Netflix, Disney+, etc."
              />
            </div>
            <div>
              <Label htmlFor="create-description">Descripción</Label>
              <Input
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del servicio"
              />
            </div>
            <div>
              <Label htmlFor="create-icon">Icono (emoji)</Label>
              <Input
                id="create-icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🎬, 🎮, 📺, etc."
              />
            </div>
            <div>
              <Label htmlFor="create-color">Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="create-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#10b981"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="create-active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="create-active">Tipo activo</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateType} className="bg-green-600 hover:bg-green-700">
                Crear Tipo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}