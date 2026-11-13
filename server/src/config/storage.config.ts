export type StorageDriver = "local" | "external";

export const storageConfig = {
  driver: (process.env.STORAGE_DRIVER || "local") as StorageDriver,

  local: {
    directory: "uploads",
    publicPath: "/uploads",
  },

  external: {
    // Future provider configuration
  },
};
