const formatPrice = (amount: number | string, currency: string) => {
	return new Intl.NumberFormat(currency, {
		style: "currency",
		currency: currency,
	}).format(Number(amount));
};

export default formatPrice;
