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
import { Loader2, Users, Settings, Shield, Search, RefreshCw, UserCheck, UserX, Crown, FileText, Clock } from "lucide-react";
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

interface AuditLog {
  id: string;
  performed_by: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  performer_name?: string;
  target_name?: string;
}

interface SiteSettings {
  site_name: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  auto_activate_users: boolean;
  email_notifications: boolean;
  maintenance_mode: boolean;
}

const AdminPanel = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "",
    site_email: "",
    site_phone: "",
    site_address: "",
    auto_activate_users: true,
    email_notifications: false,
    maintenance_mode: false,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (userRole !== "superadmin") {
        toast.error("Bu sayfaya erişim yetkiniz yok!");
        navigate("/");
      } else {
        fetchUsers();
        fetchAuditLogs();
        fetchSettings();
      }
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value || "";
      });

      setSettings({
        site_name: settingsMap.site_name || "",
        site_email: settingsMap.site_email || "",
        site_phone: settingsMap.site_phone || "",
        site_address: settingsMap.site_address || "",
        auto_activate_users: settingsMap.auto_activate_users === "true",
        email_notifications: settingsMap.email_notifications === "true",
        maintenance_mode: settingsMap.maintenance_mode === "true",
      });
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
      toast.error("Ayarlar yüklenemedi");
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const updates = [
        { key: "site_name", value: settings.site_name },
        { key: "site_email", value: settings.site_email },
        { key: "site_phone", value: settings.site_phone },
        { key: "site_address", value: settings.site_address },
        { key: "auto_activate_users", value: String(settings.auto_activate_users) },
        { key: "email_notifications", value: String(settings.email_notifications) },
        { key: "maintenance_mode", value: String(settings.maintenance_mode) },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: update.value })
          .eq("key", update.key);

        if (error) throw error;
      }

      // Log the settings change
      await supabase.from("audit_logs").insert([{
        performed_by: user?.id,
        action: "settings_update",
        details: JSON.parse(JSON.stringify({ settings })),
      }]);

      toast.success("Ayarlar başarıyla kaydedildi");
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      toast.error("Ayarlar kaydedilemedi");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLogsLoading(true);
    try {
      const { data: logs, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Fetch profiles for performer and target names
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name");

      const profileMap: Record<string, string> = {};
      profiles?.forEach((p) => {
        profileMap[p.user_id] = p.full_name || "İsimsiz";
      });

      const logsWithNames: AuditLog[] = (logs || []).map((log) => ({
        ...log,
        details: log.details as Record<string, unknown> | null,
        performer_name: profileMap[log.performed_by] || "Bilinmiyor",
        target_name: log.target_user_id ? profileMap[log.target_user_id] || "Bilinmiyor" : null,
      }));

      setAuditLogs(logsWithNames);
    } catch (error) {
      console.error("Audit logları yüklenirken hata:", error);
      toast.error("Audit logları yüklenemedi");
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

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
          is_approved: userRoleData?.role !== "user",
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
      const oldRole = userRecord?.role;

      if (userRecord?.role_id) {
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("id", userRecord.role_id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole, assigned_by: user?.id });

        if (error) throw error;
      }

      // Log the role change
      await supabase.from("audit_logs").insert([{
        performed_by: user?.id,
        action: "role_change",
        target_user_id: userId,
        details: {
          old_role: oldRole,
          new_role: newRole,
          user_name: userRecord?.full_name,
        },
      }]);

      toast.success(`Kullanıcı rolü "${newRole}" olarak güncellendi`);
      fetchUsers();
      fetchAuditLogs();
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

  const getActionLabel = (action: string) => {
    switch (action) {
      case "role_change":
        return "Rol Değişikliği";
      case "settings_update":
        return "Ayar Güncelleme";
      default:
        return action;
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (userRole !== "superadmin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-400" />
            Yönetim Paneli
          </h1>
          <p className="text-slate-400 mt-2">
            Sistem ayarları ve kullanıcı yönetimi
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] bg-slate-800 border border-slate-700">
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
              <Users className="h-4 w-4" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
              <FileText className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
              <Settings className="h-4 w-4" />
              Site Ayarları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>Kayıtlı Kullanıcılar</span>
                  <Button variant="outline" size="sm" onClick={fetchUsers} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                  </Button>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Tüm kayıtlı kullanıcıları görüntüleyin ve rollerini yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="İsim veya telefon ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Rol filtrele" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all" className="text-white hover:bg-slate-600">Tüm Roller</SelectItem>
                      <SelectItem value="superadmin" className="text-white hover:bg-slate-600">Süper Admin</SelectItem>
                      <SelectItem value="admin" className="text-white hover:bg-slate-600">Yönetici</SelectItem>
                      <SelectItem value="dealer" className="text-white hover:bg-slate-600">Bayi</SelectItem>
                      <SelectItem value="user" className="text-white hover:bg-slate-600">Kullanıcı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-700">
                      <TableRow className="hover:bg-slate-700 border-slate-600">
                        <TableHead className="text-slate-300">Kullanıcı</TableHead>
                        <TableHead className="text-slate-300">Telefon</TableHead>
                        <TableHead className="text-slate-300">Kayıt Tarihi</TableHead>
                        <TableHead className="text-slate-300">Mevcut Rol</TableHead>
                        <TableHead className="text-slate-300">Rol Değiştir</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow className="hover:bg-slate-700 border-slate-600">
                          <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                            Kullanıcı bulunamadı
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((u) => (
                          <TableRow key={u.id} className="hover:bg-slate-700 border-slate-600">
                            <TableCell className="font-medium text-white">
                              {u.full_name || "İsimsiz"}
                            </TableCell>
                            <TableCell className="text-slate-300">{u.phone || "-"}</TableCell>
                            <TableCell className="text-slate-300">
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
                                <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                                  {updating === u.user_id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="user" className="text-white hover:bg-slate-600">Kullanıcı</SelectItem>
                                  <SelectItem value="dealer" className="text-white hover:bg-slate-600">Bayi</SelectItem>
                                  <SelectItem value="admin" className="text-white hover:bg-slate-600">Yönetici</SelectItem>
                                  <SelectItem value="superadmin" className="text-white hover:bg-slate-600">Süper Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-white">{users.length}</div>
                      <p className="text-xs text-slate-400">Toplam Kullanıcı</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-400">
                        {users.filter((u) => u.role === "admin" || u.role === "superadmin").length}
                      </div>
                      <p className="text-xs text-slate-400">Yönetici</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-400">
                        {users.filter((u) => u.role === "dealer").length}
                      </div>
                      <p className="text-xs text-slate-400">Bayi</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-amber-400">
                        {users.filter((u) => u.role === "user").length}
                      </div>
                      <p className="text-xs text-slate-400">Onay Bekleyen</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Audit Log
                  </span>
                  <Button variant="outline" size="sm" onClick={fetchAuditLogs} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                  </Button>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Sistemde yapılan kritik işlemlerin kaydı
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="rounded-md border border-slate-700 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-700">
                        <TableRow className="hover:bg-slate-700 border-slate-600">
                          <TableHead className="text-slate-300">Tarih</TableHead>
                          <TableHead className="text-slate-300">İşlem</TableHead>
                          <TableHead className="text-slate-300">İşlemi Yapan</TableHead>
                          <TableHead className="text-slate-300">Hedef Kullanıcı</TableHead>
                          <TableHead className="text-slate-300">Detaylar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditLogs.length === 0 ? (
                          <TableRow className="hover:bg-slate-700 border-slate-600">
                            <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                              Henüz kayıt yok
                            </TableCell>
                          </TableRow>
                        ) : (
                          auditLogs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-slate-700 border-slate-600">
                              <TableCell className="text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-slate-500" />
                                  {new Date(log.created_at).toLocaleString("tr-TR")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                                  {getActionLabel(log.action)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white font-medium">
                                {log.performer_name}
                              </TableCell>
                              <TableCell className="text-slate-300">
                                {log.target_name || "-"}
                              </TableCell>
                              <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">
                                {log.details ? (
                                  log.action === "role_change" ? (
                                    <span>
                                      {(log.details as { old_role?: string }).old_role} → {(log.details as { new_role?: string }).new_role}
                                    </span>
                                  ) : (
                                    "Ayarlar güncellendi"
                                  )
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Site Ayarları</CardTitle>
                <CardDescription className="text-slate-400">
                  Genel site ayarlarını buradan yönetebilirsiniz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="site-name" className="text-slate-300">Site Adı</Label>
                        <Input
                          id="site-name"
                          value={settings.site_name}
                          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-email" className="text-slate-300">İletişim E-posta</Label>
                        <Input
                          id="site-email"
                          type="email"
                          value={settings.site_email}
                          onChange={(e) => setSettings({ ...settings, site_email: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-phone" className="text-slate-300">İletişim Telefon</Label>
                        <Input
                          id="site-phone"
                          value={settings.site_phone}
                          onChange={(e) => setSettings({ ...settings, site_phone: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-address" className="text-slate-300">Adres</Label>
                        <Input
                          id="site-address"
                          value={settings.site_address}
                          onChange={(e) => setSettings({ ...settings, site_address: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-lg font-medium mb-4 text-white">Sistem Özellikleri</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="space-y-0.5">
                            <Label className="text-white">Yeni Kayıtları Aktifleştir</Label>
                            <p className="text-sm text-slate-400">
                              Yeni kullanıcılar otomatik olarak aktif edilsin
                            </p>
                          </div>
                          <Switch
                            checked={settings.auto_activate_users}
                            onCheckedChange={(checked) =>
                              setSettings({ ...settings, auto_activate_users: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="space-y-0.5">
                            <Label className="text-white">E-posta Bildirimleri</Label>
                            <p className="text-sm text-slate-400">
                              Yeni kayıtlarda e-posta bildirimi gönder
                            </p>
                          </div>
                          <Switch
                            checked={settings.email_notifications}
                            onCheckedChange={(checked) =>
                              setSettings({ ...settings, email_notifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                          <div className="space-y-0.5">
                            <Label className="text-white">Bakım Modu</Label>
                            <p className="text-sm text-slate-400">
                              Siteyi bakım moduna al (sadece adminler görebilir)
                            </p>
                          </div>
                          <Switch
                            checked={settings.maintenance_mode}
                            onCheckedChange={(checked) =>
                              setSettings({ ...settings, maintenance_mode: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={saveSettings}
                        disabled={savingSettings}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {savingSettings ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Kaydediliyor...
                          </>
                        ) : (
                          "Değişiklikleri Kaydet"
                        )}
                      </Button>
                    </div>
                  </>
                )}
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