
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/ui/PropertyCard";
import api from "../API/api";

const propertyTypes = ["All", "Villa", "Apartment", "House", "Plot"];
const purposes = ["All", "Sale", "Rent"];

const budgets = [
  { label: "Any Budget", value: "All" },
  { label: "Under ₹50 Lac", value: "5000000" },
  { label: "Under ₹1 Crore", value: "10000000" },
  { label: "Under ₹2 Crore", value: "20000000" },
  { label: "₹2 Crore+", value: "20000001" },
];

const Properties = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "All");
  const [type, setType] = useState(searchParams.get("type") || "All");
  const [budget, setBudget] = useState(searchParams.get("budget") || "All");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const getProperties = async () => {
      try {
        const res = await api.get("/api/v1/property/");
        const properties = res.data.properties || res.data.data?.properties || [];

        setAllProperties(
          properties.map((p) => ({
            ...p,
            id: p._id || p.id,
            title: p.title || p.name || "",
            location:
              typeof p.location === "string"
                ? p.location
                : p.location?.address || p.location?.city || "",
            price: Number(p.price || 0),
            purpose: p.purpose || p.listingType || "",
            type: p.type || p.propertyType || "",
            beds: Number(p.beds || p.bedrooms || 0),
            baths: Number(p.baths || p.bathrooms || 0),
            area: Number(p.area || p.areaSqFt || 0),
            image: p.image || p.images?.[0]?.url || p.images?.[0] || "",
          }))
        );
      } catch (err) {
        setError(err.response?.data?.message || "Properties load nahi ho paayin.");
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, []);

  let filteredProperties = allProperties.filter((p) => {
    return (
      (search === "" ||
        `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(search.toLowerCase())) &&
      (location === "" || p.location.toLowerCase().includes(location.toLowerCase())) &&
      (purpose === "All" || p.purpose.toLowerCase() === purpose.toLowerCase()) &&
      (type === "All" || p.type.toLowerCase() === type.toLowerCase()) &&
      (budget === "All" ||
        (budget === "20000001"
          ? p.price >= 20000000
          : p.price <= Number(budget))) &&
      (bedrooms === "All" || p.beds >= Number(bedrooms))
    );
  });

  if (sortBy === "price-low") {
    filteredProperties.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProperties.sort((a, b) => b.price - a.price);
  } else if (sortBy === "area") {
    filteredProperties.sort((a, b) => b.area - a.area);
  } else {
    filteredProperties.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setPurpose("All");
    setType("All");
    setBudget("All");
    setBedrooms("All");
    setSortBy("featured");
    setSearchParams({});
  };

  const updateUrl = () => {
    const params = {};

    if (search.trim()) params.search = search.trim();
    if (location.trim()) params.location = location.trim();
    if (purpose !== "All") params.purpose = purpose;
    if (type !== "All") params.type = type;
    if (budget !== "All") params.budget = budget;
    if (bedrooms !== "All") params.bedrooms = bedrooms;

    setSearchParams(params);
  };

  const activeFilters = [
    search.trim(),
    location.trim(),
    purpose !== "All" ? purpose : "",
    type !== "All" ? type : "",
    budget !== "All" ? budget : "",
    bedrooms !== "All" ? bedrooms : "",
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen mt-10 bg-cream-50">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-6 max-w-7xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUrl();
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="sm:col-span-2">
              <label htmlFor="property-search">Search properties</label>
              <input
                id="property-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Property name, location..."
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label htmlFor="property-location">Location</label>
              <input
                id="property-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Civil Lines"
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label htmlFor="property-purpose">Listing type</label>
              <select
                id="property-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm"
              >
                {purposes.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "Buy or Rent" : item === "Sale" ? "For Sale" : "For Rent"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="property-type">Property type</label>
              <select
                id="property-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm"
              >
                {propertyTypes.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Property Types" : item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="property-budget">Maximum budget</label>
              <select
                id="property-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm"
              >
                {budgets.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="property-bedrooms">Bedrooms</label>
              <select
                id="property-bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm"
              >
                <option value="All">Any Bedrooms</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+ Bedrooms</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-4">
              <button type="submit" className="bg-navy-950 px-6 py-3 text-sm text-white">
                Search Properties
              </button>
              <button type="button" onClick={clearFilters} className="px-4 py-3 text-sm">
                Reset filters
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700">
              Haven Estates collection
            </p>
            <h2 className="mt-2 font-serif text-3xl text-navy-950">
              Explore Properties
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              {loading ? "Loading properties..." : `${filteredProperties.length} properties found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-properties">Sort by</label>
            <select
              id="sort-properties"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-stone-200 bg-white px-3 py-2.5 text-sm"
            >
              <option value="featured">Featured first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area">Largest area</option>
            </select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs text-stone-500">Filters applied: {activeFilters}</span>
            <button onClick={clearFilters} className="text-xs text-amber-700 underline">
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center">Loading properties...</p>
        ) : error ? (
          <div className="py-16 text-center">
            <h3 className="text-2xl">Unable to load properties</h3>
            <p className="mt-3 text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 bg-navy-950 px-6 py-3 text-white">
              Retry
            </button>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-2xl">No properties found</h3>
            <p className="mt-3 text-stone-500">
              Try a different location or change your filters.
            </p>
            <button onClick={clearFilters} className="mt-6 bg-navy-950 px-6 py-3 text-white">
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Properties;
