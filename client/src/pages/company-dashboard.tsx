//client/src/pages/company-dashboard.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Key, UserPlus, UserX, CheckCircle2, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface License {
  id: number;
  licenseKey: string;
  companyId: number;
  subscriptionId: number;
  userId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export default function CompanyDashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCreatingLicenses, setIsCreatingLicenses] = useState(false);
  const [licenseQuantity, setLicenseQuantity] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isAssigningLicense, setIsAssigningLicense] = useState(false);

  // Get company ID from the authenticated user
  const companyId = user?.companyId;

  // Fetch company licenses
  const { 
    data: licenses, 
    isLoading: isLoadingLicenses,
    error: licensesError
  } = useQuery({
    queryKey: ['/api/companies', companyId, 'licenses'],
    queryFn: () => 
      fetch(`/api/companies/${companyId}/licenses`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch licenses');
          return res.json();
        })
        .then(data => data.licenses),
    enabled: !!companyId
  });

  // Fetch available (unassigned) licenses
  const { 
    data: availableLicenses, 
    isLoading: isLoadingAvailableLicenses 
  } = useQuery({
    queryKey: ['/api/companies', companyId, 'licenses', 'available'],
    queryFn: () => 
      fetch(`/api/companies/${companyId}/licenses/available`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch available licenses');
          return res.json();
        })
        .then(data => data.licenses),
    enabled: !!companyId
  });

  // Fetch assigned licenses
  const { 
    data: assignedLicenses, 
    isLoading: isLoadingAssignedLicenses 
  } = useQuery({
    queryKey: ['/api/companies', companyId, 'licenses', 'assigned'],
    queryFn: () => 
      fetch(`/api/companies/${companyId}/licenses/assigned`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch assigned licenses');
          return res.json();
        })
        .then(data => data.licenses),
    enabled: !!companyId
  });

  // Fetch company details
  const { 
    data: company, 
    isLoading: isLoadingCompany 
  } = useQuery({
    queryKey: ['/api/companies', companyId],
    queryFn: () => 
      fetch(`/api/companies/${companyId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch company details');
          return res.json();
        }),
    enabled: !!companyId
  });

  // Fetch company subscription details
  const { 
    data: subscription, 
    isLoading: isLoadingSubscription 
  } = useQuery({
    queryKey: ['/api/companies', companyId, 'subscription'],
    queryFn: () => 
      fetch(`/api/companies/${companyId}/subscription`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch subscription details');
          return res.json();
        }),
    enabled: !!companyId
  });

  // Fetch users for license assignment
  const { 
    data: users, 
    isLoading: isLoadingUsers 
  } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => 
      fetch('/api/users')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch users');
          return res.json();
        })
        .then(data => data.users),
  });

  // Create licenses mutation
  const createLicensesMutation = useMutation({
    mutationFn: async (data: { companyId: number; subscriptionId: number; quantity: number }) => {
      const response = await apiRequest('POST', '/api/licenses', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Licenses created successfully",
        description: `${licenseQuantity} new license(s) have been created.`,
      });
      setIsCreatingLicenses(false);
      setLicenseQuantity(1);
      // Invalidate and refetch licenses queries
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses', 'available'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create licenses",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Assign license mutation
  const assignLicenseMutation = useMutation({
    mutationFn: async (data: { licenseId: number; userId: string }) => {
      const response = await apiRequest('POST', '/api/licenses/assign', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "License assigned successfully",
        description: "The license has been assigned to the selected user.",
      });
      setIsAssigningLicense(false);
      setSelectedUserId("");
      // Invalidate and refetch licenses queries
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses', 'assigned'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to assign license",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Revoke license mutation
  const revokeLicenseMutation = useMutation({
    mutationFn: async (licenseId: number) => {
      const response = await apiRequest('POST', `/api/licenses/${licenseId}/revoke`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "License revoked successfully",
        description: "The license has been revoked from the user.",
      });
      // Invalidate and refetch licenses queries
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', companyId, 'licenses', 'assigned'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to revoke license",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Handle license creation
  const handleCreateLicenses = () => {
    if (!companyId || !subscription?.id) {
      toast({
        title: "Cannot create licenses",
        description: "Missing company or subscription information",
        variant: "destructive",
      });
      return;
    }
    
    createLicensesMutation.mutate({
      companyId,
      subscriptionId: subscription.id,
      quantity: licenseQuantity
    });
  };

  // Handle license assignment
  const handleAssignLicense = (licenseId: number) => {
    if (!selectedUserId) {
      toast({
        title: "Cannot assign license",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }
    
    assignLicenseMutation.mutate({
      licenseId,
      userId: selectedUserId
    });
  };

  // Handle license revocation
  const handleRevokeLicense = (licenseId: number) => {
    revokeLicenseMutation.mutate(licenseId);
  };

  // Get license status badge
  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "ASSIGNED":
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-yellow-500">Suspended</Badge>;
      case "EXPIRED":
        return <Badge className="bg-red-500">Expired</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading || isLoadingCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.companyId) {
    return (
      <div className="container max-w-7xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have access to the company dashboard. Please contact your administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your company licenses and subscriptions
          </p>
        </div>
        
        <Dialog open={isCreatingLicenses} onOpenChange={setIsCreatingLicenses}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Key className="h-4 w-4" />
              Create Licenses
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Licenses</DialogTitle>
              <DialogDescription>
                Create new licenses for your company subscription.
                Each license can be assigned to one user.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Number of Licenses</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={licenseQuantity}
                  onChange={(e) => setLicenseQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingLicenses(false)}
                disabled={createLicensesMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateLicenses}
                disabled={createLicensesMutation.isPending}
              >
                {createLicensesMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Licenses"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Total Licenses</CardTitle>
            <Key className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingLicenses ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                licenses?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Available</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingAvailableLicenses ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                availableLicenses?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Assigned</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingAssignedLicenses ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                assignedLicenses?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Licenses</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Licenses</CardTitle>
              <CardDescription>
                View all licenses associated with your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLicenses ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : licensesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load licenses. Please try again.
                  </AlertDescription>
                </Alert>
              ) : !licenses || licenses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Licenses</AlertTitle>
                  <AlertDescription>
                    No licenses found. Create licenses to get started.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableCaption>A list of all your company licenses.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenses.map((license: License) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-mono">{license.licenseKey}</TableCell>
                        <TableCell>{getLicenseStatusBadge(license.status)}</TableCell>
                        <TableCell>
                          {license.userId ? (
                            license.userId
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(license.createdAt)}</TableCell>
                        <TableCell>{formatDate(license.updatedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Licenses</CardTitle>
              <CardDescription>
                Licenses that can be assigned to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAvailableLicenses ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !availableLicenses || availableLicenses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Available Licenses</AlertTitle>
                  <AlertDescription>
                    No available licenses found. Create more licenses or revoke existing ones.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableCaption>A list of available licenses that can be assigned.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableLicenses.map((license: License) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-mono">{license.licenseKey}</TableCell>
                        <TableCell>{formatDate(license.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="gap-1">
                                <UserPlus className="h-4 w-4" />
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Assign License</DialogTitle>
                                <DialogDescription>
                                  Assign this license to a user
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="user">Select User</Label>
                                  <select
                                    id="user"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                  >
                                    <option value="">Select a user...</option>
                                    {isLoadingUsers ? (
                                      <option disabled>Loading users...</option>
                                    ) : (
                                      users?.map((user: User) => (
                                        <option key={user.id} value={user.id}>
                                          {user.email} {user.firstName && user.lastName ? `(${user.firstName} ${user.lastName})` : ''}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedUserId("")}
                                  disabled={assignLicenseMutation.isPending}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => handleAssignLicense(license.id)}
                                  disabled={!selectedUserId || assignLicenseMutation.isPending}
                                >
                                  {assignLicenseMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Assigning...
                                    </>
                                  ) : (
                                    "Assign License"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assigned">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Licenses</CardTitle>
              <CardDescription>
                Licenses currently assigned to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAssignedLicenses ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !assignedLicenses || assignedLicenses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Assigned Licenses</AlertTitle>
                  <AlertDescription>
                    No assigned licenses found. Assign licenses to users to see them here.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableCaption>A list of licenses assigned to users.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Key</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedLicenses.map((license: License) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-mono">{license.licenseKey}</TableCell>
                        <TableCell>{license.userId}</TableCell>
                        <TableCell>{formatDate(license.assignedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRevokeLicense(license.id)}
                            disabled={revokeLicenseMutation.isPending}
                          >
                            {revokeLicenseMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserX className="h-4 w-4" />
                                Revoke
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
