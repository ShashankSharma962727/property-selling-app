import { useState } from "react";
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

const AddProperty = () => {
  const [propertyFormData, setPropertyFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPropertyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

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
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const FormPayload = {
        ...propertyFormData,
        price: Number(propertyFormData.price),
        area: Number(propertyFormData.area),
        bedrooms:
          propertyFormData.bedrooms === ""
            ? undefined
            : Number(propertyFormData.bedrooms),
        bathrooms:
          propertyFormData.bathrooms === ""
            ? undefined
            : Number(propertyFormData.bathrooms),
      };

      const payload = new FormData();

      Object.entries(FormPayload).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const response = await api.post("/api/v1/property", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Property created successfully!");
      setPropertyFormData(initialFormData);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      console.log(err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPropertyFormData(initialFormData);
    setError("");
    setSuccess("");
  };

  return (
    <section className="min-h-full bg-cream-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 border-b border-cream-200 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Seller
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-navy-950 sm:text-3xl">
            Add a property.
          </h1>

          <p className="mt-2 text-sm leading-6 text-navy-950/60">
            Fill in your property details to create a new listing.
          </p>
        </div>

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
              Tell buyers about your property.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Property Title *</label>
                <input
                  name="title"
                  value={propertyFormData.title}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Luxury 3 BHK Apartment"
                  required
                  maxLength={150}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  value={propertyFormData.description}
                  onChange={handleChange}
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Describe the property, features and amenities..."
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
              Enter the asking price and property address.
            </p>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={propertyFormData.price}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 7500000"
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
                  placeholder="Street, locality, city, state..."
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
              Add the size and room information.
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
                  placeholder="e.g. 1500"
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
                  placeholder="Number of bedrooms"
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
                  placeholder="Number of bathrooms"
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
              Upload the main image for your listing (maximum 5 MB).
            </p>

            <label className={labelClass}>Image URL *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handlePhoto}
              className={inputClass}
              required
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Property preview"
                className="mt-4 h-100 w-full rounded-sm border border-cream-200 object-cover"
              />
            )}
          </div>

          {/* Status Messages */}
          {(error || success) && (
            <div
              role="status"
              aria-live="polite"
              className={`mx-5 mb-4 rounded-sm border px-4 py-3 text-sm sm:mx-8 ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {error || success}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-cream-200 bg-cream-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-sm border border-cream-200 bg-white px-6 py-3 text-sm font-medium text-navy-950 transition hover:bg-cream-100 disabled:opacity-50"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-navy-950 px-7 py-3 text-sm font-semibold text-cream-50 transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Property"}
              {!loading && <span className="ml-2 text-amber-500">→</span>}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-navy-950/50">* Required fields</p>
      </div>
    </section>
  );
};

export default AddProperty;
