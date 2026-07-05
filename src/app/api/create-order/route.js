import Razorpay from 'razorpay'

export async function POST(request) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return Response.json({ error: 'Payment keys not configured' }, { status: 500 })
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })

  const { amount } = await request.json()

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: 'receipt_' + Date.now(),
  })

  return Response.json({ orderId: order.id })
}