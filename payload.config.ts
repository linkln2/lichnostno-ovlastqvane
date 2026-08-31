import path from "path";
import { buildConfig, type Access } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import type { CollectionConfig, GlobalConfig } from "payload";

const isStaff: Access = ({ req }) => {
  return req.user?.collection === "staff";
};

const Staff: CollectionConfig = {
  slug: "staff",
  auth: true,
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: isStaff,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      options: ["owner", "admin", "editor"],
      defaultValue: "editor",
      required: true,
    },
  ],
};

const Customers: CollectionConfig = {
  slug: "customers",
  auth: true,
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: () => true,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "city", type: "text" },
    { name: "billingPrefs", type: "json" },
    {
      name: "stripeCustomerId",
      type: "text",
      admin: { readOnly: true },
    },
  ],
};

const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*", "application/pdf", "video/*"],
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};

const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea", localized: true },
    { name: "body", type: "richText", localized: true },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      type: "select",
      options: ["draft", "published", "scheduled"],
      defaultValue: "draft",
      required: true,
    },
    {
      name: "publishAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "visibility",
      type: "select",
      options: ["public", "members-only"],
      defaultValue: "public",
      required: true,
    },
    {
      name: "memberTierRequired",
      type: "relationship",
      relationTo: "subscription-tiers",
      hasMany: false,
      admin: {
        condition: (data) => data.visibility === "members-only",
      },
    },
    { name: "seoTitle", type: "text", localized: true },
    { name: "seoDescription", type: "textarea", localized: true },
    {
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true },
    },
  ],
};

const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "richText", localized: true },
    { name: "location", type: "text", localized: true },
    {
      name: "startsAt",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "endsAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "capacity",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "status",
      type: "select",
      options: ["upcoming", "past", "cancelled"],
      defaultValue: "upcoming",
      required: true,
    },
    {
      name: "packages",
      type: "relationship",
      relationTo: "event-packages",
      hasMany: true,
    },
    {
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: "coverUrl",
      type: "text",
      admin: { description: "Cover image URL (e.g. from Facebook or uploaded)" },
    },
    {
      name: "facebookUrl",
      type: "text",
      admin: { description: "Original Facebook event URL" },
    },
    {
      name: "facebookEventId",
      type: "text",
      admin: { description: "Facebook event ID (for import tracking)" },
    },
  ],
};

const EventPackages: CollectionConfig = {
  slug: "event-packages",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      hasMany: false,
      required: true,
    },
    { name: "name", type: "text", required: true, localized: true },
    {
      name: "priceCents",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "priceDisplay",
      type: "text",
      localized: true,
    },
    {
      name: "spots",
      type: "textarea",
      localized: true,
    },
    {
      name: "stripePriceId",
      type: "text",
      admin: { description: "Stripe Price ID for checkout (price_...). Leave empty until Stripe is configured." },
    },
    {
      name: "capacity",
      type: "number",
      min: 0,
    },
  ],
};

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "richText" },
    { name: "excerpt", type: "textarea" },
    {
      name: "priceCents",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "compareAtCents",
      type: "number",
      min: 0,
      admin: { description: "Original price for showing a discount" },
    },
    {
      name: "currency",
      type: "select",
      options: ["eur", "usd"],
      defaultValue: "eur",
    },
    {
      name: "sku",
      type: "text",
      admin: { description: "Stock keeping unit (optional)" },
    },
    {
      name: "category",
      type: "select",
      options: ["digital", "physical", "merchandise", "course", "bracelets", "crystals", "potions"],
      defaultValue: "digital",
    },
    {
      name: "productType",
      type: "select",
      options: ["digital", "physical"],
      defaultValue: "digital",
    },
    {
      name: "tags",
      type: "text",
      admin: { description: "Comma-separated tags, e.g. 'bestseller,new,limited'" },
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "downloadFile",
      type: "upload",
      relationTo: "media",
      admin: {
        condition: (data) => data.productType === "digital",
      },
    },
    {
      name: "inventory",
      type: "number",
      defaultValue: 0,
      admin: {
        condition: (data) => data.productType === "physical",
      },
    },
    {
      name: "lowStockThreshold",
      type: "number",
      defaultValue: 5,
      admin: { condition: (data) => data.productType === "physical" },
    },
    {
      name: "weightGrams",
      type: "number",
      admin: { condition: (data) => data.productType === "physical" },
    },
    {
      name: "status",
      type: "select",
      options: ["draft", "published", "archived"],
      defaultValue: "draft",
      required: true,
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Show on homepage / featured section" },
    },
    {
      name: "stripePriceId",
      type: "text",
      admin: { description: "Stripe Price ID for checkout (price_...)" },
    },
    {
      name: "seoTitle",
      type: "text",
    },
    {
      name: "seoDescription",
      type: "textarea",
    },
  ],
};

const SubscriptionTiers: CollectionConfig = {
  slug: "subscription-tiers",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "richText" },
    {
      name: "priceCents",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "interval",
      type: "select",
      options: ["month", "year"],
      required: true,
    },
    {
      name: "stripePriceId",
      type: "text",
      admin: { description: "Stripe Price ID for checkout (price_...). Leave empty until Stripe is configured." },
    },
    {
      name: "perks",
      type: "array",
      fields: [
        {
          name: "perk",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "content", type: "richText" },
    { name: "seoTitle", type: "text" },
    { name: "seoDescription", type: "textarea" },
  ],
};

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "id",
  },
  access: {
    create: isStaff,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
    },
    {
      name: "source",
      type: "select",
      options: ["shop", "event", "subscription"],
      admin: {
        description: "Where this order originated — used for revenue breakdown",
      },
    },
    {
      name: "stripeSessionId",
      type: "text",
      unique: true,
    },
    {
      name: "stripePaymentIntentId",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      options: ["pending", "paid", "refunded", "cancelled"],
      defaultValue: "pending",
      required: true,
    },
    {
      name: "totalCents",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "currency",
      type: "text",
      defaultValue: "eur",
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "type",
          type: "select",
          options: ["product", "event-ticket", "subscription"],
        },
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          hasMany: false,
        },
        {
          name: "eventPackage",
          type: "relationship",
          relationTo: "event-packages",
          hasMany: false,
        },
        {
          name: "subscriptionTier",
          type: "relationship",
          relationTo: "subscription-tiers",
          hasMany: false,
        },
        {
          name: "quantity",
          type: "number",
          defaultValue: 1,
          min: 1,
        },
        {
          name: "priceCents",
          type: "number",
          required: true,
          min: 0,
        },
      ],
    },
  ],
};

const Registrations: CollectionConfig = {
  slug: "registrations",
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: () => true,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
    },
    { name: "name", type: "text", required: true },
    { name: "email", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "city", type: "text" },
    { name: "notes", type: "textarea" },
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      hasMany: false,
      required: true,
    },
    {
      name: "eventPackage",
      type: "relationship",
      relationTo: "event-packages",
      hasMany: false,
    },
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      hasMany: false,
    },
    {
      name: "status",
      type: "select",
      options: ["pending", "confirmed", "checked_in", "waitlisted", "cancelled"],
      defaultValue: "pending",
      required: true,
    },
    {
      name: "qrToken",
      type: "text",
      unique: true,
    },
    {
      name: "locale",
      type: "text",
      defaultValue: "bg",
    },
  ],
};

const Subscriptions: CollectionConfig = {
  slug: "subscriptions",
  admin: {
    useAsTitle: "id",
  },
  access: {
    create: isStaff,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
    },
    {
      name: "email",
      type: "text",
      admin: {
        description: "Used for portal lookup without customer login",
      },
    },
    {
      name: "tier",
      type: "relationship",
      relationTo: "subscription-tiers",
      hasMany: false,
    },
    {
      name: "stripeSubscriptionId",
      type: "text",
      unique: true,
    },
    {
      name: "stripeCustomerId",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      options: ["active", "past_due", "cancelled", "incomplete", "trialing"],
      defaultValue: "incomplete",
      required: true,
    },
    {
      name: "currentPeriodStart",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "currentPeriodEnd",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "cancelAtPeriodEnd",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

const CheckIns: CollectionConfig = {
  slug: "check-ins",
  admin: {
    useAsTitle: "id",
  },
  access: {
    create: isStaff,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "registration",
      type: "relationship",
      relationTo: "registrations",
      hasMany: false,
      required: true,
    },
    {
      name: "staff",
      type: "relationship",
      relationTo: "staff",
      hasMany: false,
    },
    {
      name: "checkedInAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
  ],
};

const SocialStats: CollectionConfig = {
  slug: "social-stats",
  admin: {
    useAsTitle: "platform",
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: "platform",
      type: "select",
      options: ["facebook", "instagram", "tiktok", "youtube"],
      required: true,
      unique: true,
    },
    { name: "handle", type: "text" },
    { name: "followers", type: "number", defaultValue: 0 },
    { name: "posts", type: "number", defaultValue: 0 },
    { name: "engagementRate", type: "number", admin: { description: "As percentage, e.g. 5.2" } },
    {
      name: "lastUpdated",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};

// ─── Globals ─────────────────────────────────────────────────────
// Singletons — one per installation. The customer edits these from the
// dashboard "Website" tab to control homepage content without touching code.

const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  access: {
    read: () => true,
    update: isStaff,
  },
  fields: [
    // ─── Hero ───
    {
      type: "group",
      name: "hero",
      label: "Hero Section",
      fields: [
        { name: "title", type: "text", localized: true, required: true, admin: { description: "Main headline" } },
        { name: "subtitle", type: "textarea", localized: true, admin: { description: "Subheadline paragraph" } },
        { name: "primaryCtaText", type: "text", localized: true, defaultValue: "Explore" },
        { name: "primaryCtaHref", type: "text", defaultValue: "/shop" },
        { name: "secondaryCtaText", type: "text", localized: true, defaultValue: "Learn more" },
        { name: "secondaryCtaHref", type: "text", defaultValue: "/about" },
        { name: "showCountdown", type: "checkbox", defaultValue: false },
        { name: "showVideoFeed", type: "checkbox", defaultValue: true },
      ],
    },
    // ─── Mission / Introduction ───
    {
      type: "group",
      name: "mission",
      label: "Mission Section",
      fields: [
        { name: "title", type: "text", localized: true, defaultValue: "Мисия" },
        { name: "text", type: "textarea", localized: true, admin: { description: "Mission statement paragraph" } },
        { name: "enabled", type: "checkbox", defaultValue: true },
      ],
    },
    // ─── Values ───
    {
      type: "group",
      name: "values",
      label: "Values Section",
      fields: [
        { name: "title", type: "text", localized: true, defaultValue: "Ценности" },
        { name: "enabled", type: "checkbox", defaultValue: true },
        {
          name: "cards",
          type: "array",
          label: "Value Cards",
          fields: [
            { name: "title", type: "text", localized: true, required: true },
            { name: "description", type: "textarea", localized: true },
          ],
        },
      ],
    },
    // ─── Symbolism / Caduceus ───
    {
      type: "group",
      name: "symbolism",
      label: "Symbolism Section",
      fields: [
        { name: "title", type: "text", localized: true, defaultValue: "Символизъм" },
        { name: "enabled", type: "checkbox", defaultValue: true },
        {
          name: "cards",
          type: "array",
          label: "Symbolism Cards",
          fields: [
            { name: "title", type: "text", localized: true, required: true },
            { name: "description", type: "textarea", localized: true },
          ],
        },
      ],
    },
    // ─── Featured Products ───
    {
      type: "group",
      name: "productsSection",
      label: "Products Section",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "heading", type: "text", localized: true, defaultValue: "Магазин" },
        { name: "maxItems", type: "number", defaultValue: 8, admin: { description: "Max products to show" } },
      ],
    },
    // ─── Membership ───
    {
      type: "group",
      name: "membershipSection",
      label: "Membership Section",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "heading", type: "text", localized: true, defaultValue: "Членство" },
        { name: "description", type: "textarea", localized: true },
      ],
    },
    // ─── Testimonials ───
    {
      type: "group",
      name: "testimonialsSection",
      label: "Testimonials Section",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "heading", type: "text", localized: true, defaultValue: "Отзиви" },
      ],
    },
    // ─── Video Feed ───
    {
      type: "group",
      name: "videoSection",
      label: "Video Feed Section",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "heading", type: "text", localized: true, defaultValue: "Видео" },
      ],
    },
    // ─── Latest Articles ───
    {
      type: "group",
      name: "blogSection",
      label: "Latest Articles Section",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "heading", type: "text", localized: true, defaultValue: "Последни статии" },
        { name: "maxItems", type: "number", defaultValue: 3 },
      ],
    },
  ],
};

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // push: true auto-creates/syncs tables on startup. Safe for development
    // and small projects. Switch to explicit migrations before production scale.
    push: true,
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  sharp,
  localization: {
    defaultLocale: "bg",
    locales: [
      { label: "Bulgarian", code: "bg" },
      { label: "English", code: "en" },
    ],
    fallback: true,
  },
  admin: {
    user: "staff",
    meta: {
      titleSuffix: " — Admin",
    },
  },
  collections: [
    Staff,
    Customers,
    Media,
    BlogPosts,
    Events,
    EventPackages,
    Products,
    SubscriptionTiers,
    Pages,
    Orders,
    Registrations,
    Subscriptions,
    CheckIns,
    SocialStats,
  ],
  globals: [
    Homepage,
  ],
  typescript: {
    outputFile: path.resolve("payload-types.ts"),
  },
});
