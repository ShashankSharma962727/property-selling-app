
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import api from "../API/api";

const initialFormData = {
  title: "",
  description: "",
  purpose: "Sale",
  propertyType: "",
  price: "",
  address: "",
  bathrooms: "",
  bedrooms: "",
  area: "",
  areaUnit: "sq ft",
};

const inputClass =
  "w-full rounded-sm border border-cream-200 bg-white px-4 py-3 text-sm text-navy-950 outline-none transition placeholder:text-navy-950/40 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

const labelClass = "mb-2 block text-sm font-medium text-navy-950";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [propertyFormData, setPropertyFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProperty = async () => {
      if (!token) {
        setError("Please log in to edit this property.");
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Change this URL if your backend uses a different GET route.
        const response = await api.get(`/api/v1/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response?.data?.success) {
          throw new Error(
            response?.data?.message || "Unable to load property."
          );
        }

        // Supports either { property } or { properties } response shapes.
        const property =
          response.data.property ?? response.data.properties;

        if (!property || Array.isArray(property)) {
          throw new Error("Property data was not found.");
        }

        if (!active) return;

        setPropertyFormData({
          title: property.title ?? "",
          description: property.description ?? "",
          purpose: property.purpose ?? "Sale",
          propertyType: property.propertyType ?? property.type ?? "",
          price: property.price ?? "",
          address: property.address ?? property.location ?? "",
          bathrooms: property.bathrooms ?? "",
          bedrooms: property.bedrooms ?? "",
          area: property.area ?? "",
          areaUnit: property.areaUnit ?? "sq ft",
        });

        setImagePreview(property.image ?? "");
      } catch (err) {
        console.error("Fetch property error:", err);

        if (active) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load property. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProperty();

    return () => {
      active = false;
    };
  }, [id, token]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPropertyFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Please log in before updating the property.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      const fields = {
        ...propertyFormData,
        price: Number(propertyFormData.price),
        area: Number(propertyFormData.area),
        bedrooms:
          propertyFormData.bedrooms === ""
            ? ""
            : Number(propertyFormData.bedrooms),
        bathrooms:
          propertyFormData.bathrooms === ""
            ? ""
            : Number(propertyFormData.bathrooms),
      };

      Object.entries(fields).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const response = await api.patch(
        `/api/v1/property/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to update property."
        );
      }

      setSuccess("Property updated successfully!");

      // Navigate after a short delay so the success message is visible.
      navigate("/dashboard/listings", {
        state: { message: "Property updated successfully!" },
      });
    } catch (err) {
      console.error("Update property error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while updating the property."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50 px-4 py-16 text-center text-navy-950">
        Loading property details...
      </main>
    );
  }

  return (
    <section className="min-h-screen bg-cream-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-cream-200 pb-6">
          <Link
            to="/dashboard/my-properties"
            className="mb-5 inline-block text-sm text-amber-700 hover:text-navy-950"
          >
            ← Back to My Listings
          </Link>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Seller
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-navy-950 sm:text-3xl">
            Edit property.
          </h1>

          <p className="mt-2 text-sm leading-6 text-navy-950/60">
            Update your property details and save your changes.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-sm border border-cream-200 bg-white shadow-sm"
        >
          {/* Basic Information */}
          <div className="border-b border-cream-200 px-5 py-6 sm:px-8">
            <h2 className="text-lg font-semibold text-navy-950">
              Basic Information
            </h2>

            <p className="mb-6 mt-1 text-sm text-navy-950/55">
              Update your property title and description.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Property Title *</label>
                <input
                  name="title"
                  value={propertyFormData.title}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={150}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  value={propertyFormData.description}
                  onChange={handleChange}
                  className={`${inputClass} min-h-32 resize-y`}
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Listing Purpose *</label>
                <select
                  name="purpose"
                  value={propertyFormData.purpose}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Property Type *</label>
                <select
                  name="propertyType"
                  value={propertyFormData.propertyType}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select property type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Office">Office</option>
                  <option value="Shop">Shop</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price and Location */}
          <div className="border-b border-cream-200 px-5 py-6 sm:px-8">
            <h2 className="text-lg font-semibold text-navy-950">
              Price & Location
            </h2>

            <p className="mb-6 mt-1 text-sm text-navy-950/55">
              Update the asking price and address.
            </p>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={propertyFormData.price}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Full Address *</label>
                <textarea
                  name="address"
                  value={propertyFormData.address}
                  onChange={handleChange}
                  className={`${inputClass} min-h-20 resize-y`}
                  rows={2}
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b border-cream-200 px-5 py-6 sm:px-8">
            <h2 className="text-lg font-semibold text-navy-950">
              Property Details
            </h2>

            <p className="mb-6 mt-1 text-sm text-navy-950/55">
              Update area and room information.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Area *</label>
                <input
                  type="number"
                  name="area"
                  value={propertyFormData.area}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Area Unit</label>
                <select
                  name="areaUnit"
                  value={propertyFormData.areaUnit}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="sq ft">Square Feet</option>
                  <option value="sq yd">Square Yards</option>
                  <option value="sq m">Square Metres</option>
                  <option value="acre">Acres</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={propertyFormData.bedrooms}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className={labelClass}>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={propertyFormData.bathrooms}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="px-5 py-6 sm:px-8">
            <h2 className="text-lg font-semibold text-navy-950">
              Property Image
            </h2>

            <p className="mb-6 mt-1 text-sm text-navy-950/55">
              Select a new image if you want to replace the existing one.
            </p>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Property preview"
                className="mb-4 h-64 w-full rounded-sm border border-cream-200 object-cover"
              />
            )}

            <label className={labelClass}>Replace Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handlePhoto}
              className={inputClass}
            />

            <p className="mt-2 text-xs text-stone-500">
              Maximum image size: 5 MB. Leave empty to keep the current image.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-cream-200 bg-cream-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
            <Link
              to="/dashboard/my-properties"
              className="rounded-sm border border-cream-200 bg-white px-6 py-3 text-center text-sm font-medium text-navy-950 hover:bg-cream-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-sm bg-navy-950 px-7 py-3 text-sm font-semibold text-cream-50 transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
              {!saving && (
                <span className="ml-2 text-amber-500">→</span>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-navy-950/50">
          * Required fields
        </p>
      </div>
    </section>
  );
};

export default EditProperty;
