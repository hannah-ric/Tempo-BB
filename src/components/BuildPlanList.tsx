import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getUserBuildPlans,
  deleteBuildPlan,
  getBuildPlan,
} from "@/lib/database";
import { Loader2, Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";

interface BuildPlanListProps {
  onSelectPlan?: (planId: string) => void;
  onDeletePlan?: (planId: string) => void;
  onEditPlan?: (planId: string) => void;
  userId?: string;
}

interface BuildPlanSummary {
  id: string;
  plan_name: string;
  created_at: string;
  updated_at: string;
  status: string;
  design_brief: any;
}

const BuildPlanList = ({
  onSelectPlan = () => {},
  onDeletePlan = () => {},
  onEditPlan = () => {},
  userId,
}: BuildPlanListProps) => {
  const [plans, setPlans] = useState<BuildPlanSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      // Pass the user ID to get user-specific plans
      const data = await getUserBuildPlans(userId || user?.id);
      setPlans(data as BuildPlanSummary[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching build plans:", err);
      setError("Failed to load build plans. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [userId, user?.id]);

  const handleSelectPlan = async (planId: string) => {
    try {
      const plan = await getBuildPlan(planId);
      if (plan) {
        onSelectPlan(planId);
      } else {
        toast({
          title: "Error",
          description: "Failed to load the selected plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(`Error loading plan ${planId}:`, err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading the plan.",
        variant: "destructive",
      });
    }
  };

  const confirmDeletePlan = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    setIsDeleting(true);
    try {
      // Pass the user ID to ensure proper authorization
      const success = await deleteBuildPlan(planToDelete, userId || user?.id);
      if (success) {
        // Remove from local state
        setPlans(plans.filter((plan) => plan.id !== planToDelete));
        onDeletePlan(planToDelete);
        toast({
          title: "Plan Deleted",
          description: "The build plan has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the plan. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(`Error deleting plan ${planToDelete}:`, err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the plan.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading build plans...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
        {error}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md">
        <p className="text-muted-foreground mb-4">
          You don't have any saved build plans yet.
        </p>
        <Button onClick={() => onEditPlan("new")}>Create New Plan</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Build Plans</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPlans} title="Refresh Plans">
            <Loader2 className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => onEditPlan("new")}>Create New Plan</Button>
        </div>
      </div>

      {plans.map((plan) => (
        <Card key={plan.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{plan.plan_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.design_brief?.description || "No description"}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {plan.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(plan.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSelectPlan(plan.id)}
                  title="View Plan"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditPlan(plan.id)}
                  title="Edit Plan"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDeletePlan(plan.id)}
                  title="Delete Plan"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              build plan and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BuildPlanList;
