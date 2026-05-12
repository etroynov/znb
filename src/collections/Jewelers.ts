import type { CollectionConfig } from "payload";

export const Jewelers: CollectionConfig = {
  slug: "jewelers",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "firstName", "lastName"],
    group: "Users",
  },
  auth: true,
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === "admin") return true;
      if (!user) return false;
      return {
        id: { equals: user.id },
      };
    },
    update: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === "admin") return true;
      if (!user) return false;
      return {
        id: { equals: user.id },
      };
    },
    delete: ({ req: { user } }) => {
      if ((user as unknown as Record<string, unknown>)?.role === "admin") return true;
      return false;
    },
  },
  fields: [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
    },
    {
      type: "text",
      name: "phone",
      label: "Phone",
    },
  ],
};
