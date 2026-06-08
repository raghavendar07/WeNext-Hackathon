export function ShopifyLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16.83 5.36c-.05-.04-.13-.06-.2-.06-.04 0-.78.06-.78.06s-.52-.51-.57-.57c-.06-.05-.17-.04-.21-.03-.01 0-.18.06-.46.14-.27-.78-.74-1.5-1.6-1.5h-.07c-.24-.31-.54-.45-.79-.45-2 0-2.95 2.5-3.25 3.78-.78.24-1.33.41-1.4.43-.43.14-.45.15-.51.56-.04.31-1.18 9.13-1.18 9.13L13.6 18l4.74-1.02s-1.49-10.12-1.5-10.18a.27.27 0 0 0-.01-.44ZM13.6 4.6c.04 0 .07.02.11.04-.4.18-.84.66-1.02 1.62l-1.16.36c.22-.78.71-2.02 2.07-2.02ZM12.4 6.92l-.96.3c.13-.92.55-1.62 1.04-1.96.18.41.27 1 .27 1.66h-.35Zm.4-2.05c.4.05.7.51.85 1.13l-1.32.41c0-.69.27-1.27.47-1.54Z"
        fill="#95BF47"
      />
      <path
        d="M16.63 5.3c-.07 0-.81.06-.81.06s-.51-.51-.57-.57a.13.13 0 0 0-.07-.04l-.7 13.25 4.74-1.02s-1.49-10.12-1.5-10.18a.27.27 0 0 0-.27-.23 6.6 6.6 0 0 0-.82-1.27Z"
        fill="#5E8E3E"
      />
      <path
        d="M13.4 9.13 12.83 11s-.55-.3-1.22-.3c-.99 0-1.04.62-1.04.78 0 .85 2.22.93 2.22 2.7 0 1.39-.88 2.28-2.07 2.28-1.43 0-2.16-.89-2.16-.89l.39-1.27s.75.65 1.39.65c.41 0 .58-.32.58-.56 0-1.11-1.83-1.16-1.83-2.78 0-1.36.97-2.67 3.2-2.67.76 0 1.13.18 1.13.18Z"
        fill="white"
      />
    </svg>
  );
}

export function WooCommerceLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#7F54B3" />
      <path
        d="M5 9h2.5l.8 4.6L9.7 9h2l1.4 4.6L13.9 9H16l-1.5 6.5h-2L11 11.2 9.5 15.5h-2L5 9Z"
        fill="white"
      />
    </svg>
  );
}

export function PetPoojaLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#E91E63" />
      <path
        d="M9 7h3.4c1.7 0 2.8 1 2.8 2.5 0 1.6-1.2 2.6-3 2.6h-1.6V17H9V7Zm1.6 1.5v2.2h1.5c.8 0 1.4-.4 1.4-1.1s-.5-1.1-1.4-1.1h-1.5Z"
        fill="white"
      />
    </svg>
  );
}

export function WeNextLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#1EB677" />
      <path
        d="M5 8h2l1.2 5L9.6 8h1.7l1.4 5L14 8h2l-2.2 8.5h-1.8L10.5 11l-1.5 5.5H7.2L5 8Z"
        fill="white"
      />
    </svg>
  );
}

export const PLATFORM_META = {
  shopify:     { id: "shopify",     label: "Shopify",     Logo: ShopifyLogo },
  woocommerce: { id: "woocommerce", label: "WooCommerce", Logo: WooCommerceLogo },
  petpooja:    { id: "petpooja",    label: "PetPooja",    Logo: PetPoojaLogo },
  wenext:      { id: "wenext",      label: "WeNext",      Logo: WeNextLogo },
};

export function PlatformLogo({ id, size = 16 }) {
  const meta = PLATFORM_META[id];
  if (!meta) return null;
  const { Logo } = meta;
  return <Logo size={size} />;
}
