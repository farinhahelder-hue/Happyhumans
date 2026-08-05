"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  admin_notes?: string | null;
  created_at: string;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied" | "archived">(
    "new"
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [filter]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      let query = supabase.from("contact_submissions").select("*");

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      loadContacts();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Êtes-vous sûr ?")) return;

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSelectedId(null);
      loadContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const saveNotes = async (id: string) => {
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ admin_notes: notesDraft })
        .eq("id", id);

      if (error) throw error;
      await loadContacts();
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

  const selectContact = (contact: ContactSubmission) => {
    setSelectedId(contact.id);
    setNotesDraft(contact.admin_notes || "");
  };

  const selected = contacts.find((c) => c.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Formulaires de contact</h1>

      <div className="flex gap-4 mb-8">
        {(["all", "new", "read", "replied", "archived"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {status === "all"
              ? "Tous"
              : status === "new"
                ? "Nouveaux"
                : status === "read"
                  ? "Lus"
                  : status === "replied"
                    ? "Répondus"
                    : "Archivés"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {loading ? (
            <p className="text-gray-600">Chargement...</p>
          ) : contacts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucun formulaire</p>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => selectContact(contact)}
                  className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${
                    selectedId === contact.id
                      ? "border-blue-600 bg-blue-50"
                      : contact.status === "new"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-600 mt-1">{contact.subject}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(contact.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        contact.status === "new"
                          ? "bg-yellow-200 text-yellow-800"
                          : contact.status === "read"
                            ? "bg-blue-200 text-blue-800"
                            : contact.status === "replied"
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {contact.status === "new"
                        ? "Nouveau"
                        : contact.status === "read"
                          ? "Lu"
                          : contact.status === "replied"
                            ? "Répondu"
                            : "Archivé"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white border rounded-lg p-6 sticky top-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">{selected.name}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-600">EMAIL</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {selected.email}
                </a>
              </div>

              {selected.phone && (
                <div>
                  <p className="text-xs text-gray-600">TÉLÉPHONE</p>
                  <a href={`tel:${selected.phone}`} className="text-blue-600 hover:underline">
                    {selected.phone}
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-600">SUJET</p>
                <p className="font-medium">{selected.subject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600">DATE</p>
                <p className="text-sm">
                  {new Date(selected.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <p className="text-xs text-gray-600 mb-2">MESSAGE</p>
              <p className="text-gray-800 whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="border-t pt-6 mb-6">
              <p className="text-xs text-gray-600 mb-2">NOTES INTERNES</p>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={3}
                placeholder="Notes privées, jamais visibles par le contact..."
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={() => saveNotes(selected.id)}
                disabled={savingNotes || notesDraft === (selected.admin_notes || "")}
                className="mt-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                {savingNotes ? "Sauvegarde..." : "Sauvegarder la note"}
              </button>
            </div>

            <div className="space-y-3 border-t pt-6">
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="new">Nouveau</option>
                <option value="read">Lu</option>
                <option value="replied">Répondu</option>
                <option value="archived">Archivé</option>
              </select>

              <button
                onClick={() => deleteContact(selected.id)}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
