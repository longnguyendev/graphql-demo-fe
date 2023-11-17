import { FieldMergeFunction } from "@apollo/client";

export const merge: FieldMergeFunction = (existing, incoming, { args }) =>
  !args?.after
    ? incoming
    : {
        ...incoming,
        ...(existing && {
          ...(existing.nodes && {
            nodes: [...existing.nodes, ...incoming.nodes],
          }),
          ...(existing.edges && {
            edges: [...existing.edges, ...incoming.edges],
          }),
        }),
      };
