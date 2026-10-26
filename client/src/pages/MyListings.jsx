import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../API/api";
import { useAuth } from "../Context/AuthContext";

const statusStyles = {
  Published: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Draft: "bg-stone-100 text-stone-600",
};

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchListing = async () => {
      if (!token) {
        setError("Please log in to view your properties.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/v1/property/my-properties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res?.data?.success) {
          throw new Error(
            res?.data?.message || "Failed to fetch your properties.",
          );
        }

        const properties = res?.data?.properties;
        console.log(properties);

        if (!Array.isArray(properties)) {
          throw new Error("Invalid properties data received from server.");
        }

        if (isMounted) {
          setListings(properties);
        }
      } catch (err) {
        console.error("Fetch listings error:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Something went wrong while loading your properties.",
          );
          setListings([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchListing();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/api/v1/property/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Property deleted.");
      window.location.reload();
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-navy-950">Your Properties</h2>

          <span className="text-sm text-stone-500">
            {listings.length} listings
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-stone-500" role="status">
            Loading your properties...
          </div>
        ) : error ? (
          <div
            className="border border-red-200 bg-red-50 px-6 py-8 text-center"
            role="alert"
          >
            <p className="font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => {
                // Reload the page to retry the API request.
                window.location.reload();
              }}
              className="mt-4 bg-navy-950 px-5 py-3 text-sm text-white hover:bg-amber-500 hover:text-navy-950"
            >
              Try Again
            </button>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((property) => (
              <article
                key={property._id}
                className="overflow-hidden border border-stone-200 bg-white transition hover:border-amber-400"
              >
                <div className="relative h-56">
                  <img
                    src={property.image || "/placeholder-property.jpg"}
                    alt={property.title || "Property"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder-property.jpg";
                    }}
                  />

                  <span
                    className={`absolute left-4 top-4 px-3 py-1.5 text-xs ${
                      statusStyles[property.status] ||
                      "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {property.status || "Unknown"}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-amber-700">
                    {property.type || "Property"} · For{" "}
                    {property.purpose || "N/A"}
                  </p>

                  <h3 className="mt-2 font-serif text-xl text-navy-950">
                    {property.title || "Untitled Property"}
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    {property.address || "Location not provided"}
                  </p>

                  <p className="mt-3 text-sm font-medium text-navy-950">
                    {property.price ?? "Price not available"}
                  </p>

                  <div className="mt-5 border-t border-stone-100 pt-4">
                    <p className="text-sm text-stone-500">
                      <span className="font-medium text-navy-950">
                        {property.views ?? 0}
                      </span>{" "}
                      property views
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <Link
                      to={`/properties/${property.id}`}
                      className="text-sm text-amber-700 underline underline-offset-4 hover:text-navy-950"
                    >
                      View Property
                    </Link>

                    <Link
                      to={`/dashboard/properties/${property._id}/edit`}
                      className="text-sm text-stone-600 hover:text-navy-950"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(property._id)}
                      className="text-sm text-stone-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-stone-200 bg-white px-6 py-16 text-center">
            <h3 className="font-serif text-2xl text-navy-950">
              No properties yet
            </h3>

            <p className="mt-3 text-sm text-stone-500">
              Add your first property to get started.
            </p>

            <Link
              to="/dashboard/add-property"
              className="mt-5 inline-block bg-navy-950 px-5 py-3 text-sm text-cream-50 transition hover:bg-amber-500 hover:text-navy-950"
            >
              Add Property
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyListings;
