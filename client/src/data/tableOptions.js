const columns1 = [
  {
    name: "id",
    options: {
      display: false,
    },
  },
  {
    name: "title",
    label: "Title",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "authors",
    label: "Author",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "condition",
    label: "Condition",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "comments",
    label: "Comments",
    options: {
      filter: true,
      sort: false,
    },
  },
];
const columns2 = [
  {
    name: "title",
    label: "Title",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "authors",
    label: "Author",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "condition",
    label: "Condition",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "dateBorrowed",
    label: "Date Borrowed",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "dateDueForReturn",
    label: "Date Due",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "username",
    label: "Borrowed By",
    options: {
      filter: true,
      sort: false,
    },
  },
];
const columns3 = [
  {
    name: "title",
    label: "Title",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "authors",
    label: "Author",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "condition",
    label: "Condition",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "dateBorrowed",
    label: "Date Borrowed",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "dateDueForReturn",
    label: "Date Due",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "daysLeftToReturn",
    label: "Days Left",
    options: {
      filter: true,
      sort: true,
      sortOrder: "asc",
    },
  },
  {
    name: "username",
    label: "Owned By",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "bookId",
    label: "Book ID",
    options: {
      filter: true,
      sort: true,
      display:"excluded",
      
    },
  },
  {
    name: "book_borrowing_id",
    label: "Borrowing ID",
    options: {
      filter: true,
      sort: true,
      display:"excluded",
      
    },
  },
];

const columns4 = [
  {
    name: "title",
    label: "Title",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "authors",
    label: "Author",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "condition",
    label: "Condition",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "dateBorrowed",
    label: "Pickup Date",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "dateDueForReturn",
    label: "Date Due",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "username",
    label: "Owned By",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "username2",
    label: "Renter",
    options: {
      filter: true,
      sort: true,
    },
  },
];

export { columns1, columns2, columns3, columns4 };
