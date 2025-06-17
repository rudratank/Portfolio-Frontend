import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { CertificateForm } from "./CertificateForm";
import { toast } from "sonner";
import {
  ADD_CERTIFICATE_ROUTES,
  DELETE_CERTIFICATE_ROUTES,
  EDIT_CERTIFICATE_ROUTES,
  GET_CERTIFICATE_ROUTES,
} from "@/lib/constant";

export const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(GET_CERTIFICATE_ROUTES, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCertificates(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch certificates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertificate = async (certificateData) => {
    try {
      const response = await axios.post(
        ADD_CERTIFICATE_ROUTES,
        certificateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Certificate added successfully");
        await fetchCertificates();
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add certificate");
    }
  };

  const handleEditCertificate = async (certificateData) => {
    try {
      const response = await axios.put(
        `${EDIT_CERTIFICATE_ROUTES}${editingCertificate._id}`,
        certificateData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Certificate updated successfully");
        await fetchCertificates();
        setEditingCertificate(null);
        setIsFormOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update certificate");
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        const response = await axios.delete(
          `${DELETE_CERTIFICATE_ROUTES}${certificateId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Certificate deleted successfully");
          await fetchCertificates();
        }
      } catch (error) {
        toast.error("Failed to delete certificate");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Certificates</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Certificate
          </button>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full">
              <CertificateForm
                certificate={editingCertificate}
                onSubmit={
                  editingCertificate
                    ? handleEditCertificate
                    : handleAddCertificate
                }
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingCertificate(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                loading="lazy"
                src={certificate.image} // Now this will be a Cloudinary URL
                alt={certificate.title}
                className="w-full h-48 object-cover"
              a/>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{certificate.title}</h3>
                <p className="text-gray-600">{certificate.platform}</p>
                <p className="text-sm text-gray-500">
                  {certificate.formattedDate ||
                    new Date(certificate.date + "-01").toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                </p>

                {/* Display additional fields */}
                {certificate.credentialId && (
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {certificate.credentialId}
                  </p>
                )}

                {certificate.credentialUrl && (
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1 inline-block"
                  >
                    View Credential →
                  </a>
                )}

                {certificate.expiryDate && (
                  <p className="text-xs text-orange-500 mt-1">
                    Expires:{" "}
                    {certificate.formattedExpiryDate ||
                      new Date(
                        certificate.expiryDate + "-01"
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                  </p>
                )}

                {certificate.skills && certificate.skills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {certificate.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {certificate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{certificate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingCertificate(certificate);
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCertificate(certificate._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
