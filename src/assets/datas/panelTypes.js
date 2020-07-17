export let panelTypes = [
  {
    id: 100,
    hasCaret: true,
    icon: "folder-close",
    label: "Line",
    type: "graph",
    isExpanded: true,
    childNodes: [
      {
        id: 100,
        icon: "document",
        label: "Status Code",
        data: "statuscode",
      },
      {
        id: 110,
        icon: "document",
        label: "Body Sent",
        data: "bodysent",
      },
    ],
  },
  {
    id: 200,
    icon: "folder-close",
    label: "Pie",
    childNodes: [
      {
        id: 2,
        icon: "document",
        label: "Referer",
        data: "referer",
      },
      {
        id: 4,
        icon: "document",
        label: "Browser",
        data: "referer",
      },
    ],
  },
];
