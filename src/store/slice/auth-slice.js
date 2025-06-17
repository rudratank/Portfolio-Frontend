import axios from "axios";
import { HOST, LOGIN_ROUTE } from "@/lib/constant";

export const createAuthSlice = (set, get) => ({
  userinfo: null,
  isLoading: true,

  setIsLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setUserInfo: (userinfo) =>
    set({
      userinfo,
      isLoading: false,
    }),

  logout: async () => {
    try {
      await axios.post(
        `${HOST}/api/auth/admin-logout`,
        {},
        {
          withCredentials: true,
        }
      );

      set({
        userinfo: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the state even if the API call fails
      set({
        userinfo: null,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    try {
      // console.log("Checking auth with:", `${HOST}/api/auth/admin-profile`);

      const response = await axios.get(`${HOST}/api/auth/admin-profile`, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      //console.log("Auth check response:", response.data);

      // Check if response contains user data (not error message)
      if (response.data && response.data.id && response.data.email) {
        set({
          userinfo: response.data,
          isLoading: false,
        });
        return true;
      }

      // If response doesn't have proper user data, treat as unauthenticated
      //console.log("Invalid user data in response:", response.data);
      set({
        userinfo: null,
        isLoading: false,
      });
      return false;
    } catch (error) {
      console.error("Auth check error:", error.response?.data || error.message);

      // Don't treat errors as user info
      set({
        userinfo: null,
        isLoading: false,
      });
      return false;
    }
  },
});
