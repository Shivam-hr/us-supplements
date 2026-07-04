import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  try {
    const { amount } = await request.json()

    console.log('Key ID:', process.env.RAZORPAY_KEY_ID)
    console.log('Amount:', amount)

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    })

    return Response.json({ orderId: order.id })
  } catch (error) {
    console.error('Razorpay error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}