import React from "react";
import { Table } from "react-bootstrap";

function MainLoader() {
  return (
    <div className="card">
      <div className="card-body">
        <Table>
          <tr className="text-center">
            <img
              src={process.env.PUBLIC_URL + "/images/loader.gif"}
              alt="loader"
              width="30px"
            />
          </tr>
        </Table>
      </div>
    </div>
  );
}
export default MainLoader;
