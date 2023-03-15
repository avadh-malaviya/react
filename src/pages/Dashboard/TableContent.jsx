import React, { useEffect, useState } from "react";
import realtimeService from "../../services/housekeeping/realtime";
// import { cleaningData as data } from "../../data/cleaning";
// import { all as data } from "../../data/all";
import { Col, Container, Row, Table } from "react-bootstrap";
import Options from "../../common/Options";
import ManualFormModal from "./ManualFormModal";
import HistoryModal from "./HistoryModal";

const TableContent = ({
  slug,
  room,
  status_tag,
  status_arr,
  fetchData,
  searchRoom,
  roomType,
  staff,
}) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [historyModalShow, setHistoryModalShow] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState({});
  const [data, setData] = useState([]);
  const [norecord, setNorecord] = useState([]);
  const [divid, setDivid] = useState(0);
  const [fake, setFake] = useState("");

  useEffect(() => {
    console.log(divid);
  }, [divid]);

  useEffect(() => {
    loadData();
  }, [searchRoom, status_tag]);

  const loadData = () => {
    fetchData({
      status_tags: status_arr[status_tag],
      search_room: searchRoom,
    }).then((res) => {
      let arr = [];
      res?.datalist.map((elem) => {
        if (elem.room_list.length === 0) arr.push(true);
      });
      setNorecord(arr);
      setData(res?.datalist || []);
    });

  };

  useEffect(() => {
    console.log("room data", roomType, staff)
    filterData();
  },[roomType, staff])

  const filterData = async () => {
    // [roomType, staff]
    console.log('[roomType, staff]', [roomType, staff])
    console.log( 'data', data )
    // setData(data.map( r => {
    //   r.room_list = r.room_list.filter( s => s.type === roomType );
    //   return r;
    // } ))
  };

  const closeOpt = async (id) => {
    await setFake("fake call to update state");
    setDivid(id);
  };

  return (
    <>
      <div className="card container-fluid">
        {/* <Table hover borderless size responsive bordered> */}
        <ManualFormModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          {...selectedRoom}
        />
        <HistoryModal
          show={historyModalShow}
          onHide={() => setHistoryModalShow(false)}
          {...selectedRoom}
        />
        <table className="realtime-table">
          {data && data.length > 0 && (
            <tbody className="row">
              {data?.map((item, index) => (
                <React.Fragment>
                  {item?.room_list &&
                    item?.room_list?.length > 0 &&
                    item?.room_list?.filter( s => s.assigne_to === staff || s.type === roomType || roomType === 'All' || roomType === 'All' ).map((room, rindex) => {
                      return (
                        <>
                          <tr
                            key={room?.id}
                            className={
                              divid == room?.id
                                ? "p-0 col-xl-6 d-none"
                                : "p-0 col-xl-6"
                            }
                            onClick={() => setDivid(room?.id)}
                          >
                            <td>{room?.room}</td>
                            <td>
                              {/* 'occuppied' : row.occupancy == 'Occupied', 'vacant' : row.occupancy == 'Vacant' */}
                              <span
                                className={`badge bg ${
                                  room?.occupancy === "Occupied"
                                    ? `bg-success`
                                    : `bg-vacant`
                                } badge-font`}
                              >
                                {room?.occupancy}
                              </span>
                            </td>
                            <td>
                              <span
                                className={
                                  room?.room_status
                                    ? `badge bg bg-${room?.room_status?.toLowerCase()}`
                                    : `badge-outline-skyblue`
                                }
                              >
                                {room?.room_status}
                              </span>
                            </td>
                            <td className="line">{room?.status_name}</td>
                            <td className="line">{room?.type}</td>
                            <td style={{ width: "350px" }} className="line">
                              VIP{room?.vip} - A - {room?.adult} K -{" "}
                              {room?.chld}{" "}
                            </td>
                            <td className="duration line">{room?.duration}</td>
                          </tr>
                          {divid == room?.id ? (
                            <Options
                              roomno={room?.room}
                              close={() => closeOpt(0)}
                              onManualCleanbtn={() => {
                                setSelectedRoom({ room, item });
                                setModalShow(true);
                              }}
                              onViewHistorybtn={() => {
                                setSelectedRoom({ room, item });
                                setHistoryModalShow(true);
                              }}
                              room={room && room}
                              item={item}
                            />
                          ) : (
                            ""
                          )}
                        </>
                      );
                    })}
                </React.Fragment>
              ))}
              {norecord.length == data.length && (
                <Container className="text-center overflow-hidden">
                  No Record Found...
                </Container>
              )}
            </tbody>
          )}
        </table>
        {/* </Table> */}
      </div>
    </>
  );
};

export default TableContent;
