import React from "react";
import { Link, useLocation } from "react-router-dom";
import menu from "../../config/menu";
// import "../../css/pages/sidebar-custom.scss";
function Sidebar(props) {
  const location = useLocation();
  return (
    <>
      {/* sidemenu */}
      <aside className="main-sidebar sidebar-light-primary elevation-4">
        <a
          href={process.env.PUBLIC_URL + "/"}
          className="brand-link text-decoration-none"
        >
          <img
            src={process.env.PUBLIC_URL + "/logo.svg"}
            alt="HotLync Software"
            className="brand-image"
          />
          <span className="brand-text font-weight-light">HotLync Software</span>
        </a>

        <div className="sidebar p-0">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
            >
              {menu.map((item, index) => {
                let active = "",
                  menuopen = "";
                if (
                  location.pathname === item.path ||
                  (item.path !== "/" && location.pathname.startsWith(item.path))
                ) {
                  active = "active";
                }
                if (
                  item.path !== "/" &&
                  location.pathname.startsWith(item.path + "/")
                ) {
                  menuopen = "menu-is-opening menu-open";
                }
                return (
                  <>
                    <li
                      key={index}
                      title={item.menu}
                      className={`nav-item custom-li ${menuopen}`}
                    >
                      <Link
                        to={item.path}
                        className={`nav-link ml-2 ${active}`}
                        alt={item.menu}
                      >
                        <img
                          src={
                            process.env.PUBLIC_URL + `/menu-icons/${item.icon}`
                          }
                          alt={item.menu}
                          className="nav-icon mr-3"
                          style={
                            item.menu == "Minibar"
                              ? { width: "16px" }
                              : { width: "20px" }
                          }
                        />
                        <p className="lato-sidemenu">{item.menu}</p>
                      </Link>
                      {item.submenu && item.submenu.length > 0 && (
                        <ul className="nav nav-treeview">
                          {item.submenu?.map((value, i) => {
                            let subActive = "";
                            if (location.pathname == value.path) {
                              subActive = "sub-active";
                            }
                            return (
                              <li
                                className="nav-item sub-li"
                                title={value.menu}
                                key={i}
                              >
                                <Link
                                  to={value.path}
                                  className={`nav-link ml-2 ${subActive}`}
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      `/menu-icons/sub-menu-icons/${value.icon}`
                                    }
                                    alt={value.menu}
                                    className="nav-icon mr-3 ml-1"
                                    style={{ width: "12px" }}
                                  />
                                  <p className="lato-sidemenu">{value.menu}</p>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  </>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
