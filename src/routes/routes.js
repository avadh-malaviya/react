import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NoFound";
import Login from "../pages/Login";
import Test from "../pages/Test";
import DummyDashboard from "../pages/DummyDashboard";
import RosterAllocation from "../pages/RosterAllocation";
import Profile from "../pages/Profile";
import WorkRequest from "../pages/Engineering/WorkRequest";
import ItRequest from "../pages/Engineering/ItRequest";
import Feedback from "../pages/Engineering/Feedback";
import Asset from "../pages/Asset";
import WorkOrder from "../pages/Engineering/WorkOrder";
import GuestServiceSettings from "../pages/Profile/Setting";

const routes = [
  {
    path: "/",
    exact: true,
    element: DummyDashboard,
  },
  {
    path: "/housekeeping",
    exact: true,
    element: Test,
  },
  {
    path: "/housekeeping/realtime",
    exact: true,
    element: Dashboard,
  },
  {
    path: "/housekeeping/roster",
    exact: true,
    element: RosterAllocation,
  },
  {
    path: "/guests/logbook",
    exact: true,
    element: Profile,
  },
  {
    path: "/guests/logbook/settings",
    exact: true,
    element: GuestServiceSettings,
  },
  {
    path: "/engineering/workrequest",
    exact: true,
    element: WorkRequest,
  },
  {
    path: "/it",
    exact: true,
    element: ItRequest,
  },
  {
    path: "/feedback/logbook",
    exact: true,
    element: Feedback,
  },
  {
    path: "/engineering/workorder",
    exact: true,
    element: WorkOrder,
  },
  {
    path: "/engineering/assets",
    exact: true,
    element: Asset,
  },
  {
    path: "/login",
    exact: true,
    auth: true,
    element: Login,
  },
  {
    path: "/test",
    exact: true,
    element: Test,
  },
  {
    path: "*",
    exact: true,
    element: NotFound,
  },
];

export default routes;
