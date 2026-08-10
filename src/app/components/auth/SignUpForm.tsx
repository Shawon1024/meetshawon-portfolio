"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";

const COUNTRY_CODES = [
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { country: "Canada", code: "+1", flag: "🇨🇦" },
  { country: "China", code: "+86", flag: "🇨🇳" },
  { country: "Denmark", code: "+45", flag: "🇩🇰" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "India", code: "+91", flag: "🇮🇳" },
  { country: "Ireland", code: "+353", flag: "🇮🇪" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Japan", code: "+81", flag: "🇯🇵" },
  { country: "Malaysia", code: "+60", flag: "🇲🇾" },
  { country: "Netherlands", code: "+31", flag: "🇳🇱" },
  { country: "Norway", code: "+47", flag: "🇳🇴" },
  { country: "Pakistan", code: "+92", flag: "🇵🇰" },
  { country: "Qatar", code: "+974", flag: "🇶🇦" },
  { country: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "South Korea", code: "+82", flag: "🇰🇷" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Sweden", code: "+46", flag: "🇸🇪" },
  { country: "Switzerland", code: "+41", flag: "🇨🇭" },
  { country: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "United States", code: "+1", flag: "🇺🇸" },
];

export default function SignUpForm() {
  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    countryCode,
    setCountryCode,
  ] = useState("+44");

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanUsername =
      username
        .trim()
        .toLowerCase();

    const cleanEmail =
      email.trim();

    const cleanPhone =
      phoneNumber.trim();

    // --------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please complete all required fields.",
      );

      return;
    }

    // --------------------------------------------------
    // NAME VALIDATION
    // --------------------------------------------------

    if (
      cleanFirstName.length >
      60
    ) {
      setError(
        "First name must be 60 characters or fewer.",
      );

      return;
    }

    if (
      cleanLastName.length >
      60
    ) {
      setError(
        "Last name must be 60 characters or fewer.",
      );

      return;
    }

    // --------------------------------------------------
    // USERNAME VALIDATION
    // --------------------------------------------------

    if (
      !/^[a-z0-9._]{3,30}$/.test(
        cleanUsername,
      )
    ) {
      setError(
        "Username must be 3–30 characters and can only contain lowercase letters, numbers, dots, and underscores.",
      );

      return;
    }

    // --------------------------------------------------
    // PASSWORD VALIDATION
    // --------------------------------------------------

    if (
      password.length <
      8
    ) {
      setError(
        "Your password must contain at least 8 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match.",
      );

      return;
    }

    // --------------------------------------------------
    // PHONE VALIDATION
    // --------------------------------------------------

    if (
      cleanPhone &&
      !/^[0-9 ()-]{5,25}$/.test(
        cleanPhone,
      )
    ) {
      setError(
        "Please enter a valid contact number.",
      );

      return;
    }

    const displayName =
      `${cleanFirstName} ${cleanLastName}`;

    try {
      setSubmitting(
        true,
      );

      const supabase =
        createClient();

      const {
        error:
          signUpError,
      } =
        await supabase.auth.signUp({
          email:
            cleanEmail,

          password,

          options: {
            data: {
              first_name:
                cleanFirstName,

              last_name:
                cleanLastName,

              display_name:
                displayName,

              username:
                cleanUsername,

              phone_country_code:
                cleanPhone
                  ? countryCode
                  : null,

              phone_number:
                cleanPhone ||
                null,
            },
          },
        });

      if (
        signUpError
      ) {
        throw signUpError;
      }

      setMessage(
        "Account created. Check your email and confirm your account before signing in.",
      );

      // --------------------------------------------------
      // RESET
      // --------------------------------------------------

      setFirstName(
        "",
      );

      setLastName(
        "",
      );

      setUsername(
        "",
      );

      setEmail(
        "",
      );

      setCountryCode(
        "+44",
      );

      setPhoneNumber(
        "",
      );

      setPassword(
        "",
      );

      setConfirmPassword(
        "",
      );
    } catch (
      error
    ) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "";

      const lowerMessage =
        errorMessage.toLowerCase();

      if (
        lowerMessage.includes(
          "username",
        ) &&
        (
          lowerMessage.includes(
            "duplicate",
          ) ||
          lowerMessage.includes(
            "unique",
          ) ||
          lowerMessage.includes(
            "already",
          )
        )
      ) {
        setError(
          "That username is already taken. Please choose another one.",
        );
      } else if (
        lowerMessage.includes(
          "database error saving new user",
        )
      ) {
        setError(
          "Your account could not be created. The username may already be taken. Please choose another username and try again.",
        );
      } else {
        setError(
          errorMessage ||
            "Your account could not be created.",
        );
      }
    } finally {
      setSubmitting(
        false,
      );
    }
  };

  // --------------------------------------------------
  // STYLES
  // --------------------------------------------------

  const inputStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  const selectStyles =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition focus:border-green-400 disabled:cursor-not-allowed disabled:opacity-60";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-6 shadow-xl md:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
        Create Account
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">
        Join the community
      </h1>

      <p className="mt-4 leading-7 text-gray-400">
        Create an account to comment on articles, react to posts, and manage
        your public profile.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-6"
      >
        {/* =================================================
            NAME
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-300">
            First name
            <span className="ml-1 text-red-400">
              *
            </span>

            <input
              type="text"
              value={
                firstName
              }
              onChange={(
                event,
              ) =>
                setFirstName(
                  event.target
                    .value,
                )
              }
              className={
                inputStyles
              }
              placeholder="First name"
              autoComplete="given-name"
              maxLength={
                60
              }
              disabled={
                submitting
              }
              required
            />
          </label>

          <label className="block text-sm font-medium text-gray-300">
            Last name
            <span className="ml-1 text-red-400">
              *
            </span>

            <input
              type="text"
              value={
                lastName
              }
              onChange={(
                event,
              ) =>
                setLastName(
                  event.target
                    .value,
                )
              }
              className={
                inputStyles
              }
              placeholder="Last name"
              autoComplete="family-name"
              maxLength={
                60
              }
              disabled={
                submitting
              }
              required
            />
          </label>
        </div>

        {/* =================================================
            USERNAME
        ================================================= */}

        <label className="block text-sm font-medium text-gray-300">
          Username
          <span className="ml-1 text-red-400">
            *
          </span>

          <input
            type="text"
            value={
              username
            }
            onChange={(
              event,
            ) => {
              const nextUsername =
                event.target.value
                  .toLowerCase()
                  .replace(
                    /[^a-z0-9._]/g,
                    "",
                  );

              setUsername(
                nextUsername,
              );
            }}
            className={
              inputStyles
            }
            placeholder="your.username"
            autoComplete="username"
            minLength={
              3
            }
            maxLength={
              30
            }
            disabled={
              submitting
            }
            required
          />

          <span className="mt-2 block text-xs leading-5 text-gray-500">
            3–30 characters. Lowercase letters, numbers, dots, and underscores
            only. Your username is used in your public profile URL and cannot
            be changed later.
          </span>
        </label>

        {/* =================================================
            EMAIL
        ================================================= */}

        <label className="block text-sm font-medium text-gray-300">
          Email
          <span className="ml-1 text-red-400">
            *
          </span>

          <input
            type="email"
            value={
              email
            }
            onChange={(
              event,
            ) =>
              setEmail(
                event.target
                  .value,
              )
            }
            className={
              inputStyles
            }
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={
              254
            }
            disabled={
              submitting
            }
            required
          />

          <span className="mt-2 block text-xs leading-5 text-gray-500">
            We&apos;ll send a verification link to this address.
          </span>
        </label>

        {/* =================================================
            CONTACT NUMBER
        ================================================= */}

        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300">
              Contact number
            </p>

            <span className="text-xs text-gray-500">
              Optional
            </span>
          </div>

          <div className="mt-2 grid gap-3 sm:grid-cols-[100px_1fr]">
            <label className="block">
              <span className="sr-only">
                Country calling code
              </span>

              <select
                value={
                  countryCode
                }
                onChange={(
                  event,
                ) =>
                  setCountryCode(
                    event.target
                      .value,
                  )
                }
                className={
                  selectStyles
                }
                disabled={
                  submitting
                }
                aria-label="Country calling code"
              >
{COUNTRY_CODES.map(
  (
    item,
  ) => (
    <option
      key={`${item.country}-${item.code}`}
      value={
        item.code
      }
      className="bg-[#102A2A] text-white"
    >
      {item.flag}{" "}
      {item.country}{" "}
      ({item.code})
    </option>
  ),
)}
              </select>
            </label>

            <label className="block">
              <span className="sr-only">
                Contact number
              </span>

              <input
                type="tel"
                value={
                  phoneNumber
                }
                onChange={(
                  event,
                ) =>
                  setPhoneNumber(
                    event.target
                      .value,
                  )
                }
                className={
                  inputStyles
                }
                placeholder="Contact number"
                autoComplete="tel-national"
                maxLength={
                  25
                }
                disabled={
                  submitting
                }
              />
            </label>
          </div>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Optional. You can add or update this later from your profile.
          </p>
        </div>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <label className="block text-sm font-medium text-gray-300">
          Password
          <span className="ml-1 text-red-400">
            *
          </span>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={
                password
              }
              onChange={(
                event,
              ) =>
                setPassword(
                  event.target
                    .value,
                )
              }
              className={`${inputStyles} pr-12`}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={
                8
              }
              disabled={
                submitting
              }
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
              disabled={
                submitting
              }
              className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff
                  size={
                    18
                  }
                />
              ) : (
                <Eye
                  size={
                    18
                  }
                />
              )}
            </button>
          </div>
        </label>

        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

        <label className="block text-sm font-medium text-gray-300">
          Re-enter password
          <span className="ml-1 text-red-400">
            *
          </span>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={
                confirmPassword
              }
              onChange={(
                event,
              ) =>
                setConfirmPassword(
                  event.target
                    .value,
                )
              }
              className={`${inputStyles} pr-12`}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={
                8
              }
              disabled={
                submitting
              }
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
              disabled={
                submitting
              }
              className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={
                    18
                  }
                />
              ) : (
                <Eye
                  size={
                    18
                  }
                />
              )}
            </button>
          </div>

          {confirmPassword &&
            password !==
              confirmPassword && (
              <span className="mt-2 block text-xs text-red-300">
                Passwords do not match.
              </span>
            )}
        </label>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
          >
            {
              error
            }
          </p>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <p
            role="status"
            className="rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm leading-6 text-green-300"
          >
            {
              message
            }
          </p>
        )}

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          disabled={
            submitting
          }
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Creating account..."
            : "Create Account"}

          <UserPlus
            size={
              18
            }
          />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-green-400 transition hover:text-green-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}