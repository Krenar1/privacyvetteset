import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, X, ExternalLink, AlertTriangle } from "lucide-react";

interface Domain {
  id: string;
  domain: string;
  verified: boolean;
  status: 'active' | 'pending' | 'error';
  dateAdded: string;
  banners: string[];
}

const DomainManager: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "1",
      domain: "example.com",
      verified: true,
      status: "active",
      dateAdded: "2025-03-15",
      banners: ["Standard Cookie Banner"]
    },
    {
      id: "2",
      domain: "test-site.org",
      verified: false,
      status: "pending",
      dateAdded: "2025-04-10",
      banners: []
    }
  ]);

  const [showAddDomain, setShowAddDomain] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleAddDomain = () => {
    if (!newDomain) {
      setError("Please enter a domain");
      return;
    }

    // Simple domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      setError("Please enter a valid domain (e.g., example.com)");
      return;
    }

    // Check if domain already exists
    if (domains.some(d => d.domain === newDomain)) {
      setError("This domain has already been added");
      return;
    }

    const newDomainObj: Domain = {
      id: Math.random().toString(36).substring(2, 9),
      domain: newDomain,
      verified: false,
      status: "pending",
      dateAdded: new Date().toISOString().split('T')[0],
      banners: []
    };

    setDomains([...domains, newDomainObj]);
    setNewDomain("");
    setError("");
    setShowAddDomain(false);
  };

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(validationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startVerification = (domain: Domain) => {
    setSelectedDomain(domain);
    setValidationCode(`privacyvet-verify=${domain.id}-${Math.random().toString(36).substring(2, 15)}`);
    setShowVerifyDialog(true);
  };

  const completeVerification = () => {
    if (selectedDomain) {
      setDomains(domains.map(d => 
        d.id === selectedDomain.id 
          ? { ...d, verified: true, status: "active" } 
          : d
      ));
      setShowVerifyDialog(false);
    }
  };

  const removeDomain = (domainId: string) => {
    setDomains(domains.filter(d => d.id !== domainId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Domain Management</h2>
        <Button onClick={() => setShowAddDomain(true)}>Add Domain</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Banners</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No domains added yet. Add your first domain to get started.
                </TableCell>
              </TableRow>
            ) : (
              domains.map(domain => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.domain}</TableCell>
                  <TableCell>
                    {domain.status === "active" ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                    ) : domain.status === "pending" ? (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending Verification</Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-600">Error</Badge>
                    )}
                  </TableCell>
                  <TableCell>{domain.dateAdded}</TableCell>
                  <TableCell>
                    {domain.banners.length > 0 ? (
                      <div>{domain.banners.join(", ")}</div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No banners</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                        title="Visit domain"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {!domain.verified && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startVerification(domain)}
                          title="Verify domain"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeDomain(domain.id)}
                        title="Remove domain"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Domain Dialog */}
      <Dialog open={showAddDomain} onOpenChange={setShowAddDomain}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
            <DialogDescription>
              Add a domain where you want to display cookie consent banners
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <p className="text-sm text-muted-foreground">
                Enter your website domain without http:// or www
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDomain(false);
              setError("");
              setNewDomain("");
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddDomain}>Add Domain</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Domain Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Domain Ownership</DialogTitle>
            <DialogDescription>
              Verify that you own {selectedDomain?.domain}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-muted p-4 space-y-4">
              <div>
                <Label className="mb-1 block">Option 1: Add a META tag</Label>
                <div className="relative">
                  <pre className="text-xs bg-black text-white p-3 rounded-md overflow-x-auto">
                    {`<meta name="privacyvet-verification" content="${validationCode}" />`}
                  </pre>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-1 right-1 h-7 w-7 p-0" 
                    onClick={copyVerificationCode}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Add this meta tag to the head section of your website's home page.
                </p>
              </div>

              <div>
                <Label className="mb-1 block">Option 2: Create a text file</Label>
                <p className="text-xs text-muted-foreground">
                  Create a text file at:
                </p>
                <code className="text-xs block mt-1 mb-1">
                  {`https://${selectedDomain?.domain}/privacyvet.txt`}
                </code>
                <p className="text-xs text-muted-foreground">
                  with the following content:
                </p>
                <div className="relative">
                  <pre className="text-xs bg-black text-white p-3 rounded-md overflow-x-auto">
                    {validationCode}
                  </pre>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-1 right-1 h-7 w-7 p-0" 
                    onClick={copyVerificationCode}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-1" />
              <p className="text-sm text-muted-foreground">
                Domain verification is required to ensure banners are only displayed on websites you control.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowVerifyDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={completeVerification}>
              Verify Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainManager;