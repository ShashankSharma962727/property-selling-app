
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../API/api";
import { useAuth } from "../Context/AuthContext";

const activities = [
  {
    title: "New inquiry received",
    description: "Someone may be interested in your property.",
    time: "Recent activity",
    icon: "✉",
  },
  {
    title: "Keep your listings updated",
    description: "Accurate details help potential buyers.",
    time: "Tip",
    icon: "👁",
  },
  {
    title: "Improve your property listings",
    description: "Add high-quality images and complete details.",
    time: "Tip",
    icon: "↻",
  },
];

const statusStyles = {
  Published: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Draft: "bg-stone-100 text-stone-600",
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price not specified";
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

const getPropertyStatus = (property) => {
  const status = String(property.status || "Pending").toLowerCase();

  if (status === "published" || status === "approved") {
    return "Published";
  }

  if (status === "draft") {
    return "Draft";
  }

  return "Pending";
};

export default function Dashboard() {
  const { token } = useAuth();

  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      if (!token) {
        setRecentListings([]);
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/v1/property/my-properties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        const properties = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
            ? data.properties
            : Array.isArray(data?.data?.properties)
              ? data.data.properties
              : [];

        if (active) {
          setRecentListings(properties);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load your properties. Please try again."
          );
          setRecentListings([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [token]);

  const totalListings = recentListings.length;

  const publishedListings = recentListings.filter(
    (property) => getPropertyStatus(property) === "Published"
  ).length;

  const pendingListings = recentListings.filter(
    (property) => getPropertyStatus(property) === "Pending"
  ).length;

  const stats = [
    {
      title: "Total Listings",
      value: loading ? "..." : totalListings,
      icon: "🏠",
      note: "All your properties",
    },
    {
      title: "Published",
      value: loading ? "..." : publishedListings,
      icon: "✓",
      note: "Live on website",
    },
    {
      title: "Pending",
      value: loading ? "..." : pendingListings,
      icon: "◷",
      note: "Awaiting approval",
    },
    {
      title: "Drafts",
      value: loading
        ? "..."
        : recentListings.filter(
            (property) => getPropertyStatus(property) === "Draft"
          ).length,
      icon: "✎",
      note: "Unpublished listings",
    },
  ];

  const listingsToShow = [...recentListings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 text-navy-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-600">
              Seller Dashboard
            </p>

            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage your properties and keep track of their performance.
            </p>
          </div>

          <Link
            to="/dashboard/properties/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-navy-800"
          >
            <span className="text-lg">+</span>
            Add New Property
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="self-start font-semibold underline sm:self-auto"
            >
              Reload page
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">{stat.title}</p>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-700">
                  {stat.icon}
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-semibold">{stat.value}</h2>

              <p className="mt-1 text-xs text-stone-400">{stat.note}</p>
            </div>
          ))}
        </div>

        {/* Listings and Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Listings */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold">
                  Recent Listings
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  A quick look at your properties.
                </p>
              </div>

              <Link
                to="/dashboard/listings"
                className="whitespace-nowrap text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4" aria-live="polite">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse gap-4 rounded-xl border border-stone-100 p-3"
                  >
                    <div className="h-24 w-32 rounded-lg bg-stone-200" />
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 w-1/3 rounded bg-stone-200" />
                      <div className="h-3 w-2/3 rounded bg-stone-200" />
                      <div className="h-4 w-1/4 rounded bg-stone-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !error && listingsToShow.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 px-5 py-12 text-center">
                <p className="text-3xl">🏠</p>
                <h3 className="mt-3 font-semibold">No properties yet</h3>
                <p className="mt-1 text-sm text-stone-500">
                  Add your first property to get started.
                </p>

                <Link
                  to="/dashboard/properties/new"
                  className="mt-5 inline-flex rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
                >
                  Add Property
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listingsToShow.map((property, index) => {
                  const propertyId = property.id ?? property._id;
                  const status = getPropertyStatus(property);

                  return (
                    <div
                      key={propertyId ?? `${property.title}-${index}`}
                      className="flex flex-col gap-4 rounded-xl border border-stone-100 p-3 transition hover:border-stone-200 sm:flex-row sm:items-center"
                    >
                      <img
                        src={
                          property.image ||
                          property.images?.[0] ||
                          "https://placehold.co/400x300?text=Property"
                        }
                        alt={property.title || "Property"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/400x300?text=Property";
                        }}
                        className="h-44 w-full rounded-lg object-cover sm:h-24 sm:w-32"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              statusStyles[status]
                            }`}
                          >
                            {status}
                          </span>

                          <span className="text-xs text-stone-400">
                            {property.views ?? 0} views
                          </span>
                        </div>

                        <h3 className="font-semibold">
                          {property.title || "Untitled Property"}
                        </h3>

                        <p className="mt-1 text-sm text-stone-500">
                          {property.location ||
                            property.address ||
                            "Location not specified"}
                        </p>

                        <p className="mt-2 font-semibold text-amber-700">
                          {formatPrice(property.price)}
                        </p>
                      </div>

                      {propertyId && (
                        <Link
                          to={`/dashboard/properties/${propertyId}/edit`}
                          className="shrink-0 rounded-lg border border-stone-200 px-4 py-2 text-center text-sm font-medium transition hover:bg-stone-50"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Link
              to="/dashboard/listings"
              className="mt-5 flex w-full items-center justify-center rounded-lg bg-stone-50 px-4 py-3 text-sm font-medium text-navy-950 transition hover:bg-stone-100"
            >
              Manage All Listings
            </Link>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl font-semibold">Quick Actions</h2>

            <p className="mt-1 text-sm text-stone-500">
              Get things done faster.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/dashboard/properties/new"
                className="flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl text-amber-800">
                  +
                </span>

                <div>
                  <p className="font-medium">Add Property</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Create a new listing
                  </p>
                </div>
              </Link>

              <Link
                to="/dashboard/listings"
                className="flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-xl">
                  🏠
                </span>

                <div>
                  <p className="font-medium">My Listings</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Manage your properties
                  </p>
                </div>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-xl">
                  ↗
                </span>

                <div>
                  <p className="font-medium">Browse Website</p>
                  <p className="mt-1 text-xs text-stone-500">
                    View public properties
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Tips and updates for managing your listings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {activities.map((activity) => (
              <div key={activity.title} className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-700">
                  {activity.icon}
                </span>

                <div>
                  <h3 className="text-sm font-semibold">{activity.title}</h3>

                  <p className="mt-1 text-sm leading-6 text-stone-500">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs text-stone-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tip */}
        <div className="flex flex-col gap-4 rounded-2xl bg-navy-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-amber-400">A LITTLE TIP</p>

            <h2 className="mt-2 font-serif text-2xl">
              Make your listings stand out.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-300">
              High-quality photos and complete property details can help
              potential buyers discover your property.
            </p>
          </div>

          <Link
            to="/dashboard/listings"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-amber-400"
          >
            Improve Listings →
          </Link>
        </div>
      </div>
    </div>
  );
}
