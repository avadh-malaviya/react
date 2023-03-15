const menu = [
  {
    menu: "Favourite",
    icon: "star.svg",
    path: "/",
  },
  {
    menu: "Services",
    icon: "notification.svg",
    path: "/services",
    submenu: [
      {
        menu: "ItRequest",
        icon: "dashboard.svg",
        path: "/services/dashboard",
      },
      {
        menu: "Request",
        icon: "request.svg",
        path: "/services/request",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/services/admin",
      },
    ],
  },
  {
    menu: "HSKP",
    icon: "clean.svg",
    path: "/housekeeping",
    submenu: [
      {
        menu: "Dashboard",
        icon: "dashboard.svg",
        path: "/housekeeping/realtime",
      },
      {
        menu: "Roster",
        icon: "add-guest.svg",
        path: "/housekeeping/roster",
      },
      {
        menu: "Public Area",
        icon: "bulding.svg",
        path: "/housekeeping/publicarea",
      },
      {
        menu: "Lost and Found",
        icon: "announce.svg",
        path: "/housekeeping/lostandfound",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/housekeeping/admin",
      },
    ],
  },
  {
    menu: "Engineering",
    icon: "setting.svg",
    path: "/engineering",
    submenu: [
      {
        menu: "Dashboard",
        icon: "dashboard.svg",
        path: "/engineering/dashboard",
      },
      {
        menu: "Work Request",
        icon: "request.svg",
        path: "/engineering/workrequest",
      },
      {
        menu: "Work Order",
        icon: "book-clock.svg",
        path: "/engineering/workorder",
      },
      {
        menu: "Assets",
        icon: "asset.svg",
        path: "/engineering/assets",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/engineering/admin",
      },
    ],
  },
  {
    menu: "Feedback",
    icon: "feedback.svg",
    path: "/feedback",
    submenu: [
      {
        menu: "Logbook",
        icon: "list-clock.svg",
        path: "/feedback/logbook",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/feedback/admin",
      },
    ],
  },
  {
    menu: "Telephones",
    icon: "telephone.svg",
    path: "/telephone",
    submenu: [
      {
        menu: "Live Calls",
        icon: "phone.svg",
        path: "/telephone/livecalls",
      },
      {
        menu: "Wakeup Calls",
        icon: "clock.svg",
        path: "/telephone/wakeupcalls",
      },
      {
        menu: "Classification",
        icon: "classification.svg",
        path: "/telephone/classification",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/telephone/admin",
      },
    ],
  },
  {
    menu: "Chat",
    icon: "chat.svg",
    path: "/chat",
    submenu: [
      {
        menu: "External Chat",
        icon: "message.svg",
        path: "/chat/externalchat",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/chat/admin",
      },
    ],
  },
  {
    menu: "Calls",
    icon: "calls.svg",
    path: "/calls",
    submenu: [
      {
        menu: "Call Center",
        icon: "phone.svg",
        path: "/calls/callcenter",
      },
      {
        menu: "Recording",
        icon: "microphone.svg",
        path: "/calls/recording",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/calls/admin",
      },
    ],
  },
  {
    menu: "Guests",
    icon: "b-man.svg",
    path: "/guests",
    submenu: [
      {
        menu: "Reservation",
        icon: "book-checked.svg",
        path: "/guests/callcenter",
      },
      {
        menu: "Guest Information",
        icon: "guest.svg",
        path: "/guests/recording",
      },
      {
        menu: "Facilities Log",
        icon: "log.svg",
        path: "/guests/recording",
      },
      {
        menu: "Guest Logbook",
        icon: "book-clock.svg",
        path: "/guests/logbook",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/guests/admin",
      },
    ],
  },
  {
    menu: "Minibar",
    icon: "wine.svg",
    path: "/minibar",
    submenu: [
      {
        menu: "Dashboard",
        icon: "dashboard.svg",
        path: "/minibar/dashboard",
      },
      {
        menu: "Posting/Logs",
        icon: "book-clock.svg",
        path: "/minibar/logs",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/minibar/admin",
      },
    ],
  },
  {
    menu: "Checklist",
    icon: "todo.svg",
    path: "/checklist",
    submenu: [
      {
        menu: "Dashboard",
        icon: "dashboard.svg",
        path: "/checklist/dashboard",
      },
      {
        menu: "Logs",
        icon: "book-clock.svg",
        path: "/checklist/logs",
      },
      {
        menu: "Admin",
        icon: "admin.svg",
        path: "/checklist/admin",
      },
    ],
  },
  {
    menu: "IT",
    icon: "glob.svg",
    path: "/it",
  },
  {
    menu: "Reports",
    icon: "report.svg",
    path: "/reports",
  },
];

export default menu;
