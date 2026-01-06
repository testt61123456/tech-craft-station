import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Users, Settings, Shield, Search, RefreshCw, UserCheck, UserX, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AppRole = 'superadmin' | 'admin' | 'user' | 'dealer';

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  email?: string;
  role: AppRole;
  role_id?: string;
  is_approved: boolean;
}

const AdminPanel = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (userRole !== "superadmin") {
        toast.error("Bu sayfaya erişim yetkiniz yok!");
        navigate("/");
      } else {
        fetchUsers();
      }
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRoleData = roles?.find((r) => r.user_id === profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          phone: profile.phone,
          created_at: profile.created_at,
          role: (userRoleData?.role as AppRole) || "user",
          role_id: userRoleData?.id,
          is_approved: userRoleData?.role !== "user", // user rolü onaysız kabul edilir
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      toast.error("Kullanıcılar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    setUpdating(userId);
    try {
      const userRecord = users.find((u) => u.user_id === userId);
      
      if (userRecord?.role_id) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("id", userRecord.role_id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole, assigned_by: user?.id });

        if (error) throw error;
      }

      toast.success(`Kullanıcı rolü "${newRole}" olarak güncellendi`);
      fetchUsers();
    } catch (error) {
      console.error("Rol güncellenirken hata:", error);
      toast.error("Rol güncellenemedi");
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "superadmin":
        return "default";
      case "admin":
        return "secondary";
      case "dealer":
        return "outline";
      default:
        return "destructive";
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "superadmin":
        return <Crown className="h-3 w-3 mr-1" />;
      case "admin":
        return <Shield className="h-3 w-3 mr-1" />;
      case "dealer":
        return <UserCheck className="h-3 w-3 mr-1" />;
      default:
        return <UserX className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case "superadmin":
        return "Süper Admin";
      case "admin":
        return "Yönetici";
      case "dealer":
        return "Bayi";
      default:
        return "Kullanıcı";
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole !== "superadmin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Yönetim Paneli
          </h1>
          <p className="text-muted-foreground mt-2">
            Sistem ayarları ve kullanıcı yönetimi
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Site Ayarları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Kayıtlı Kullanıcılar</span>
                  <Button variant="outline" size="sm" onClick={fetchUsers}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                  </Button>
                </CardTitle>
                <CardDescription>
                  Tüm kayıtlı kullanıcıları görüntüleyin ve rollerini yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="İsim veya telefon ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Rol filtrele" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Roller</SelectItem>
                      <SelectItem value="superadmin">Süper Admin</SelectItem>
                      <SelectItem value="admin">Yönetici</SelectItem>
                      <SelectItem value="dealer">Bayi</SelectItem>
                      <SelectItem value="user">Kullanıcı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kullanıcı</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Kayıt Tarihi</TableHead>
                        <TableHead>Mevcut Rol</TableHead>
                        <TableHead>Rol Değiştir</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Kullanıcı bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">
                              {u.full_name || "İsimsiz"}
                            </TableCell>
                            <TableCell>{u.phone || "-"}</TableCell>
                            <TableCell>
                              {new Date(u.created_at).toLocaleDateString("tr-TR")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getRoleBadgeVariant(u.role)}
                                className="flex items-center w-fit"
                              >
                                {getRoleIcon(u.role)}
                                {getRoleLabel(u.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={u.role}
                                onValueChange={(value: AppRole) =>
                                  updateUserRole(u.user_id, value)
                                }
                                disabled={updating === u.user_id}
                              >
                                <SelectTrigger className="w-[140px]">
                                  {updating === u.user_id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Kullanıcı</SelectItem>
                                  <SelectItem value="dealer">Bayi</SelectItem>
                                  <SelectItem value="admin">Yönetici</SelectItem>
                                  <SelectItem value="superadmin">Süper Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{users.length}</div>
                      <p className="text-xs text-muted-foreground">Toplam Kullanıcı</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {users.filter((u) => u.role === "admin" || u.role === "superadmin").length}
                      </div>
                      <p className="text-xs text-muted-foreground">Yönetici</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {users.filter((u) => u.role === "dealer").length}
                      </div>
                      <p className="text-xs text-muted-foreground">Bayi</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">
                        {users.filter((u) => u.role === "user").length}
                      </div>
                      <p className="text-xs text-muted-foreground">Onay Bekleyen</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Ayarları</CardTitle>
                <CardDescription>
                  Genel site ayarlarını buradan yönetebilirsiniz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Adı</Label>
                    <Input id="site-name" defaultValue="Karadeniz Teknik" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-email">İletişim E-posta</Label>
                    <Input id="site-email" type="email" defaultValue="info@karadenizteknik.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-phone">İletişim Telefon</Label>
                    <Input id="site-phone" defaultValue="+90 555 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-address">Adres</Label>
                    <Input id="site-address" defaultValue="Trabzon, Türkiye" />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Sistem Özellikleri</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Yeni Kayıtları Aktifleştir</Label>
                        <p className="text-sm text-muted-foreground">
                          Yeni kullanıcılar otomatik olarak aktif edilsin
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>E-posta Bildirimleri</Label>
                        <p className="text-sm text-muted-foreground">
                          Yeni kayıtlarda e-posta bildirimi gönder
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Bakım Modu</Label>
                        <p className="text-sm text-muted-foreground">
                          Siteyi bakım moduna al (sadece adminler görebilir)
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => toast.success("Ayarlar kaydedildi")}>
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
