import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type Location = { pathname: string; search: string; hash: string };
function readLocation(): Location {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}
type Navigation = {
  location: Location;
  navigate: (href: string, replace?: boolean) => void;
};
const NavigationContext = createContext<Navigation | null>(null);

/** Native links stay usable with copy/open-in-new-tab; same-origin page visits use history. */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation);
  const navigate = useCallback((href: string, replace = false) => {
    const url = new URL(href, window.location.origin);
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    setLocation(readLocation());
  }, []);
  useEffect(() => {
    const update = () => setLocation(readLocation());
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const next = new URL(anchor.href);
      if (
        next.origin !== window.location.origin ||
        !["http:", "https:"].includes(next.protocol)
      )
        return;
      if (
        next.pathname === window.location.pathname &&
        next.search === window.location.search &&
        next.hash
      )
        return;
      event.preventDefault();
      navigate(next.href);
    };
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
      document.removeEventListener("click", onClick);
    };
  }, [navigate]);
  useEffect(() => {
    if (location.hash) {
      let id: string;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      document.getElementById(id)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [location.pathname, location.hash]);
  return (
    <NavigationContext value={{ location, navigate }}>
      {children}
    </NavigationContext>
  );
}
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("NavigationProvider eksik.");
  return context;
}
