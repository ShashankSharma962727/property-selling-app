
import { useState } from "react";
import { Link } from "react-router-dom";

const properties = [
  {
    id: 1,
    title: "The Willow Residence",
    location: "Gurugram, Haryana",
    price: "₹2.45 Cr",
    beds: 4,
    baths: 3,
    area: "2,450",
    type: "Villa",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85",
    tag: "Featured",
  },
  {
    id: 2,
    title: "The Ivory Apartment",
    location: "Noida, Uttar Pradesh",
    price: "₹95 Lac",
    beds: 3,
    baths: 2,
    area: "1,650",
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    tag: "Popular",
  },
  {
    id: 3,
    title: "The Oakwood Estate",
    location: "Jaipur, Rajasthan",
    price: "₹1.85 Cr",
    beds: 4,
    baths: 4,
    area: "3,100",
    type: "Villa",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85",
    tag: "New Listing",
  },
];

const categories = [
  {
    title: "Apartments",
    subtitle: "Modern city living",
    icon: "▥",
    type: "Apartment",
  },
  {
    title: "Independent Houses",
    subtitle: "Room to call your own",
    icon: "⌂",
    type: "House",
  },
  {
    title: "Luxury Villas",
    subtitle: "A little more extraordinary",
    icon: "◇",
    type: "Villa",
  },
  {
    title: "Residential Plots",
    subtitle: "Build your future",
    icon: "▦",
    type: "Plot",
  },
];

