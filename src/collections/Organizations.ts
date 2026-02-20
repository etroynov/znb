import { CollectionConfig } from "payload";

export const Organizations: CollectionConfig = {
  slug: "organizations",
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "type",
      type: "select",
      options: [
        {
          label: "Studio",
          value: "studio",
        },
        {
          label: "Shop",
          value: "shop",
        },
      ],
    },
    {
      name: "logo",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "contacts",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "type",
              type: "select",
              options: [
                {
                  label: "Website",
                  value: "website",
                },
                {
                  label: "Phone",
                  value: "phone",
                },
                {
                  label: "Email",
                  value: "email",
                },
              ],
            },
            {
              name: "value",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "socials",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "select",
              defaultValue: "instagram",
              options: [
                {
                  label: "Instagram",
                  value: "instagram",
                },
                {
                  label: "Facebook",
                  value: "facebook",
                },
              ],
            },
            {
              name: "link",
              type: "text",
              validate: (value: string | null | undefined) => {
                if (!value) {
                  return true;
                }
                try {
                  new URL(value);
                  return true;
                } catch {
                  return "Please enter a valid URL (e.g., https://instagram.com/username)";
                }
              },
            },
          ],
        },
      ],
    },
  ],
};
