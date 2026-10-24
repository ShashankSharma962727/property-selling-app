
import { Link } from "react-router-dom";

const formatPrice = (price, purpose) => {
  if (purpose === "Rent") {
    return `₹${new Intl.NumberFormat("en-IN").format(price)}/mo`;
  }

  if (price >= 10000000) {
    return `₹${(price / 10000000).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Cr`;
  }

  return `₹${(price / 100000).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })} Lac`;
};

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    location,
    price,
    beds,
    baths,
    area,
    type,
    purpose,
    image,
    featured,
  } = property;

  return (
    <article className="group overflow-hidden border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        to={`/properties/${id}`}
        className="relative block overflow-hidden"
        aria-label={`View ${title}`}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-52 w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 bg-cream-50 px-3 py-1.5 text-[10px] uppercase tracking-widest text-navy-950">
          {purpose === "Sale" ? "For sale" : "For rent"}
        </span>

        {featured && (
          <span className="absolute right-3 top-3 bg-amber-500 px-3 py-1.5 text-[10px] uppercase tracking-widest text-navy-950">
            Featured
          </span>
        )}

        <span className="absolute bottom-3 right-3 bg-navy-950/90 px-3 py-2 font-serif text-lg text-cream-50">
          {formatPrice(price, purpose)}
        </span>
      </Link>

      <div className="p-4 sm:p-5">
        <p className="text-xs text-stone-500">{location}</p>

        <h3 className="mt-2 font-serif text-xl leading-snug transition group-hover:text-amber-700">
          {title}
        </h3>

        <p className="mt-2 text-xs text-stone-500">{type}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-y border-stone-200 py-3 text-xs text-stone-600">
          {beds > 0 && <span>{beds} Beds</span>}
          {baths > 0 && <span>{baths} Baths</span>}
          <span>{area.toLocaleString("en-IN")} sq. ft.</span>
        </div>

        <Link
          to={`/properties/${id}`}
          className="mt-4 flex items-center justify-between text-sm"
        >
          <span className="text-stone-500">View property</span>
          <span className="text-amber-700 transition group-hover:translate-x-1">
            Explore →
          </span>
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;
