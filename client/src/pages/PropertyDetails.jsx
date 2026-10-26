
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../API/api";

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price on request";
  }

  if (typeof price === "string" && /[₹$]/.test(price)) {
    return price;
  }

  const amount = Number(price);

  if (Number.isNaN(amount)) return String(price);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProperty = async () => {
      if (!id) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setProperty(null);

        // Update this endpoint if your backend uses a different route.
        const response = await api.get(`/api/v1/property/${id}`);

        const data = response.data;

        const propertyData =
          data?.property ??
          data?.data?.property ??
          data?.properties ??
          data?.data ??
          data;

        if (
          !propertyData ||
          Array.isArray(propertyData) ||
          typeof propertyData !== "object"
        ) {
          throw new Error("Property details could not be found.");
        }

        if (active) {
          setProperty(propertyData);

          const images = Array.isArray(propertyData.images)
            ? propertyData.images
            : [];

          setSelectedImage(
            propertyData.image ||
              images[0] ||
              "https://placehold.co/1200x700?text=Property"
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load property details. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-16">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-stone-200" />
          <div className="h-80 rounded-2xl bg-stone-200 sm:h-[480px]" />
          <div className="h-8 w-2/3 rounded bg-stone-200" />
          <div className="h-5 w-1/3 rounded bg-stone-200" />
          <div className="h-24 rounded bg-stone-200" />
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-stone-50 px-4 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">
            Listing
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-navy-950">
            Property unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-500">
            {error || "We couldn't find this property."}
          </p>

          <Link
            to="/properties"
            className="mt-6 inline-flex rounded-lg bg-navy-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    );
  }

  const images = [
    ...(property.image ? [property.image] : []),
    ...(Array.isArray(property.images) ? property.images : []),
  ].filter((image, index, array) => image && array.indexOf(image) === index);

  const title = property.title || "Untitled Property";
  const location =
    property.location || property.address || "Location not specified";
  const description =
    property.description || "No description has been provided yet.";
  const propertyType = property.propertyType || property.type || "Property";
  const purpose = property.purpose || property.listingType || "";

  const bedrooms = property.bedrooms;
  const bathrooms = property.bathrooms;
  const area = property.area;
  const areaUnit = property.areaUnit || "sq ft";

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-navy-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Back navigation */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-amber-700"
        >
          <span aria-hidden="true">←</span>
          Back to Properties
        </Link>

        {/* Heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-600">
              Property Details
            </p>

            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 flex items-start gap-2 text-sm text-stone-500 sm:text-base">
              <span aria-hidden="true">⌖</span>
              {location}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-stone-500">Asking Price</p>
            <p className="mt-1 text-2xl font-semibold text-amber-700 sm:text-3xl">
              {formatPrice(property.price)}
            </p>
          </div>
        </section>

        {/* Main Image */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <img
            src={selectedImage}
            alt={title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://placehold.co/1200x700?text=Property";
            }}
            className="h-72 w-full object-cover sm:h-[480px] lg:h-[560px]"
          />

          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3 p-3 sm:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View property image ${index + 1}`}
                  aria-pressed={selectedImage === image}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    selectedImage === image
                      ? "border-amber-500"
                      : "border-transparent hover:border-stone-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className="h-20 w-full object-cover sm:h-24"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Property Facts */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Property Type",
              value: propertyType,
              icon: "⌂",
            },
            {
              label: "Bedrooms",
              value: bedrooms ?? "N/A",
              icon: "🛏",
            },
            {
              label: "Bathrooms",
              value: bathrooms ?? "N/A",
              icon: "◈",
            },
            {
              label: "Area",
              value: area != null ? `${area} ${areaUnit}` : "N/A",
              icon: "▦",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <span className="text-xl text-amber-600">{item.icon}</span>

              <p className="mt-3 text-sm text-stone-500">{item.label}</p>

              <p className="mt-1 break-words font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Description and Contact */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-2">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-600">
              About this property
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Property Overview
            </h2>

            <p className="mt-5 whitespace-pre-line text-sm leading-8 text-stone-600 sm:text-base">
              {description}
            </p>

            <div className="mt-8 border-t border-stone-100 pt-5">
              <h3 className="font-semibold">Property Information</h3>

              <dl className="mt-4 divide-y divide-stone-100">
                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-stone-500">Listing Type</dt>
                  <dd className="text-right font-medium">
                    {purpose || "Not specified"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-stone-500">Location</dt>
                  <dd className="max-w-[60%] text-right font-medium">
                    {location}
                  </dd>
                </div>

                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-stone-500">Price</dt>
                  <dd className="text-right font-medium">
                    {formatPrice(property.price)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Inquiry Card */}
          {/* <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-amber-600">
              Interested?
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Make this property yours.
            </h2>

            <p className="mt-3 text-sm leading-6 text-stone-500">
              Contact our team to learn more about this listing or arrange a
              viewing.
            </p>

            {property.contactEmail ? (
              <a
                href={`mailto:${property.contactEmail}?subject=${encodeURIComponent(
                  `Inquiry about ${title}`
                )}`}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Email About Property
              </a>
            ) : (
              <Link
                to="/contact"
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Contact Us
              </Link>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-stone-400">
              Please mention this property when contacting us.
            </p>
          </aside> */}
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col justify-between gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-stone-500">
            Looking for something different?
          </p>

          <Link
            to="/properties"
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-5 py-3 text-sm font-medium transition hover:border-amber-400 hover:bg-amber-50"
          >
            Explore More Properties →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetails;
