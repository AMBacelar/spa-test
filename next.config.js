/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withLess = require("next-with-less");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const plugins = [
  [
    withPWA,
    {
      pwa: {
        dest: "public",
        runtimeCaching,
      },
    },
  ],
  [
    withLess,
    {
      lessLoaderOptions: {
        /* ... */
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  /* ... */
});
