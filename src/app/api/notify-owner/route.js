import twilio from 'twilio'

export async function POST(request) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM
  const ownerNumber = process.env.OWNER_WHATSAPP_TO

  if (!accountSid || !authToken || !fromNumber || !ownerNumber) {
    console.error('Twilio env vars missing — skipping WhatsApp notification')
    return Response.json({ skipped: true, reason: 'Twilio not configured' })
  }

  try {
    // Defaults added for every field — if checkout ever forgets to send one,
    // this will never crash with "X is not defined" again.
    const {
      orderId = 'N/A',
      fullName = 'N/A',
      phone = 'N/A',
      address = 'N/A',
      total = 0,
      items = [],
    } = await request.json()

    const itemsList = items
      .map(item => `- ${item.name} x${item.quantity}`)
      .join('\n')

    const messageBody =
      `🛒 New order on US Supplements!\n\n` +
      `Order ID: ${orderId}\n` +
      `Customer: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n` +
      `Total: ₹${total}\n\n` +
      `Items:\n${itemsList}`

    const client = twilio(accountSid, authToken)

    await client.messages.create({
      from: fromNumber,
      to: ownerNumber,
      body: messageBody,
    })

    return Response.json({ sent: true })
  } catch (err) {
    console.error('WhatsApp notification failed:', err.message)
    return Response.json({ sent: false, error: err.message }, { status: 200 })
  }
}