const Home = () => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All Properties");
  const [budget, setBudget] = useState("Any Budget");

  const searchProperties = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (propertyType !== "All Properties") {
      params.set("type", propertyType);
    }

    if (budget !== "Any Budget") {
      params.set("budget", budget);
    }

    const query = params.toString();
    window.location.href = `/properties${query ? `?${query}` : ""}`;
  };

  return (
    <div className="bg-cream-50 text-navy-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-cream-50">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=90"
            alt="Beautiful contemporary luxury home"
            className="h-full w-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-amber-500" />
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-500">
                A better way to find home
              </p>
            </div>

            <h1 className="font-serif text-5xl leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Find your next
              <br />
              <span className="italic text-amber-500">address.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-cream-50/75 sm:text-lg sm:leading-8">
              Discover thoughtfully selected homes, exceptional spaces, and
              places where your next chapter begins.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="#featured"
                className="inline-flex items-center gap-3 bg-amber-500 px-6 py-3.5 text-sm font-medium text-navy-950 transition hover:bg-amber-400"
              >
                Explore properties
                <span aria-hidden="true">↗</span>
              </a>

              <Link
                to="/properties"
                className="text-sm text-cream-50/85 underline decoration-cream-50/30 underline-offset-8 transition hover:text-amber-500"
              >
                View all listings
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-9 gap-y-5 border-t border-cream-50/15 pt-7">
              <div>
                <p className="font-serif text-2xl text-amber-500">Curated</p>
                <p className="mt-1 text-xs text-cream-50/60">
                  Property collections
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-amber-500">Personal</p>
                <p className="mt-1 text-xs text-cream-50/60">
                  Buying experience
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl text-amber-500">Distinct</p>
                <p className="mt-1 text-xs text-cream-50/60">
                  Places to belong
                </p>
              </div>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="w-full max-w-sm border border-cream-50/20 bg-navy-950/55 p-7 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
                The art of finding home
              </p>
              <p className="mt-5 font-serif text-3xl leading-snug">
                More than a property.
                <br />
                <span className="italic">A place to belong.</span>
              </p>
              <div className="my-6 h-px bg-cream-50/20" />
              <p className="text-sm leading-7 text-cream-50/70">
                From your first home to your forever home, find a space that
                feels unmistakably yours.
              </p>
              <a
                href="#categories"
                className="mt-6 inline-flex items-center gap-3 text-sm text-amber-500 hover:text-amber-400"
              >
                Find your kind of home <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden h-1 w-1/3 bg-amber-500 sm:block" />
      </section>

      {/* Property search */}
      <section className="relative z-10 mx-auto -mt-1 max-w-6xl px-4 pt-7 sm:px-6 lg:-mt-9 lg:pt-0">
        <div className="border border-stone-200 bg-white p-5 shadow-xl sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-serif text-xl">Find your place</p>
              <p className="mt-1 text-xs text-stone-500">
                A few details. A world of possibilities.
              </p>
            </div>
            <span className="hidden text-xs uppercase tracking-widest text-amber-600 sm:block">
              Property search
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-600">
                Preferred location
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProperties();
                }}
                placeholder="City, neighbourhood..."
                className="w-full border border-stone-200 bg-cream-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-600">
                Property type
              </span>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-3 py-3.5 text-sm outline-none focus:border-amber-500"
              >
                <option>All Properties</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Plot</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-stone-600">
                Budget
              </span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-stone-200 bg-cream-50 px-3 py-3.5 text-sm outline-none focus:border-amber-500"
              >
                <option>Any Budget</option>
                <option>Under 50 Lakhs</option>
                <option>50 Lakhs - 1 Cr</option>
                <option>1 Cr - 2 Cr</option>
                <option>Above 2 Cr</option>
              </select>
            </label>

            <button
              type="button"
              onClick={searchProperties}
              className="flex min-h-12 items-center justify-center gap-3 bg-navy-950 px-6 py-3 text-sm text-cream-50 transition hover:bg-amber-500 hover:text-navy-950 lg:mt-6"
            >
              Search <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-600">
              Explore collections
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              Find a place that fits.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-stone-600">
            Every lifestyle is different. Start with the kind of space that
            feels right for you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={`/properties?type=${encodeURIComponent(category.type)}`}
              className="group border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-amber-500/40 font-serif text-2xl text-amber-600 transition group-hover:bg-amber-500 group-hover:text-navy-950">
                {category.icon}
              </span>
              <h3 className="mt-7 font-serif text-xl">{category.title}</h3>
              <p className="mt-2 text-sm text-stone-500">
                {category.subtitle}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm text-navy-950 transition group-hover:text-amber-600">
                Explore <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section id="featured" className="bg-[#f3efe6] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-600">
                Handpicked for you
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                Homes worth discovering.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-stone-600">
                A considered collection of properties with character, comfort,
                and room for what comes next.
              </p>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-3 self-start border-b border-amber-500 pb-2 text-sm transition hover:text-amber-600 sm:self-auto"
            >
              View all properties <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <article
                key={property.id}
                className="group overflow-hidden border border-stone-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link
                  to={`/properties?search=${encodeURIComponent(property.title)}`}
                  className="relative block overflow-hidden"
                  aria-label={`Explore ${property.title}`}
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    loading="lazy"
                    className="h-60 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-64"
                  />
                  <span className="absolute left-4 top-4 bg-cream-50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-navy-950">
                    {property.tag}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-navy-950/90 px-3 py-2 font-serif text-lg text-cream-50">
                    {property.price}
                  </span>
                </Link>

                <div className="p-5 sm:p-6">
                  <p className="text-xs tracking-wide text-stone-500">
                    {property.location}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl transition group-hover:text-amber-600">
                    {property.title}
                  </h3>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-stone-200 py-4 text-xs text-stone-600">
                    <span>{property.beds} Bedrooms</span>
                    <span>{property.baths} Bathrooms</span>
                    <span>{property.area} sq. ft.</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-widest text-amber-600">
                      {property.type}
                    </span>
                    <Link
                      to={`/properties?search=${encodeURIComponent(property.title)}`}
                      className="text-sm text-navy-950 transition hover:text-amber-600"
                    >
                      Explore home →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-3 border border-navy-950 px-7 py-3.5 text-sm transition hover:bg-navy-950 hover:text-cream-50"
            >
              Discover all listings <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-28">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
            alt="Warm, thoughtfully designed living room"
            loading="lazy"
            className="h-[360px] w-full object-cover sm:h-[470px]"
          />
          <div className="absolute -bottom-5 right-4 border border-amber-500 bg-cream-50 px-5 py-4 sm:-right-5 sm:px-7">
            <p className="font-serif text-xl italic">A home of your own.</p>
            <p className="mt-1 text-xs text-stone-500">
              A feeling like no other.
            </p>
          </div>
        </div>

        <div className="pt-5 lg:pt-0">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-600">
            The Haven difference
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Real estate, with a more personal touch.
          </h2>
          <p className="mt-6 text-sm leading-7 text-stone-600 sm:text-base">
            Finding a home is about more than square footage and a location.
            It is about discovering the place where life happens. At Haven
            Estates, we make that journey feel more thoughtful, clear, and
            personal.
          </p>

          <div className="mt-8 space-y-6">
            {[
              {
                number: "01",
                title: "Thoughtfully selected",
                description:
                  "Explore a considered collection of homes for different lifestyles.",
              },
              {
                number: "02",
                title: "Clarity at every step",
                description:
                  "Compare spaces, understand your options, and make informed choices.",
              },
              {
                number: "03",
                title: "Your journey, your pace",
                description:
                  "Take your time finding a property that truly feels right.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="flex gap-5 border-b border-stone-200 pb-5"
              >
                <span className="font-serif text-xl text-amber-600">
                  {item.number}
                </span>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-3 bg-navy-950 px-6 py-3.5 text-sm text-cream-50 transition hover:bg-amber-500 hover:text-navy-950"
          >
            Begin your search <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy-950 px-4 py-16 text-cream-50 sm:px-6 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-500">
              Your next chapter starts here
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">
              Somewhere, your home is waiting.
            </h2>
            <p className="mt-4 text-sm leading-7 text-cream-50/65">
              Take the first step towards finding a place that feels like you.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex shrink-0 items-center gap-4 bg-amber-500 px-6 py-4 text-sm font-medium text-navy-950 transition hover:bg-amber-400"
          >
            Find your home <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
