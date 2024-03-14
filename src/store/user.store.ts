import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface IUser {
	email?: string;
	wallet_address: string;
}

interface UserState {
	user: null | IUser;
	isIdle: boolean;
	setIsIdle: (state: boolean) => void;
	setUser: (user: IUser | null) => void;
	removeUser: () => void;
}

const User = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			isIdle: false,
			setIsIdle: (state) => set(() => ({ isIdle: state })),
			setUser: (user) => set(() => ({ user })),
			removeUser: () => set(() => ({ user: null })),
		}),
		{
			name: "user-store",
		},
	),
);

export default User;
