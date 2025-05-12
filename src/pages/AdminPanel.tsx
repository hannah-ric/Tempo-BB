import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/database";
import { Loader2, Plus, Save, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface ComponentData {
  id: string;
  name: string;
  component: string;
  description: string;
  dimensions: any;
  materials: string[];
  created_at: string;
}

interface MaterialData {
  id: string;
  name: string;
  type: string;
  description: string;
  properties: any;
  created_at: string;
}

interface JoineryData {
  id: string;
  name: string;
  description: string;
  strength_rating: number;
  difficulty: string;
  compatible_materials: string[];
  created_at: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("components");
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [joinery, setJoinery] = useState<JoineryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let data;
      switch (activeTab) {
        case "components":
          const { data: componentsData, error: componentsError } =
            await supabase.from("furniture_components").select("*");
          if (componentsError) throw componentsError;
          setComponents(componentsData || []);
          break;
        case "materials":
          // Combine lumber, sheet, and other materials
          const { data: lumberData } = await supabase
            .from("lumber_materials")
            .select("*");
          const { data: sheetData } = await supabase
            .from("sheet_materials")
            .select("*");
          const { data: otherData } = await supabase
            .from("other_materials")
            .select("*");

          data = [
            ...(lumberData || []).map((m) => ({ ...m, type: "lumber" })),
            ...(sheetData || []).map((m) => ({ ...m, type: "sheet" })),
            ...(otherData || []).map((m) => ({ ...m, type: "other" })),
          ];
          setMaterials(data);
          break;
        case "joinery":
          const { data: joineryData, error: joineryError } = await supabase
            .from("joinery_methods")
            .select("*");
          if (joineryError) throw joineryError;
          setJoinery(joineryData || []);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${activeTab}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    let newItem;
    switch (activeTab) {
      case "components":
        newItem = {
          name: "",
          component: "",
          description: "",
          dimensions: {},
          materials: [],
        };
        break;
      case "materials":
        newItem = {
          name: "",
          type: "lumber",
          description: "",
          properties: {},
        };
        break;
      case "joinery":
        newItem = {
          name: "",
          description: "",
          strength_rating: 3,
          difficulty: "medium",
          compatible_materials: [],
        };
        break;
    }
    setSelectedItem(newItem);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      let result;
      switch (activeTab) {
        case "components":
          if (selectedItem.id) {
            const { data, error } = await supabase
              .from("furniture_components")
              .update({
                name: selectedItem.name,
                component: selectedItem.component,
                description: selectedItem.description,
                dimensions: selectedItem.dimensions,
                materials: selectedItem.materials,
              })
              .eq("id", selectedItem.id)
              .select();
            if (error) throw error;
            result = data[0];
          } else {
            const { data, error } = await supabase
              .from("furniture_components")
              .insert([
                {
                  name: selectedItem.name,
                  component: selectedItem.component,
                  description: selectedItem.description,
                  dimensions: selectedItem.dimensions,
                  materials: selectedItem.materials,
                },
              ])
              .select();
            if (error) throw error;
            result = data[0];
          }
          break;
        case "materials":
          // Determine which table to use based on type
          const table = `${selectedItem.type}_materials`;
          if (selectedItem.id) {
            const { data, error } = await supabase
              .from(table)
              .update({
                name: selectedItem.name,
                description: selectedItem.description,
                properties: selectedItem.properties,
              })
              .eq("id", selectedItem.id)
              .select();
            if (error) throw error;
            result = data[0];
          } else {
            const { data, error } = await supabase
              .from(table)
              .insert([
                {
                  name: selectedItem.name,
                  description: selectedItem.description,
                  properties: selectedItem.properties,
                },
              ])
              .select();
            if (error) throw error;
            result = data[0];
          }
          break;
        case "joinery":
          if (selectedItem.id) {
            const { data, error } = await supabase
              .from("joinery_methods")
              .update({
                name: selectedItem.name,
                description: selectedItem.description,
                strength_rating: selectedItem.strength_rating,
                difficulty: selectedItem.difficulty,
                compatible_materials: selectedItem.compatible_materials,
              })
              .eq("id", selectedItem.id)
              .select();
            if (error) throw error;
            result = data[0];
          } else {
            const { data, error } = await supabase
              .from("joinery_methods")
              .insert([
                {
                  name: selectedItem.name,
                  description: selectedItem.description,
                  strength_rating: selectedItem.strength_rating,
                  difficulty: selectedItem.difficulty,
                  compatible_materials: selectedItem.compatible_materials,
                },
              ])
              .select();
            if (error) throw error;
            result = data[0];
          }
          break;
      }

      toast({
        title: selectedItem.id ? "Item Updated" : "Item Created",
        description: `${selectedItem.name} has been ${selectedItem.id ? "updated" : "created"} successfully.`,
      });

      // Refresh data
      fetchData();
      setIsEditing(false);
      setSelectedItem(null);
    } catch (error) {
      console.error(`Error saving ${activeTab}:`, error);
      toast({
        title: "Error",
        description: `Failed to save ${activeTab}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      let table;
      switch (activeTab) {
        case "components":
          table = "furniture_components";
          break;
        case "materials":
          // Need to determine which material table to use
          const material = materials.find((m) => m.id === id);
          if (!material) return;
          table = `${material.type}_materials`;
          break;
        case "joinery":
          table = "joinery_methods";
          break;
      }

      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: "The item has been deleted successfully.",
      });

      // Refresh data
      fetchData();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${activeTab}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const renderItemList = () => {
    let items: any[] = [];
    switch (activeTab) {
      case "components":
        items = components;
        break;
      case "materials":
        items = materials;
        break;
      case "joinery":
        items = joinery;
        break;
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="p-8 text-center border rounded-md">
          <p className="text-muted-foreground mb-4">
            No {activeTab} found. Create your first one!
          </p>
          <Button onClick={handleCreateNew}>
            Create New {activeTab.slice(0, -1)}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {item.description || "No description"}
                  </p>
                  {activeTab === "materials" && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-full mt-1 inline-block">
                      {item.type}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSelectItem(item)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderEditForm = () => {
    if (!selectedItem) return null;

    switch (activeTab) {
      case "components":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={selectedItem.name}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
                placeholder="Component Name"
              />
            </div>
            <div>
              <Label htmlFor="component">Component Type</Label>
              <Input
                id="component"
                value={selectedItem.component}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    component: e.target.value,
                  })
                }
                placeholder="e.g., table_leg, chair_back"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                placeholder="Component description"
              />
            </div>
            <div>
              <Label htmlFor="materials">Materials (comma separated)</Label>
              <Input
                id="materials"
                value={selectedItem.materials?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    materials: e.target.value
                      .split(",")
                      .map((m: string) => m.trim()),
                  })
                }
                placeholder="oak, walnut, maple"
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensions (JSON)</Label>
              <Textarea
                id="dimensions"
                value={JSON.stringify(selectedItem.dimensions || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const dimensions = JSON.parse(e.target.value);
                    setSelectedItem({ ...selectedItem, dimensions });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"length": "range:24-48", "width": "range:12-24", "height": "range:28-36"}'
              />
            </div>
          </div>
        );
      case "materials":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={selectedItem.name}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
                placeholder="Material Name"
              />
            </div>
            <div>
              <Label htmlFor="type">Material Type</Label>
              <select
                id="type"
                value={selectedItem.type}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, type: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="lumber">Lumber</option>
                <option value="sheet">Sheet</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                placeholder="Material description"
              />
            </div>
            <div>
              <Label htmlFor="properties">Properties (JSON)</Label>
              <Textarea
                id="properties"
                value={JSON.stringify(selectedItem.properties || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const properties = JSON.parse(e.target.value);
                    setSelectedItem({ ...selectedItem, properties });
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder='{"hardness": "hard", "color": "brown", "grain": "straight"}'
              />
            </div>
          </div>
        );
      case "joinery":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={selectedItem.name}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
                placeholder="Joinery Method Name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                placeholder="Joinery method description"
              />
            </div>
            <div>
              <Label htmlFor="strength">Strength Rating (1-5)</Label>
              <Input
                id="strength"
                type="number"
                min="1"
                max="5"
                value={selectedItem.strength_rating}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    strength_rating: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                value={selectedItem.difficulty}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    difficulty: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <Label htmlFor="compatible_materials">
                Compatible Materials (comma separated)
              </Label>
              <Input
                id="compatible_materials"
                value={selectedItem.compatible_materials?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    compatible_materials: e.target.value
                      .split(",")
                      .map((m: string) => m.trim()),
                  })
                }
                placeholder="oak, walnut, maple"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="joinery">Joinery Methods</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </CardTitle>
                  <Button size="sm" onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-1" /> New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {renderItemList()}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedItem?.id ? "Edit" : "Create"}{" "}
                  {activeTab.slice(0, -1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <>
                    {renderEditForm()}
                    <div className="flex justify-end mt-4 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedItem(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        {selectedItem?.id ? "Update" : "Create"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Select an item to edit or create a new one.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
