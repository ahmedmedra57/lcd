import { createSlice } from "@reduxjs/toolkit";

// This is for admin  TES/ESS-add element to bank
const ssrDescriptionSlice = createSlice({
  name: "ssrDescription",
  initialState: {
    partNumberSuggestions: [],
    elementsOptions: [],
    lastAddedElement: {
      elementName: "",
      partNumber: "",
      current: "",
      wattage: "",
      voltage: "",
      lengths: "",
    },
  },
  reducers: {
    handleAddNewElement: (state, action) => {
      const elements = action.payload?.map((item) => {
        return item.partNumber;
      });
      state.elementsOptions = action.payload;
      state.partNumberSuggestions = elements;
    },
    handleConfirmAddNewElement: (state, action) => {
      state.lastAddedElement = action.payload;
      state.partNumberSuggestions = [...state.partNumberSuggestions, action.payload.partNumber];
      state.elementsOptions = [...state.elementsOptions, action.payload];
    },
  },
});

export default ssrDescriptionSlice;
export const selectDescription = (state) => state.ssrDescription;
export const { handleAddNewElement, handleConfirmAddNewElement } = ssrDescriptionSlice.actions;
