import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { SetAccessToken } from './auth/authSlice';
import { SetUserProfile } from './profile/profileSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: 'https://backend.koumanisdietapp.com',
    //baseUrl: 'http://172.252.13.86:5005',
    // baseUrl: 'http://10.10.20.50:5005',

    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth.accessToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    }
})

// Wrap baseQuery to handle 401 globally
const baseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    const status = result?.error?.status ?? result?.error?.originalStatus;
    
    if (status === 401 || status === 403) {
        api.dispatch(SetAccessToken(null));
        api.dispatch(SetUserProfile(null));
        localStorage.removeItem("accessToken");
    }

    return result;
}

export const tagTypes = {
    USER: "USER",
    RECIPE: "RECIPE",
    REVIEW: "REVIEW",
    FAVORITE: "FAVORITE",
    PROFILE: "PROFILE",
    GROCERY: "GROCERY",
    MEAL_PLAN: "MEAL_PLAN",
    LEGAL: "LEGAL",
    FEATURED: "FEATURED",
    SUBSCRIPTION: "SUBSCRIPTION",
    CATEGORY: "CATEGORY",
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery,

    tagTypes: Object.values(tagTypes),
    endpoints: () => ({})
})
