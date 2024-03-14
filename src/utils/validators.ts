import { z } from "zod";

// Define the schema for the invoice details
export const changePasswordSchema = z
	.object({
		oldPassword: z.string().nonempty("Old Password is Required").min(4, {
			message: "Old Password must contain at least 4 characters(s)",
		}),
		newPassword: z.string().nonempty("New Password is Required").min(4, {
			message: "New Password must contain at least 4 characters(s)",
		}),
		confirmPassword: z
			.string()
			.nonempty("Confirm Password is Required")
			.min(4, {
				message: "Confirm Password must contain at least 4 characters(s)",
			}),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

	export const registerValidator = {
		firstName: (val: string) =>
			val?.length < 3 ? "First name cannot be less than 3 characters" : null,
		company: (val: string) =>
			val?.length < 3
				? "Company/Project cannot be less than 3 characters"
				: null,
		lastName: (val: string) =>
			val?.length < 3 ? "Last name cannot be less than 3 characters" : null,
		url: (val: string) =>
			val?.length < 3 ? "Url cannot be less than 3 characters" : null,
		terms: (val: boolean) =>
			!val ? "Please accept our terms and conditions" : null,
	};



	export const registerSchema = z.object({
		firstName: z.string().nonempty("FirstName is Required"),
		lastName: z.string().nonempty("LastName is Required"),
		url: z.string().url().nonempty("Url is Required"),
		company: z.string().nonempty("Company Name is required"),
		team: z
			.number()
			.gte(5)
			.or(z.string().regex(/\d+/).transform(Number))
			.refine((n) => n <= 5, "Team size must not be more"),
		terms: z.literal(true, {
			errorMap: () => ({ message: "You must accept the terms & conditions" }),
		}),
	});

	export const loginValidator = {
		email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
	};

	export const addTokensValidator = z.object({
		chain: z.string().nonempty("Chain is Required"),
		contractAddress: z.string().nonempty("Chain is Required"),
		abi: z.any({ required_error: "Abi is Required" }),
		token: z.string().nonempty("Token is Required"),
		chainid: z.any({ required_error: "Chainid is Required" }),
		testnet_chainid: z.any({
			required_error: "Testnet Chainid is Required",
		}),
		is_native: z.boolean(),
	});

	export const updateTokensValidator = z.object({
		chain: z.string().nonempty("Chain is Required"),
		contractAddress: z.string().nonempty("Chain is Required"),
		abi: z.any({ required_error: "Abi is Required" }),
	});

	export const addSubscriptionValidator = z.object({
		subscriptionName: z.string().nonempty("Subscription Name is Required"),
		walletsPerMonth: z
			.number({
				required_error: "Wallets per month is Required",
				invalid_type_error: "Wallets per month is Required",
			})
			.nullish(),
		chains: z.string({ required_error: "Chains is Required" }).array(),
		costPerMonth: z
			.number({
				required_error: "Cost Per Month is Required",
				invalid_type_error: "Cost Per Month is Required",
			})
			.nullish(),
		requests: z
			.number({
				required_error: "Request is Required",
				invalid_type_error: "Request is Required",
			})
			.nullish(),
		paymentAddress: z
			.string({
				required_error: "Payment Address is Required",
				invalid_type_error: "Payment Address is Required",
			})
			.nonempty(),
		paymentChain: z
			.string({
				required_error: "Payment Chain is Required",
				invalid_type_error: "Payment Chain is Required",
			})
			.nonempty(),
		paymentToken: z
			.string({
				required_error: "Payment Duration is Required",
				invalid_type_error: "Payment Duration is Required",
			})
			.nonempty(),
	});

	export const generateInvoice = z.object({
		company: z
			.string({
				required_error: "Company is Required",
				invalid_type_error: "Company is Required",
			})
			.nonempty(),
		plan: z
			.string({
				required_error: "Plan is Required",
				invalid_type_error: "Plan is Required",
			})
			.nonempty(),
		paymentDuration: z
			.string({
				required_error: "Duration is Required",
				invalid_type_error: "Duration is Required",
			})
			.nonempty(),
		amount: z
			.number({
				required_error: "Cost Per Month is Required",
				invalid_type_error: "Cost Per Month is Required",
			})
			.nullish(),
		payment_address: z
			.string({
				required_error: "Payment Address is Required",
				invalid_type_error: "Payment Address is Required",
			})
			.nonempty(),
		token: z
			.string({
				required_error: "Token is Required",
				invalid_type_error: "Token is Required",
			})
			.nonempty(),
		chain: z
			.string({
				required_error: "Payment Chain is Required",
				invalid_type_error: "Payment Chain is Required",
			})
			.nonempty(),
	});