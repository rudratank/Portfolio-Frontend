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
    const MAX_RETRIES = 3;
    const BASE_DELAY = 1000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(`${HOST}/api/auth/admin-profile`, {
          withCredentials: true,
          timeout: 15000, // 15 seconds timeout
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Connection: "keep-alive",
          },
          // Enable axios retry
          "axios-retry": {
            retries: 3,
            retryDelay: (retryCount) => {
              return retryCount * 1000; // 1s, 2s, 3s intervals
            },
          },
        });

        if (response.data?.id && response.data?.email) {
          set({ userinfo: response.data, isLoading: false });
          return true;
        }

        set({ userinfo: null, isLoading: false });
        return false;
      } catch (error) {
        console.error(`Auth check attempt ${attempt} failed:`, error);

        if (attempt === MAX_RETRIES) {
          set({ userinfo: null, isLoading: false });
          return false;
        }

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, BASE_DELAY * Math.pow(2, attempt - 1))
        );
      }
    }
  },
});
