import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: [],
  reducers: {
    addConnections: (state, action) => {
      return action.payload || [];
    },
    addConnection: (state, action) => {
      const newConn = action.payload;
      if (!newConn || !newConn._id) return;
      const exists = state.find((c) => c._id === newConn._id);
      if (!exists) state.push(newConn);
    },
    updateConnections: (state, action) => {
      const updated = action.payload;
      if (!updated || !updated._id) return;

      const index = state.findIndex((c) => c._id === updated._id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updated };
      }
    },
    removeConnection: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((c) => c._id !== idToRemove);
    },
    clearConnections: () => {
      return [];
    },
  },
});

export const {
  addConnection,
  addConnections,
  updateConnections,
  removeConnection,
  clearConnections,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
