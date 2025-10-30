import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Wrench className="h-12 w-12 text-gray-500" />
          </div>
          <CardTitle>Under Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We are currently performing scheduled maintenance. Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
