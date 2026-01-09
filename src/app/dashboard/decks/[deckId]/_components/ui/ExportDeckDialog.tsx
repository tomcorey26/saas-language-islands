"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  exportDeckToCsv,
  exportDeckToAnki,
  sanitizeFilename,
  downloadFile,
  type DeckWithCards,
} from "@/lib/export-deck";

interface ExportDeckDialogProps {
  deck: DeckWithCards;
}

export function ExportDeckDialog({ deck }: ExportDeckDialogProps) {
  const [open, setOpen] = useState(false);

  const handleExport = (format: "csv" | "anki") => {
    // Generate content based on format
    const content =
      format === "csv" ? exportDeckToCsv(deck) : exportDeckToAnki(deck);

    // Create filename
    const filename = sanitizeFilename(deck.name);
    const extension = format === "csv" ? "csv" : "txt";
    const mimeType =
      format === "csv"
        ? "text/csv;charset=utf-8;"
        : "text/plain;charset=utf-8;";

    // Trigger download
    downloadFile(content, `${filename}.${extension}`, mimeType);

    // Close dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          <span>Download</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Deck</DialogTitle>
          <DialogDescription>
            Choose a format to download your flashcards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className="h-auto w-full justify-start p-4 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">CSV Format</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Basic spreadsheet format (Front, Back)
                </div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport("anki")}
            className="h-auto w-full justify-start p-4 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Anki Format</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Tab-delimited text for Anki import
                </div>
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
