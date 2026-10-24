import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {user} = useAuth();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   setProfile((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   setIsEditing(false);

  //   // TODO: Save profile using /auth/profile API
  // };

  const initials = user.username
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const inputClass =
    "w-full rounded-sm border border-cream-200 bg-cream-50 px-3 py-2.5 text-sm text-navy-950 outline-none transition-colors placeholder:text-navy-950/40 focus:border-amber-500";

  const labelClass =
    "mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-950/55";

  const Detail = ({ label, value }) => (
    <div>
      <p className={labelClass}>{label}</p>
      <p className="break-words text-sm font-medium text-navy-950">
        {value || "Not provided"}
      </p>
    </div>
  );

  return (
    <div className="min-h-full bg-cream-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-600">
            Account
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
                Profile<span className="text-amber-500">.</span>
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-navy-950/60">
                Manage your personal information and account details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-sm border border-navy-950 bg-navy-950 px-4 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-800"
            >
              {isEditing ? "Cancel editing" : "Edit profile"}
            </button>
          </div>
        </div>

        {/* Profile overview */}
        <section className="mb-6 overflow-hidden pt-20 rounded-sm border border-cream-200 bg-white">

          <div className="px-5 pb-5 sm:px-7 sm:pb-7">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-sm border-4 border-white bg-amber-500 text-2xl font-semibold text-navy-950 sm:h-24 sm:w-24 sm:text-3xl">
                  {initials || "U"}
                </div>

                <div className="min-w-0 pb-1">
                  <h2 className="break-words text-xl font-semibold text-navy-950 sm:text-2xl">
                    {user.username || "Your name"}
                  </h2>
                  <p className="mt-1 break-all text-sm text-navy-950/60">
                    {user.email || "example@gmail.com"}
                  </p>
                </div>
              </div>

              <span className="mb-1 inline-flex w-fit items-center gap-2 rounded-sm border border-cream-200 bg-cream-50 px-3 py-1.5 text-xs font-medium text-navy-950/75">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                
              </span>
            </div>

            <div className="mt-6 border-t border-cream-200 pt-5">
              <p className="text-xs leading-5 text-navy-950/55">
                Your account information and personal details, all in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Personal information */}
        <section className="mb-6 rounded-sm border border-cream-200 bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy-950">
                Personal information
              </h2>
              <p className="mt-1 text-sm text-navy-950/55">
                Your basic account details.
              </p>
            </div>

            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-amber-600">
              Personal
            </span>
          </div>

          <form>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="fullName">
                  Full name
                </label>
                {isEditing ? (
                  <input
                    id="fullName"
                    name="fullName"
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                    required
                  />
                ) : (
                  <Detail label="" value={user.username} />
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="email">
                  Email address
                </label>
                {isEditing ? (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your email"
                    required
                  />
                ) : (
                  <Detail label="" value={user.email} />
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone number
                </label>
                {isEditing ? (
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <Detail label="" value={user.email} />
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="location">
                  Location
                </label>
                {isEditing ? (
                  <input
                    id="location"
                    name="location"
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="City, State"
                  />
                ) : (
                  <Detail label="" value={user.email} />
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-cream-200 pt-5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-sm border border-cream-200 px-4 py-2.5 text-sm font-medium text-navy-950 transition-colors hover:bg-cream-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-sm bg-navy-950 px-5 py-2.5 text-sm font-medium text-amber-500 transition-colors hover:bg-navy-800"
                >
                  Save changes
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
