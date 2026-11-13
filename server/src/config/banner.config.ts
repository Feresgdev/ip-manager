import fs from "fs";
import path from "path";

export const banner = fs.readFileSync(
  path.resolve(process.cwd(), "server/src/assets/banner.txt"),
  "utf8",
);
