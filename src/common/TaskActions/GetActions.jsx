import {
  ASSIGN,
  COMMENT_ACTION,
  CANCEL_ACTION,
  COMPLETE_ACTION,
  HOLD_ACTION,
  EXTEND_ACTION,
  RESUME_ACTION,
  SCHEDULED_ACTION,
  OPEN_ACTION,
  CLOSE_ACTION,
} from "./Actions";
import * as Status from "./Status";

export const makeDropOption = (text, value = null) => {
  return { text, value: value == null ? text : value };
};

export const makeSelectDropOption = (label, value = null) => {
  return { label, value: value == null ? label : value };
};

export const GetActions = (task) => {
  if (task.dispatcher < 1 && task.status_id !== 3 && task.status_id !== 4) {
    return [ASSIGN];
  } else {
    switch (task.status_id) {
      case Status.STATUS_OPEN:
        if (task.queued_flag === 1)
          // Queued
          return [COMMENT_ACTION, CANCEL_ACTION];
        else if (task.running === 1)
          // running
          return [
            COMMENT_ACTION,
            COMPLETE_ACTION,
            CANCEL_ACTION,
            HOLD_ACTION,
            EXTEND_ACTION,
          ];
        else return [COMMENT_ACTION, RESUME_ACTION, CANCEL_ACTION];
      case Status.STATUS_ESCALATED:
        if (task.queued_flag === 1) return [COMMENT_ACTION, CANCEL_ACTION];
        else if (task.running === 1)
          return [COMMENT_ACTION, COMPLETE_ACTION, CANCEL_ACTION, HOLD_ACTION];
        else return [COMMENT_ACTION, RESUME_ACTION, CANCEL_ACTION];

      case Status.STATUS_TIMEOUT:
        if (task.queued_flag === 0) return [CLOSE_ACTION, COMMENT_ACTION];
        else return [];
      case Status.STATUS_SCHEDULED:
        return [SCHEDULED_ACTION, OPEN_ACTION, CANCEL_ACTION];
      case Status.STATUS_ASSIGNED:
      case Status.STATUS_ESCALATED2:
      case Status.STATUS_UNATTENDED:
        return [CANCEL_ACTION];

      default:
        return [CANCEL_ACTION];
    }
  }
};

export const GetActionOptions = (task) => {
  const actions = GetActions(task);
  return actions.map((action) => makeSelectDropOption(action));
};

export const ListOptions = (list) => {
  return list.map((item) => makeDropOption(item));
};
