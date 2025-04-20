import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Copy, CheckCircle, Globe, Shield, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { CookieToolService, Domain } from '@/services/cookieToolService';

export function DomainManager() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    setLoading(true);
    try {
      const domains = await CookieToolService.getDomains();
      setDomains(domains);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load domains',
        variant: 'destructive'
      });
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomainInput) {
      toast({
        title: 'Error',
        description: 'Please enter a domain name',
        variant: 'destructive'
      });
      return;
    }

    // Basic domain validation
    const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    if (!domainPattern.test(newDomainInput)) {
      toast({
        title: 'Invalid Domain',
        description: 'Please enter a valid domain name (e.g., example.com)',
        variant: 'destructive'
      });
      return;
    }

    setAdding(true);
    try {
      const newDomain = await CookieToolService.addDomain(newDomainInput);
      
      // Update local state
      setDomains([...domains, newDomain]);
      
      // Close dialog and reset input
      setAddDialogOpen(false);
      setNewDomainInput('');
      
      // Show success message with verification instructions
      toast({
        title: 'Domain Added',
        description: 'Domain was added successfully. Please verify ownership to use it.',
      });

      // Open the verification dialog
      setSelectedDomain(newDomain);
      setVerifyDialogOpen(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add domain. It might already exist in your account.',
        variant: 'destructive'
      });
      console.error('Failed to add domain:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleVerifyDomain = async (domain: Domain) => {
    setVerifying(true);
    try {
      await CookieToolService.verifyDomain(domain.id);
      
      // Update local state
      setDomains(domains.map(d => 
        d.id === domain.id ? { ...d, verified: true } : d
      ));
      
      // Close dialog
      setVerifyDialogOpen(false);
      setSelectedDomain(null);
      
      toast({
        title: 'Success',
        description: 'Domain verified successfully!',
      });
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Could not verify domain ownership. Please check that you\'ve added the verification file correctly.',
        variant: 'destructive'
      });
      console.error('Failed to verify domain:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteDomain = async (domain: Domain) => {
    setDeleting(true);
    try {
      await CookieToolService.removeDomain(domain.id);
      
      // Update local state
      setDomains(domains.filter(d => d.id !== domain.id));
      
      toast({
        title: 'Domain Removed',
        description: 'Domain was removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove domain',
        variant: 'destructive'
      });
      console.error('Failed to remove domain:', error);
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: 'Copied',
          description: 'Verification code copied to clipboard',
        });
      })
      .catch(err => {
        console.error('Error copying text: ', err);
        toast({
          title: 'Error',
          description: 'Failed to copy to clipboard',
          variant: 'destructive'
        });
      });
  };

  const generateVerificationInstructions = (domain: Domain) => {
    return (
      <div className="space-y-4">
        <p>To verify your ownership of <strong>{domain.domain}</strong>, you need to create a file called:</p>
        
        <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
          privacyvet-verify-{domain.verification_key.substring(0, 8)}.html
        </code>
        
        <p>with the following content:</p>
        
        <div className="relative">
          <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
            {domain.verification_key}
          </code>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-2" 
            onClick={() => copyToClipboard(domain.verification_key)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <p>Upload this file to your web server so it's accessible at:</p>
        
        <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
          https://{domain.domain}/privacyvet-verify-{domain.verification_key.substring(0, 8)}.html
        </code>
        
        <p>Once you've uploaded the file, click "Verify" to complete the process.</p>
      </div>
    );
  };

  const renderDomainTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    
    if (domains.length === 0) {
      return (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No domains added yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first domain to start managing cookie consents
          </p>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Your First Domain</Button>
            </DialogTrigger>
            <AddDomainDialog 
              onAdd={handleAddDomain}
              adding={adding}
              domainInput={newDomainInput}
              setDomainInput={setNewDomainInput}
            />
          </Dialog>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Domains</h2>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Domain</Button>
            </DialogTrigger>
            <AddDomainDialog 
              onAdd={handleAddDomain}
              adding={adding}
              domainInput={newDomainInput}
              setDomainInput={setNewDomainInput}
            />
          </Dialog>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">
                    {domain.domain}
                  </TableCell>
                  <TableCell>
                    {domain.verified ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Unverified
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!domain.verified && (
                        <Dialog open={verifyDialogOpen && selectedDomain?.id === domain.id} onOpenChange={(open) => {
                          setVerifyDialogOpen(open);
                          if (!open) setSelectedDomain(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedDomain(domain)}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Verify Domain Ownership</DialogTitle>
                              <DialogDescription>
                                Follow these steps to verify your ownership of this domain
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDomain && generateVerificationInstructions(selectedDomain)}
                            <DialogFooter>
                              <Button
                                onClick={() => handleVerifyDomain(selectedDomain!)}
                                disabled={verifying}
                              >
                                {verifying ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>Verify</>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Domain</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {domain.domain}? This action cannot be undone, and all cookie banners for this domain will be deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteDomain(domain)}
                              disabled={deleting}
                            >
                              {deleting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Removing...
                                </>
                              ) : (
                                <>Remove</>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <div>
      {renderDomainTable()}
    </div>
  );
}

interface AddDomainDialogProps {
  onAdd: () => void;
  adding: boolean;
  domainInput: string;
  setDomainInput: (value: string) => void;
}

function AddDomainDialog({ onAdd, adding, domainInput, setDomainInput }: AddDomainDialogProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Domain</DialogTitle>
        <DialogDescription>
          Enter the domain you want to add to your cookie consent management tool.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAdd();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Enter only the domain name without 'http://' or 'https://'
            </p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={onAdd}
          disabled={adding}
        >
          {adding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>Add Domain</>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}