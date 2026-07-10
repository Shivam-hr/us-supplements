import twilio from 'twilio'

export async function POST(request) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM
  const ownerNumber = process.env.OWNER_WHATSAPP_TO

  if (!accountSid || !authToken || !fromNumber || !ownerNumber) {
    console.error('Twilio env vars missing — skipping WhatsApp notification')
    // Don't fail the whole request just because notification isn't configured yet —
    // the order itself already saved successfully before this route was called.
    return Response.json({ skipped: true, reason: 'Twilio not configured' })
  }

  try {
    const { orderId, fullName, phone, total, items } = await request.json()

    const itemsList = (items || [])
      .map(item => `- ${item.name} x${item.quantity}`)
      .join('\n')

    const messageBody =
      `🛒 New order on US Supplements!\n\n` +
      `Order ID: ${orderId}\n` +
      `Customer: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Total: ₹${total}\n\n` +
      `Items:\n${itemsList}` +
      `Address: ${address}\n` 

    const client = twilio(accountSid, authToken)

    await client.messages.create({
      from: fromNumber,
      to: ownerNumber,
      body: messageBody,
    })

    return Response.json({ sent: true })
  } catch (err) {
    // Log it, but never throw — a failed WhatsApp ping should never undo
    // or block an already-successful order.
    console.error('WhatsApp notification failed:', err.message)
    return Response.json({ sent: false, error: err.message }, { status: 200 })
  }
}