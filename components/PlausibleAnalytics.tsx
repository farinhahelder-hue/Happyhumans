export default function PlausibleAnalytics() {
  // Replace with your Plausible domain
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "happyhumans.fr";

  return (
    <script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
