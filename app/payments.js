import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);

export async function checkout() {
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card', 'boleto'],
		// The parameter is optional. The default value of expires_after_days is 3.
		payment_method_options: {
			boleto: {
				expires_after_days: 7
			}
		},
		line_items: [{
			price_data: {
				// To accept `boleto`, all line items must have currency: brl
				currency: 'brl',
				product_data: {
					name: 'T-shirt',
				},
				unit_amount: 2000,
			},
			quantity: 1,
		}],
		mode: 'payment',
		success_url: 'https://localhost:3000/payments/success',
		cancel_url: 'https://localhost:3000/payments/cancel',
	});
}

export async function createPaymentIntent({amount, id}) {
	const pagamento = await stripe.paymentIntents.create({
		amount,
		currency: "USD",
		description: "Famum",
		payment_method: id,
		confirm: true,
		receipt_email: 'vitor36silva@gmail.com'
	}, (payment) => {
		try {

			console.log("Pagamento", pagamento)
			return ({
				message: "Pagamento finalizado!!!",
				sucess: true
			})
		} catch (error) {
			console.log("Erro", error)
			return ({
				message: "O pagamento falhou",
				sucess: false
			})
		}

	})
}

export async function retrievePaymentIntent(id) {
	const balanco = await stripe.balanceTransactions.list(
		{ limit: 3 }, (err, transactions) => {
			if (err) {
				return ({
					error: err.message
				})
			}
			return ({ transactions })
		})
}