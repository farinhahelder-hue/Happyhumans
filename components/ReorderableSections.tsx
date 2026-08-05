"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface ReorderableSectionsProps {
  sections: Section[];
  pageId: string;
  isAdmin?: boolean;
}

export default function ReorderableSections({
  sections: initialSections,
  pageId,
  isAdmin = false,
}: ReorderableSectionsProps) {
  const [sections, setSections] = useState(initialSections);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleDragStart = (id: string) => {
    if (!isAdmin) return;
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!isAdmin || !draggedId || draggedId === targetId) return;

    const draggedIndex = sections.findIndex((s) => s.id === draggedId);
    const targetIndex = sections.findIndex((s) => s.id === targetId);

    const newSections = [...sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);

    setSections(newSections);
    setDraggedId(null);
    setIsDirty(true);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[target]] = [
      newSections[target],
      newSections[index],
    ];
    setSections(newSections);
    setIsDirty(true);
  };

  const saveOrder = async () => {
    try {
      const response = await fetch(`/api/admin/page-order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          order: sections.map((s) => s.id),
        }),
      });

      if (response.ok) {
        setIsDirty(false);
        alert("Ordre sauvegardé avec succès");
      }
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            draggable={isAdmin}
            onDragStart={() => handleDragStart(section.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(section.id)}
            className={`${
              isAdmin ? "cursor-move hover:shadow-lg transition-shadow" : ""
            } ${draggedId === section.id ? "opacity-50" : ""}`}
          >
            {isAdmin && (
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span>☰</span> Glissez pour réorganiser
                </span>
                <button
                  type="button"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  aria-label="Monter la section"
                  className="px-2 py-0.5 border rounded bg-white hover:bg-gray-50 transition disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  aria-label="Descendre la section"
                  className="px-2 py-0.5 border rounded bg-white hover:bg-gray-50 transition disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            )}
            {section.component}
          </motion.div>
        ))}
      </AnimatePresence>

      {isAdmin && isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 bg-white shadow-lg rounded-lg p-4 flex justify-between items-center"
        >
          <span className="text-sm text-gray-600">Changements non sauvegardés</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSections(initialSections);
                setIsDirty(false);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Annuler
            </button>
            <button
              onClick={saveOrder}
              className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-dark"
            >
              Sauvegarder l'ordre
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
