"use client";

import { documentsEngine } from "@/lib/backendService";
import { Document } from "@/lib/types";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export default function DocumentsComponent() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    documentsEngine()
      .then((response: AxiosResponse<Document[]>) => {
        setDocuments(response.data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error while fetching documents", error.message);
        } else {
          console.error("Error while fetching documents", error);
        }
      })
      .finally(() => {
        console.log("Documents fetched successfully");
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">My Documents</h1>

      {documents.length === 0 ? (
        <p className="text-center text-gray-500">No documents found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {doc.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                Type:{" "}
                <span className="font-medium text-gray-700">
                  {doc.type.replace("_", " ")}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Size:{" "}
                <span className="font-medium text-gray-700">
                  {(doc.size / 1024).toFixed(2)} KB
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Created at:{" "}
                <span className="font-medium text-gray-700">
                  {new Date(doc.created_at).toLocaleString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
