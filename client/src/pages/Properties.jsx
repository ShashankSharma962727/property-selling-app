
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/ui/PropertyCard";

// Sample property data
// Baad mein is data ko API/backend se replace kar sakte ho.
const propertyData = [
  {
    id: 1,
    title: "The Grand Heritage Villa",
    location: "Civil Lines, Agra",
    price: 18500000,
    purpose: "Sale",
    type: "Villa",
    beds: 5,
    baths: 4,
    area: 4200,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Modern Skyline Apartment",
    location: "Taj Nagari, Agra",
    price: 8500000,
    purpose: "Sale",
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: 1850,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Serene Garden Residence",
    location: "Dayal Bagh, Agra",
    price: 12500000,
    purpose: "Sale",
    type: "House",
    beds: 4,
    baths: 3,
    area: 2800,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "The Minimalist Penthouse",
    location: "Sikandra, Agra",
    price: 22000000,
    purpose: "Sale",
    type: "Apartment",
    beds: 4,
    baths: 4,
    area: 3600,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    title: "Charming Family Home",
    location: "Shastripuram, Agra",
    price: 6500000,
    purpose: "Sale",
    type: "House",
    beds: 3,
    baths: 2,
    area: 1600,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    title: "Luxury Riverside Villa",
    location: "Taj Ganj, Agra",
    price: 35000000,
    purpose: "Sale",
    type: "Villa",
    beds: 6,
    baths: 5,
    area: 5200,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 7,
    title: "Elegant City Apartment",
    location: "Kamla Nagar, Agra",
    price: 28000,
    purpose: "Rent",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: 1250,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 8,
    title: "Contemporary Designer Home",
    location: "Fatehabad Road, Agra",
    price: 14500000,
    purpose: "Sale",
    type: "House",
    beds: 4,
    baths: 3,
    area: 3000,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 9,
    title: "Premium Residential Plot",
    location: "Shastripuram, Agra",
    price: 4500000,
    purpose: "Sale",
    type: "Plot",
    beds: 0,
    baths: 0,
    area: 1800,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 10,
    title: "Peaceful Garden Apartment",
    location: "Dayal Bagh, Agra",
    price: 22000,
    purpose: "Rent",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: 1100,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 11,
    title: "Classic Luxury Estate",
    location: "Civil Lines, Agra",
    price: 27500000,
    purpose: "Sale",
    type: "Villa",
    beds: 5,
    baths: 5,
    area: 4800,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 12,
    title: "Compact Urban Residence",
    location: "Sikandra, Agra",
    price: 5200000,
    purpose: "Sale",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: 1050,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
  },
];

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
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );
  const [purpose, setPurpose] = useState(
    searchParams.get("purpose") || "All"
  );
  const [type, setType] = useState(
    propertyTypes.includes(searchParams.get("type"))
      ? searchParams.get("type")
      : "All"
  );
  const [budget, setBudget] = useState(
    searchParams.get("budget") || "All"
  );
  const [bedrooms, setBedrooms] = useState(
    searchParams.get("bedrooms") || "All"
  );
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    let results = [...propertyData];

    const searchTerm = search.trim().toLowerCase();
    const locationTerm = location.trim().toLowerCase();

    if (searchTerm) {
      results = results.filter((property) =>
        `${property.title} ${property.location} ${property.type}`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    if (locationTerm) {
      results = results.filter((property) =>
        property.location.toLowerCase().includes(locationTerm)
      );
    }

    if (purpose !== "All") {
      results = results.filter(
        (property) => property.purpose === purpose
      );
    }

    if (type !== "All") {
      results = results.filter(
        (property) => property.type === type
      );
    }

    if (budget !== "All") {
      const maxBudget = Number(budget);

      if (budget === "20000001") {
        results = results.filter(
          (property) => property.price >= 20000000
        );
      } else {
        results = results.filter(
          (property) => property.price <= maxBudget
        );
      }
    }

    if (bedrooms !== "All") {
      results = results.filter(
        (property) => property.beds >= Number(bedrooms)
      );
    }

    if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "area") {
      results.sort((a, b) => b.area - a.area);
    } else {
      results.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return results;
  }, [search, location, purpose, type, budget, bedrooms, sortBy]);

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

  const activeFilters = [
    search,
    location,
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
            onSubmit={(event) => {
              event.preventDefault();
              updateUrl();
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="sm:col-span-2">
              <label
                htmlFor="property-search"
                className="mb-2 block text-xs uppercase tracking-widest text-stone-500"
              >
                Search properties
              </label>
              <input
                id="property-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Property name, location..."
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              />
            </div>

            <div>
              <label
                htmlFor="property-location"
                className="mb-2 block text-xs uppercase tracking-widest text-stone-500"
              >
                Location
              </label>
              <input
                id="property-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Civil Lines"
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
              />
            </div>

            <div>
              <label
                htmlFor="property-purpose"
                className="mb-2 block text-xs uppercase tracking-widest text-stone-500"
              >
                Listing type
              </label>
              <select
                id="property-purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                {purposes.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "Buy or Rent"
                      : item === "Sale"
                        ? "For Sale"
                        : "For Rent"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="property-type"
                className="mb-2 block text-xs uppercase tracking-widest text-stone-500"
              >
                Property type
              </label>
              <select
                id="property-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                {propertyTypes.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Property Types" : item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="property-budget"
                className="mb-2 block text-xs uppercase tracking-widest text-stone-500"
              >
                Maximum budget
              </label>
              <select
                id="property-budget"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                {budgets.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="property-bedrooms"
                className="mb-2 block text-xs uppercase tracking-widest text-stone-500"
              >
                Bedrooms
              </label>
              <select
                id="property-bedrooms"
                value={bedrooms}
                onChange={(event) => setBedrooms(event.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-amber-500"
              >
                <option value="All">Any Bedrooms</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="flex-1 bg-navy-950 px-6 py-3 text-sm text-cream-50 transition hover:bg-amber-500 hover:text-navy-950 sm:flex-none"
              >
                Search Properties
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-3 text-sm text-stone-600 transition hover:text-navy-950"
              >
                Reset filters
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section
        id="property-results"
        aria-label="Property listings"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700">
              Haven Estates collection
            </p>

            <h2 className="mt-2 font-serif text-3xl text-navy-950 sm:text-4xl">
              Explore Properties
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1
                ? "property"
                : "properties"}{" "}
              found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-properties"
              className="whitespace-nowrap text-sm text-stone-500"
            >
              Sort by
            </label>

            <select
              id="sort-properties"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-w-44 border border-stone-200 bg-white px-3 py-2.5 text-sm text-navy-950 outline-none focus:border-amber-500"
            >
              <option value="featured">Featured first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area">Largest area</option>
            </select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-xs text-stone-500">
              Filters applied: {activeFilters}
            </span>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-amber-700 underline underline-offset-4 hover:text-navy-950"
            >
              Clear all
            </button>
          </div>
        )}

        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="border border-stone-200 bg-white px-5 py-16 text-center sm:px-10">
            <span className="font-serif text-4xl text-amber-600">
              ⌂
            </span>

            <h3 className="mt-5 font-serif text-2xl text-navy-950">
              No properties found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-500">
              Try a different location or adjust your filters to
              discover more properties.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 bg-navy-950 px-6 py-3 text-sm text-cream-50 transition hover:bg-amber-500 hover:text-navy-950"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Properties;
