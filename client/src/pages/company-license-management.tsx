import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Users, 
  UserPlus, 
  UserMinus, 
  RefreshCw, 
  Download, 
  Upload, 
  Search, 
  Filter,
  MoreHorizontal,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  BarChart3
} from "lucide-react";
import { Helmet } from "react-helmet";

interface License {
  id: string;
  licenseKey: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
  assignedUserId?: string;
  assignedUserEmail?: string;
  assignedUserName?: string;
  assignedAt?: string;
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
}

interface LicenseUsage {
  id: string;
  licenseId: string;
  userId: string;
  userEmail: string;
  activity: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export default function CompanyLicenseManagement() {
  const { toast } = useToast();
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("ALL");
  const [bulkEmailList, setBulkEmailList] = useState("");
  const [newLicenseCount, setNewLicenseCount] = useState(1);

  // Fetch license data
  const { data: licenses = [], isLoading: licensesLoading } = useQuery({
    queryKey: ["/api/company/licenses"],
  });

  const { data: licenseStats } = useQuery({
    queryKey: ["/api/company/license-stats"],
  });

  const { data: licenseUsage = [], isLoading: usageLoading } = useQuery({
    queryKey: ["/api/company/license-usage"],
  });

  const { data: availableUsers = [] } = useQuery({
    queryKey: ["/api/company/available-users"],
  });

  // Mutations for license management
  const createLicensesMutation = useMutation({
    mutationFn: async (count: number) => {
      const res = await apiRequest("POST", "/api/company/licenses/create", { quantity: count });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/license-stats"] });
      toast({ title: "Licenses created successfully" });
      setNewLicenseCount(1);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create licenses", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const assignLicenseMutation = useMutation({
    mutationFn: async ({ licenseId, userEmail }: { licenseId: string; userEmail: string }) => {
      const res = await apiRequest("POST", "/api/company/licenses/assign", { licenseId, userEmail });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/license-stats"] });
      toast({ title: "License assigned successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to assign license", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const revokeLicenseMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      const res = await apiRequest("POST", "/api/company/licenses/revoke", { licenseId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/license-stats"] });
      toast({ title: "License revoked successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to revoke license", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const bulkAssignMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      const res = await apiRequest("POST", "/api/company/licenses/bulk-assign", { emails });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/license-stats"] });
      toast({ title: "Bulk assignment completed successfully" });
      setBulkEmailList("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Bulk assignment failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const suspendLicenseMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      const res = await apiRequest("POST", "/api/company/licenses/suspend", { licenseId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/license-stats"] });
      toast({ title: "License suspended successfully" });
    },
  });

  const reactivateLicenseMutation = useMutation({
    mutationFn: async (licenseId: string) => {
      const res = await apiRequest("POST", "/api/company/licenses/reactivate", { licenseId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company/license-stats"] });
      toast({ title: "License reactivated successfully" });
    },
  });

  // Filter licenses based on search and filters
  const filteredLicenses = licenses.filter((license: License) => {
    const matchesSearch = !searchQuery || 
      license.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.assignedUserEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.assignedUserName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || license.status === statusFilter;
    const matchesAssignment = assignmentFilter === "ALL" || 
      (assignmentFilter === "ASSIGNED" && license.assignedUserId) ||
      (assignmentFilter === "UNASSIGNED" && !license.assignedUserId);
    
    return matchesSearch && matchesStatus && matchesAssignment;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      SUSPENDED: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      EXPIRED: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      REVOKED: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const handleBulkAssign = () => {
    const emails = bulkEmailList.split('\n').map(email => email.trim()).filter(email => email);
    if (emails.length === 0) {
      toast({ title: "Please enter email addresses", variant: "destructive" });
      return;
    }
    bulkAssignMutation.mutate(emails);
  };

  const exportLicenses = () => {
    const csvContent = [
      ['License Key', 'Status', 'Assigned User', 'Email', 'Assigned Date', 'Last Used', 'Usage Count'].join(','),
      ...filteredLicenses.map((license: License) => [
        license.licenseKey,
        license.status,
        license.assignedUserName || '',
        license.assignedUserEmail || '',
        license.assignedAt || '',
        license.lastUsed || '',
        license.usageCount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `licenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>License Management | M4T Enterprise</title>
        <meta name="description" content="Comprehensive enterprise license management for your organization" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">License Management</h1>
            <p className="text-gray-600 mt-2">Manage licenses, assignments, and usage for your organization</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportLicenses}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Licenses
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Licenses</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="licenseCount">Number of licenses to create</Label>
                    <Input
                      id="licenseCount"
                      type="number"
                      min="1"
                      max="1000"
                      value={newLicenseCount}
                      onChange={(e) => setNewLicenseCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button 
                    onClick={() => createLicensesMutation.mutate(newLicenseCount)}
                    disabled={createLicensesMutation.isPending}
                    className="w-full"
                  >
                    {createLicensesMutation.isPending && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    Create Licenses
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* License Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                  <p className="text-2xl font-bold">{licenseStats?.total || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Licenses</p>
                  <p className="text-2xl font-bold text-green-600">{licenseStats?.active || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-blue-600">{licenseStats?.available || 0}</p>
                </div>
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization</p>
                  <p className="text-2xl font-bold">{licenseStats?.utilizationRate || 0}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="licenses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="licenses">License Management</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="licenses" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by license key, user email, or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                      <SelectItem value="REVOKED">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Licenses</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* License Table */}
            <Card>
              <CardHeader>
                <CardTitle>Licenses ({filteredLicenses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned User</TableHead>
                      <TableHead>Assignment Date</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLicenses.map((license: License) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-mono text-sm">{license.licenseKey}</TableCell>
                        <TableCell>{getStatusBadge(license.status)}</TableCell>
                        <TableCell>
                          {license.assignedUserEmail ? (
                            <div>
                              <div className="font-medium">{license.assignedUserName}</div>
                              <div className="text-sm text-gray-500">{license.assignedUserEmail}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {license.assignedAt ? new Date(license.assignedAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {license.lastUsed ? new Date(license.lastUsed).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>{license.usageCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!license.assignedUserId && license.status === 'ACTIVE' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Assign License</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Label>Select User</Label>
                                    <Select onValueChange={(email) => assignLicenseMutation.mutate({ licenseId: license.id, userEmail: email })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose user..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableUsers.map((user: any) => (
                                          <SelectItem key={user.id} value={user.email}>
                                            {user.name} ({user.email})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            
                            {license.assignedUserId && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <UserMinus className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Revoke License</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will revoke the license from {license.assignedUserEmail}. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => revokeLicenseMutation.mutate(license.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Revoke License
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            
                            {license.status === 'ACTIVE' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => suspendLicenseMutation.mutate(license.id)}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {license.status === 'SUSPENDED' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => reactivateLicenseMutation.mutate(license.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk License Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emailList">Email Addresses (one per line)</Label>
                  <Textarea
                    id="emailList"
                    placeholder="user1@company.com&#10;user2@company.com&#10;user3@company.com"
                    value={bulkEmailList}
                    onChange={(e) => setBulkEmailList(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button 
                  onClick={handleBulkAssign}
                  disabled={bulkAssignMutation.isPending || !bulkEmailList.trim()}
                  className="w-full"
                >
                  {bulkAssignMutation.isPending && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                  <Mail className="h-4 w-4 mr-2" />
                  Assign Licenses to Users
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>License Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>License Key</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenseUsage.map((usage: LicenseUsage) => (
                      <TableRow key={usage.id}>
                        <TableCell>{usage.userEmail}</TableCell>
                        <TableCell className="font-mono text-sm">{usage.licenseId}</TableCell>
                        <TableCell>{usage.activity}</TableCell>
                        <TableCell>{new Date(usage.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{usage.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}