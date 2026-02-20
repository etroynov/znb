import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { seoPlugin } from "@payloadcms/plugin-seo";
import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import {
  BackgroundColorFeature,
  TextColorFeature,
} from "@payloadcms-toolbox/lexical-color-picker";
import { TextSizeFeature } from "@payloadcms-toolbox/lexical-text-size";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { twoColumn } from "./blocks/twoColumn";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { Organizations } from "./collections/Organizations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  localization: {
    locales: [
      {
        label: "Русский",
        code: "ru",
      },
      {
        label: "Polish",
        code: "pl",
      },
    ],
    defaultLocale: "ru",
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Organizations, Posts, Pages, Tags],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      TextSizeFeature(),
      TextColorFeature({
        predefinedColors: [
          "#000000",
          "#ffffff",
          "#ff0000",
          "#00ff00",
          "#0000ff",
        ],
        defaultColor: "#000000",
        gradients: [
          "linear-gradient(90deg, #ff0000, #ff7f00)", // Red to Orange
          "linear-gradient(90deg, #ff7f00, #ffff00)", // Orange to Yellow
          "linear-gradient(90deg, #00ff00, #00ffff)", // Green to Cyan
          "linear-gradient(90deg, #0000ff, #8b00ff)", // Blue to Purple
          "linear-gradient(90deg, #ff00ff, #ff0080)", // Magenta to Pink
          "linear-gradient(90deg, #000000, #808080)", // Black to Gray
          "linear-gradient(90deg, #ff0000, #0000ff)", // Red to Blue
          "linear-gradient(90deg, #ffd700, #ff69b4)", // Gold to Hot Pink
          "linear-gradient(90deg, #00ffff, #ff00ff)", // Cyan to Magenta
          "linear-gradient(90deg, #32cd32, #1e90ff)", // Lime to Dodger Blue
          "linear-gradient(90deg, #ff4500, #ff1493)", // Orange Red to Deep Pink
          "linear-gradient(90deg, #4169e1, #00ced1)", // Royal Blue to Dark Turquoise
        ],
      }),
      BackgroundColorFeature(),
      FixedToolbarFeature(),
      BlocksFeature({
        blocks: [twoColumn],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: [Pages.slug, Posts.slug],
      uploadsCollection: "media",
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
});
