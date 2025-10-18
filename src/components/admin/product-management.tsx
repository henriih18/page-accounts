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
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

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
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<StreamingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StreamingAccount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: '',
    duration: '',
    quality: '',
    screens: '',
    active: true,
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/streaming-accounts');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: StreamingAccount) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      type: product.type,
      duration: product.duration,
      quality: product.quality,
      screens: product.screens.toString(),
      active: product.active,
      image: product.image || ''
    });
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      type: '',
      duration: '',
      quality: '',
      screens: '',
      active: true,
      image: ''
    });
    setCreateDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/admin/streaming-accounts/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Producto actualizado exitosamente');
        setEditDialogOpen(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar producto');
    }
  };

  const handleCreateProduct = async () => {
    try {
      const response = await fetch('/api/admin/streaming-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Producto creado exitosamente');
        setCreateDialogOpen(false);
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al crear producto');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error al crear producto');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/admin/streaming-accounts/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Producto eliminado exitosamente');
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const toggleProductStatus = async (product: StreamingAccount) => {
    try {
      const response = await fetch(`/api/admin/streaming-accounts/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...product, active: !product.active }),
      });

      if (response.ok) {
        toast.success(`Producto ${!product.active ? 'activado' : 'desactivado'} exitosamente`);
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al cambiar estado del producto');
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Error al cambiar estado del producto');
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
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => !p.active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Calidad</TableHead>
                  <TableHead>Pantallas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.duration}</TableCell>
                    <TableCell>{product.quality}</TableCell>
                    <TableCell>{product.screens}</TableCell>
                    <TableCell>
                      <Badge variant={product.active ? "default" : "secondary"}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleProductStatus(product)}
                        >
                          {product.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Netflix">Netflix</SelectItem>
                  <SelectItem value="Disney+">Disney+</SelectItem>
                  <SelectItem value="HBO Max">HBO Max</SelectItem>
                  <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
                  <SelectItem value="Hulu">Hulu</SelectItem>
                  <SelectItem value="Paramount+">Paramount+</SelectItem>
                  <SelectItem value="Apple TV+">Apple TV+</SelectItem>
                  <SelectItem value="Star+">Star+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duración</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 mes">1 mes</SelectItem>
                  <SelectItem value="3 meses">3 meses</SelectItem>
                  <SelectItem value="6 meses">6 meses</SelectItem>
                  <SelectItem value="1 año">1 año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quality">Calidad</Label>
              <Select
                value={formData.quality}
                onValueChange={(value) => setFormData({ ...formData, quality: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HD">HD</SelectItem>
                  <SelectItem value="Full HD">Full HD</SelectItem>
                  <SelectItem value="4K">4K</SelectItem>
                  <SelectItem value="8K">8K</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="screens">Pantallas</Label>
              <Input
                id="screens"
                type="number"
                value={formData.screens}
                onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Producto activo</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>
              Actualizar Producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create-name">Nombre</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="create-type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Netflix">Netflix</SelectItem>
                  <SelectItem value="Disney+">Disney+</SelectItem>
                  <SelectItem value="HBO Max">HBO Max</SelectItem>
                  <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
                  <SelectItem value="Hulu">Hulu</SelectItem>
                  <SelectItem value="Paramount+">Paramount+</SelectItem>
                  <SelectItem value="Apple TV+">Apple TV+</SelectItem>
                  <SelectItem value="Star+">Star+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create-price">Precio</Label>
              <Input
                id="create-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="create-duration">Duración</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 mes">1 mes</SelectItem>
                  <SelectItem value="3 meses">3 meses</SelectItem>
                  <SelectItem value="6 meses">6 meses</SelectItem>
                  <SelectItem value="1 año">1 año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create-quality">Calidad</Label>
              <Select
                value={formData.quality}
                onValueChange={(value) => setFormData({ ...formData, quality: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HD">HD</SelectItem>
                  <SelectItem value="Full HD">Full HD</SelectItem>
                  <SelectItem value="4K">4K</SelectItem>
                  <SelectItem value="8K">8K</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="create-screens">Pantallas</Label>
              <Input
                id="create-screens"
                type="number"
                value={formData.screens}
                onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="create-description">Descripción</Label>
              <Input
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="create-image">URL de Imagen</Label>
              <Input
                id="create-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="create-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="create-active">Producto activo</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
              Crear Producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}