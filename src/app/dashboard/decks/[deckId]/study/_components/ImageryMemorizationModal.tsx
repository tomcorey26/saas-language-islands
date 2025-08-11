"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  MapPin, 
  Eye, 
  Heart, 
  Save, 
  Shuffle,
  Lightbulb 
} from "lucide-react";
import {
  getMemoryPalacePrompts,
  getVisualImageryPrompts,
  getPersonalConnectionPrompts,
  getRandomPrompt,
} from "@/lib/spaced-repetition";

interface MemoryTechniques {
  memoryPalaceLocation?: string;
  visualImagery?: string;
  personalConnection?: string;
}

interface ImageryMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (techniques: MemoryTechniques) => void;
  phrase: string;
  translation: string;
  initialTechniques?: MemoryTechniques;
}

export function ImageryMemorizationModal({
  isOpen,
  onClose,
  onSave,
  phrase,
  translation,
  initialTechniques = {},
}: ImageryMemorizationModalProps) {
  const [techniques, setTechniques] = useState<MemoryTechniques>(initialTechniques);
  const [prompts, setPrompts] = useState({
    memoryPalace: getRandomPrompt(getMemoryPalacePrompts()),
    visualImagery: getRandomPrompt(getVisualImageryPrompts()),
    personalConnection: getRandomPrompt(getPersonalConnectionPrompts()),
  });

  useEffect(() => {
    if (isOpen) {
      setTechniques(initialTechniques);
    }
  }, [isOpen, initialTechniques]);

  const handleSave = () => {
    onSave(techniques);
    onClose();
  };

  const refreshPrompt = (type: keyof typeof prompts) => {
    const promptGenerators = {
      memoryPalace: getMemoryPalacePrompts,
      visualImagery: getVisualImageryPrompts,
      personalConnection: getPersonalConnectionPrompts,
    };
    
    setPrompts(prev => ({
      ...prev,
      [type]: getRandomPrompt(promptGenerators[type]()),
    }));
  };

  const hasAnyTechnique = Object.values(techniques).some(value => value && value.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Memory Techniques
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Phrase display */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div>
              <Badge variant="secondary" className="text-xs mb-1">
                Phrase
              </Badge>
              <p className="font-medium">{phrase}</p>
            </div>
            <div>
              <Badge variant="secondary" className="text-xs mb-1">
                Translation
              </Badge>
              <p className="text-muted-foreground">{translation}</p>
            </div>
          </div>

          {/* Memory techniques tabs */}
          <Tabs defaultValue="memory-palace" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="memory-palace" className="text-xs">
                <MapPin className="h-4 w-4 mr-1" />
                Memory Palace
              </TabsTrigger>
              <TabsTrigger value="visual-imagery" className="text-xs">
                <Eye className="h-4 w-4 mr-1" />
                Visual Imagery
              </TabsTrigger>
              <TabsTrigger value="personal-connection" className="text-xs">
                <Heart className="h-4 w-4 mr-1" />
                Personal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="memory-palace" className="space-y-3 mt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Memory Palace Location</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Place this phrase in a familiar location to help remember it.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshPrompt("memoryPalace")}
                  className="flex-shrink-0"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">{prompts.memoryPalace}</p>
              </div>
              
              <Textarea
                placeholder="Describe where you would place this phrase in your memory palace..."
                value={techniques.memoryPalaceLocation || ""}
                onChange={(e) => setTechniques(prev => ({ 
                  ...prev, 
                  memoryPalaceLocation: e.target.value 
                }))}
                className="min-h-[100px]"
              />
            </TabsContent>

            <TabsContent value="visual-imagery" className="space-y-3 mt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Visual Imagery</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Create a vivid mental image to make this phrase memorable.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshPrompt("visualImagery")}
                  className="flex-shrink-0"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                <p className="text-sm text-green-800">{prompts.visualImagery}</p>
              </div>
              
              <Textarea
                placeholder="Describe the visual image you create for this phrase..."
                value={techniques.visualImagery || ""}
                onChange={(e) => setTechniques(prev => ({ 
                  ...prev, 
                  visualImagery: e.target.value 
                }))}
                className="min-h-[100px]"
              />
            </TabsContent>

            <TabsContent value="personal-connection" className="space-y-3 mt-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Personal Connection</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Connect this phrase to your personal experiences or emotions.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshPrompt("personalConnection")}
                  className="flex-shrink-0"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-400">
                <p className="text-sm text-purple-800">{prompts.personalConnection}</p>
              </div>
              
              <Textarea
                placeholder="Describe how this phrase connects to your personal life..."
                value={techniques.personalConnection || ""}
                onChange={(e) => setTechniques(prev => ({ 
                  ...prev, 
                  personalConnection: e.target.value 
                }))}
                className="min-h-[100px]"
              />
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              {hasAnyTechnique ? "Memory techniques saved" : "No techniques added yet"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Techniques
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}