import { type Options as SO, useSection } from "./useSection.ts";

const CLIENT_NAV_ATTR = "f-client-nav";
const PARTIAL_ATTR = "f-partial";

interface Options<P> extends SO<P> {
  mode?: "replace" | "append" | "prepend";
}

export const usePartialSection = <P>(props: Options<P> = {}) => ({
  [CLIENT_NAV_ATTR]: true,
  [PARTIAL_ATTR]: `${useSection(props)}&fresh-partial=true&partialMode=${
    props.mode || "replace"
  }`,
});
