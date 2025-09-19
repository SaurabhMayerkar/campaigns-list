import { configureStore } from "@reduxjs/toolkit";
import userReducer, { fetchUsers } from "../userSlice";
import { User } from "@/types/user.types";

// Mock fetch
global.fetch = jest.fn();

const createTestStore = () => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
  });
};

describe("userSlice", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  it("should set loading to true when fetchUsers is pending", () => {
    const action = { type: fetchUsers.pending.type };
    store.dispatch(action);
    const state = store.getState().users;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should set users when fetchUsers is fulfilled", () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        phone: "123-456-7890",
        website: "johndoe.com",
        company: {
          name: "Test Company",
          catchPhrase: "Test Phrase",
          bs: "Test BS",
        },
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: {
            lat: "",
            lng: "",
          },
        },
      },
    ];

    store.dispatch(fetchUsers.fulfilled(mockUsers, "", undefined));

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.users).toEqual(mockUsers);
    expect(state.error).toBeNull();
  });

  it("should set error when fetchUsers is rejected", () => {
    const errorMessage = "Failed to fetch users";
    const action = {
      type: fetchUsers.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage },
    };
    store.dispatch(action);

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.users).toEqual([]);
  });

  it("should fetch users successfully", async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        phone: "123-456-7890",
        website: "johndoe.com",
        company: {
          name: "Test Company",
          catchPhrase: "Test Phrase",
          bs: "Test BS",
        },
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: {
            lat: "",
            lng: "",
          },
        },
      },
    ];

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.users).toEqual(mockUsers);
    expect(state.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users"
    );
  });

  it("should handle fetch error", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Error("Network error")
    );

    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Network error");
    expect(state.users).toEqual([]);
  });
});
