import { debug_graph } from "./graph";
import { debug_parser } from "./parse";
const data = {
  nodes: [
    {
      id: "imbilegw",
      active: false,
    },
    {
      id: "msgbroker",
      active: false,
    },
    {
      id: "tthove",
      active: false,
    },
    {
      id: "aliPlool",
      active: false,
    },
  ],
  edges: [
    {
      id: "imbilegw-msgbroker",
      shape: "line",
      source: "imbilegw",
      target: "msgbroker",
      order: 1,
    },
    {
      id: "msgbroker-tthove",
      shape: "line",
      source: "msgbroker",
      target: "tthove",
      order: 2,
    },
    {
      id: "tthove-imbilegw",
      shape: "line",
      source: "tthove",
      target: "imbilegw",
      order: 3,
    },
    {
      id: "tthove-msgbroker",
      shape: "line",
      source: "tthove",
      target: "msgbroker",
      order: 4,
    },
    {
      id: "aliPlool-msgbroker",
      shape: "line",
      source: "aliPlool",
      target: "msgbroker",
      order: 5,
    },
    {
      id: "imbilegw-aliPlool",
      shape: "line",
      source: "imbilegw",
      target: "aliPlool",
      order: 6,
    },
    {
      id: "tthove-aliPlool",
      shape: "line",
      source: "tthove",
      target: "aliPlool",
      order: 7,
    },
  ],
};

const res = debug_parser();
console.log(res);

debug_graph(res);
