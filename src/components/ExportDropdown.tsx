"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportDropdownProps {
  deckId: string;
  islandId?: string;
  deckName?: string;
  islandName?: string;
}

export function ExportDropdown({ 
  deckId, 
  islandId, 
  deckName = "flashcards",
  islandName 
}: ExportDropdownProps) {
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "anki") => {
    try {
      setIsExporting(true);
      
      const params = new URLSearchParams({
        format,
        deckId,
        ...(islandId && { islandId }),
        includeMetadata: includeMetadata.toString(),
      });

      const response = await fetch(`/api/export?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      
      const extension = format === "csv" ? "csv" : "apkg";
      const prefix = islandName ? `${deckName}-${islandName}` : deckName;
      a.download = `${prefix}-flashcards.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Exported as ${format.toUpperCase()} successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Export Options</h4>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="include-metadata"
              type="checkbox"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label 
              htmlFor="include-metadata" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include metadata
            </label>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Button
              onClick={() => handleExport("csv")}
              variant="ghost"
              className="w-full justify-start gap-2"
              disabled={isExporting}
            >
              <FileText className="h-4 w-4" />
              Export as CSV
            </Button>
            
            <Button
              onClick={() => handleExport("anki")}
              variant="ghost"
              className="w-full justify-start gap-2"
              disabled={isExporting}
            >
              <Package className="h-4 w-4" />
              Export as Anki
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}